<script>
  import IButton from 'iview/src/components/button/button.vue'
  import ComplexInput from '../../components/common/ComplexInput.vue'
  import { BASE_URL } from '../../config/const'
  import { showAlert, getVerificationCode } from '../../config/functions'

  export default {
    name: 'changePhoneModal',

    props: {
      currPhoneNum: {
        type: String
      },
      boxType: {
        type: String,
        default: '1'
      }
    },

    data () {
      return {
        bindPhoneData: {
          phoneNum: '',
          picCode: '',
          code: ''
        },

        changePhoneData: {
          phoneNum: '',
          picCode: '',
          code: ''
        },

        modifyPwd: {
          currPwd: '',
          newPwd: '',
          confirmPwd: ''
        },

        picCodeSrc: '',

        canSubmit: true,
        phoneNum: '',
        timeRemain: 0,
        timer: null,
        picCodeTimeTag: ''
      }
    },

    methods: {
      // 关闭弹出层
      closeBindPhoneModal() {
        this.$emit('close')
      },

      // 获取图片验证码
      getNewPicCode () {
        this.picCodeTimeTag = +new Date();
        this.picCodeSrc = BASE_URL + 'home/public/getPicVerificationCode.do?timeTag=' + this.picCodeTimeTag
      },

      // 获取验证码
      getCode(data) {
        if (!this.canSubmit) return;
        if (this.boxType === '2-2' && this.phoneNum === data.phoneNum) {
          showAlert("手机号不能相同！");
          return;
        }
        this.canSubmit = false;

        clearInterval(this.timer);
        getVerificationCode(data.phoneNum, false, data.picCode, this.picCodeTimeTag).then(
          () => {
            this.timeRemain = 60;
            this.timer = setInterval(() => {
              if (this.timeRemain > 0) {
                this.timeRemain -= 1
              } else {
                clearInterval(this.timer)
              }
            }, 1000);
            this.canSubmit = true;
          },
          () => {
            this.canSubmit = true
          }
        )
      },

      // 绑定手机号码
      bindPhoneNum (param) {
        if (!this.canSubmit) return;
        this.canSubmit = false;
        if (param.code && param.phoneNum) {
          this.$httpPost('home/user/updateMobile.do', {
            mobile: param.phoneNum,
            mobileCode: param.code
          }).then(
            () => {
              this.isModalShow = false
              clearInterval(this.timer)
              this.timeRemain = 0
              this.timer = null
              this.getNewPicCode()
              this.canSubmit = true
              this.$emit('changePhone', param.phoneNum)
              this.closeBindPhoneModal()
            },
            (err) => {
              showAlert(err.message);
              this.getNewPicCode();
              this.canSubmit = true;
            }
          )
        }
      },
      handleChangePhoneNum() {
        this.$emit('changePhone', this.bindPhoneData.phoneNum)
        this.closeBindPhoneModal()
      }
    },

    created() {
      this.getNewPicCode()
      this.changePhoneData.phoneNum = this.currPhoneNum
    },

    components: {
      ComplexInput,
      IButton
    }
  }
</script>

<template>
  <div class="modal"
       @mousewheel.stop.prevent @touchstart.self.stop.prevent
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
          v-if="$route.name==='setting'"
          type="primary"
          :disabled="bindPhoneData.code === ''"
          long
          style="height: 48px;margin: 12px 0;"
          @click="bindPhoneNum(bindPhoneData)">确认提交
        </i-button>
        <i-button
          v-else
          type="primary"
          :disabled="bindPhoneData.code === ''"
          long
          @click="handleChangePhoneNum"
          style="height: 48px;margin: 12px 0;">确认提交
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
          @click="verifyOldPhoneCode(changePhoneData)">下一步
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
</template>


<style scoped lang="stylus">

</style>
