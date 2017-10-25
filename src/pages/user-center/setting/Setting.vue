<script>
  import Setting from './Setting'

  export default Setting
</script>

<style scoped lang="stylus">
  @import './Setting.styl'
</style>

<template>
  <div class="user-center" v-if="loaded">
    <div id="setting-box" class="card-style">
      <header>账号设置</header>
      <section class="setting-list">
        <Collapse v-model="currShow" accordion>
          <!-- 基本资料 -->
          <Panel name="1">
            <panel-state :currShow="currShow" curr="1">基本资料</panel-state>
            <div slot="content" class="basic-info">
              <i-form ref="basic" :model="basic" :label-width="100" :rules="basicRuleInline">
                <Form-item label="姓名：" prop="username">
                  <i-input v-model="basic.username" placeholder="请输入姓名"></i-input>
                </Form-item>
                <Form-item label="性别：">
                  <Radio-group v-model="basic.gender">
                    <Radio label="man">男</Radio>
                    <Radio label="woman">女</Radio>
                    <Radio label="secrecy">保密</Radio>
                  </Radio-group>
                </Form-item>
                <Form-item label="所在地：" prop="location">
                  <Cascader
                    :data="casData"
                    :load-data="getCity"
                    v-model="basic.location"
                    :placeholder="locationPlaceholder"></Cascader>
                </Form-item>
                <Form-item label="个性签名：" prop="bio">
                  <i-input
                    v-model="basic.bio"
                    type="textarea"
                    placeholder="编写个性签名"
                    :autosize="{minRows: 2}"></i-input>
                </Form-item>
                <Form-item label="个人简介：" prop="intro">
                  <i-input v-model="basic.intro" placeholder="编写简短的介绍"></i-input>
                </Form-item>
                <Form-item>
                  <i-button type="primary" @click="saveBasic('basic')">保存</i-button>
                </Form-item>
              </i-form>
            </div>
          </Panel>
          <!-- 用户头像 -->
          <Panel name="2">
            <panel-state :currShow="currShow" curr="2">我的头像</panel-state>
            <div slot="content" class="avatar-change">
              <div class="card-style">
                <Spin fix v-if="loadingAvatar">加载中...</Spin>
                <label for="settingAvatar" class="avatar-box">
                  <img :src="avatar" alt="avatar" @load="imgLoaded">
                </label>
              </div>
              <input id="settingAvatar" type="file" style="display: none;" @change="imgChange" accept="image/png,image/jpg,image/jpeg">
              <i-button type="ghost" class="submit-btn" @click="saveAvatar">上传头像</i-button>
            </div>
          </Panel>
          <!-- 修改密码 -->
          <Panel name="3">
            <panel-state :currShow="currShow" curr="3">修改密码</panel-state>
            <div slot="content" class="modify-pwd">
              <i-form :model="modifyPwd" :label-width="100" ref="modifyPwd" :rules="modifyPwdRuleInline">
                <Form-item label="当前密码：" prop="currPwd">
                  <i-input v-model="modifyPwd.currPwd" type="password" placeholder="请输入当前在用的密码"></i-input>
                </Form-item>
                <Form-item label="新密码：" prop="newPwd" required>
                  <i-input v-model="modifyPwd.newPwd" type="password" placeholder="请输入新的密码"></i-input>
                </Form-item>
                <Form-item label="确认新密码：" prop="confirmPwd" required>
                  <i-input v-model="modifyPwd.confirmPwd" type="password" placeholder="请再次输入新的密码"></i-input>
                </Form-item>
                <Form-item>
                  <i-button type="primary" class="submit-btn" @click="saveNewPwd">保存</i-button>
                </Form-item>
              </i-form>
            </div>
          </Panel>
          <!-- 账号关联 -->
          <Panel name="4">
            <panel-state :currShow="currShow" curr="4">账号关联</panel-state>
            <div slot="content" class="associated-account">
              <associate v-for="(item, index) in associateList" :key="index" :associate-data="item"></associate>
            </div>
          </Panel>
        </Collapse>
      </section>
    </div>

    <div class="modal" v-if="confirmUnbind" @click.self="confirmUnbind = false">
      <div class="unbind">
        <p align="center">请输入登录密码</p>
        <br>
        <complex-input v-model="pwd" type="password" placeholder="请输入登录密码"></complex-input>
        <i-button
          type="primary"
          :disabled="pwd === ''"
          long
          style="height: 48px;margin: 12px 0;"
          @click="unbindQ()">确认提交
        </i-button>
      </div>
    </div>

    <!-- 弹出层 -->
    <div class="modal"
         v-if="isModalShow"
         @mousewheel.stop.prevent
         @touchstart.self.stop.prevent
         @click.self="closeBindPhoneModal">
      <div class="phone-change-box" v-if="boxType === '1'">
        <span class="close-icon" @click="closeBindPhoneModal"><i class="iconfont icon-x"></i></span>
        <h4>绑定手机号</h4>
        <div class="box-content">
          <complex-input v-model="bindPhoneData.phoneNum" type="text" placeholder="输入手机号码"></complex-input>
          <complex-input v-model="bindPhoneData.picCode" type="text" placeholder="图片验证码">
            <button
              type="button"
              slot="append"
              @click="getNewPicCode()">
              <img
                :src="picCodeSrc"
                alt="图片验证"
                title="点击更换图片"
                style="position: absolute; left: 0; top: 0;height: 46px">
            </button>
          </complex-input>
          <complex-input v-model="bindPhoneData.code" type="text" placeholder="验证码">
            <button type="button" slot="append" @click="getCode(bindPhoneData)" :disabled="timeRemain !== 0">
              {{ timeRemain === 0 ? '获取验证码' : timeRemain }}
            </button>
          </complex-input>
          <i-button
            type="primary"
            :disabled="bindPhoneData.code === ''"
            long
            style="height: 48px;margin: 12px 0;"
            @click="bindPhoneNum(bindPhoneData)">确认提交
          </i-button>
        </div>
      </div>

      <div class="phone-change-box" v-if="boxType === '2-1'">
        <span class="close-icon" @click="closeBindPhoneModal"><i class="iconfont icon-x"></i></span>
        <h4>绑定新手机号</h4>
        <div class="box-content">
          <p>旧手机： {{ changePhoneData.phoneNum | encode }}</p>
          <complex-input v-model="changePhoneData.picCode" type="text" placeholder="图片验证码">
            <button
              type="button"
              slot="append"
              @click="getNewPicCode()">
              <img
                :src="picCodeSrc"
                alt="图片验证"
                title="点击更换图片"
                style="position: absolute; left: 0; top: 0;height: 46px">
            </button>
          </complex-input>
          <complex-input v-model="changePhoneData.code" type="text" placeholder="验证码">
            <button
              type="button"
              slot="append"
              @click="getCode(changePhoneData)"
              :disabled="timeRemain !== 0">
              {{ timeRemain === 0 ? '获取验证码' : timeRemain }}
            </button>
          </complex-input>
          <i-button
            type="primary"
            :disabled="changePhoneData.code === ''"
            long
            style="height: 48px;margin: 12px 0;"
            @click="verifyOldPhoneCode(changePhoneData)">确认提交
          </i-button>
        </div>
      </div>

      <div class="phone-change-box" v-if="boxType === '2-2'">
        <span class="close-icon" @click="closeBindPhoneModal"><i class="iconfont icon-x"></i></span>
        <h4>绑定新手机号</h4>
        <div class="box-content">
          <complex-input v-model="newPhoneData.phoneNum" type="text" placeholder="输入手机号码"></complex-input>
          <complex-input v-model="newPhoneData.picCode" type="text" placeholder="图片验证码">
            <button
              type="button"
              slot="append"
              @click="getNewPicCode()">
              <img
                :src="picCodeSrc"
                alt="图片验证"
                title="点击更换图片"
                style="position: absolute; left: 0; top: 0;height: 46px">
            </button>
          </complex-input>
          <complex-input v-model="newPhoneData.code" type="text" placeholder="验证码">
            <button
              type="button"
              slot="append"
              @click="getCode(newPhoneData)"
              :disabled="timeRemain !== 0">{{ timeRemain === 0 ? '获取验证码' : timeRemain }}
            </button>
          </complex-input>
          <i-button
            type="primary"
            :disabled="newPhoneData.code === ''"
            long
            style="height: 48px;margin: 12px 0;"
            @click="bindPhoneNum(newPhoneData)">确认提交
          </i-button>
        </div>
      </div>
    </div>
  </div>
</template>
