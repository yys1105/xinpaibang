<template>
  <div class="company-page">
    <header class="company-page-header">
      <Row>
        <i-col span="4" class="text-left co-banner">
          <img :src="logo" v-if="!logoHasChanged">
          <img :src="logoTemp" v-if="logoHasChanged">
          <div class="cover">
            <a v-if="logoHasChanged" @click="handleLogoSave">保存</a>
            <a v-if="logoHasChanged" @click="logoHasChanged=false">取消</a>
            <label v-if="!logoHasChanged">
              <a>点击更换logo</a>
              <input type="file" hidden accept="image/jpeg,image/jpg,image/png" @change="handleChangeLogo">
            </label>
          </div>
        </i-col>
        <i-col span="16" class="text-center">
          <h1 class="co-name clearfix">{{ coInfo.name }}
            <img src="" v-lazy="coInfo.reputation">
            <img src="" v-lazy="coInfo.memberTag">
            <router-link :to="{ name: 'modifyCoName', params: { id: cid } }" class="title-modify link">修改企业名称
            </router-link>
          </h1>
        </i-col>
        <i-col span="4" class="co-banner-right">
          <img :src="rightImg" v-if="!hasChanged">
          <img :src="tempImg" v-if="hasChanged">
          <div class="cover right-img-cover">
            <template v-if="hasChanged">
              <a @click="handleSave">保存</a>
              <a @click="hasChanged=false">取消</a>
            </template>
            <template v-else>
              <label>
                <a>点击更换图片</a>
                <input type="file" hidden accept="image/jpeg,image/jpg,image/png" @change="handleChangImg">
              </label>
              <p class="cover-bottom-text"><a @click="showLinkListPanel('Right', rightImgLink)">更换该图片点击跳转地址</a></p>
            </template>
          </div>
        </i-col>
      </Row>
    </header>
    <div class="tab-list">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="{'tab': true, 'active': currentTab === item.index}"
        v-text="item.label"
        @click="currentTab = item.index"></div>
    </div>
    <div class="tab-content">
      <co-main v-if="currentTab === 0" @changeTab="handleChangeTabEmit" :info="coInfo"></co-main>
      <co-case v-else-if="currentTab === 1"></co-case>
      <co-docs v-else-if="currentTab === 2" :info="coInfo" @needUpdate="getCoInfo"></co-docs>
      <co-product-list v-else-if="currentTab === 3"></co-product-list>
      <co-info v-else-if="currentTab === 4" :info="coInfo" @needUpdate="getCoInfo"></co-info>
      <co-contract-us v-else-if="currentTab === 5" :info="coInfo" @updateCoInfo="getCoInfo"></co-contract-us>
    </div>

    <link-list-panel
      :current-link="linkListCurrent"
      :type="linkListType"
      v-if="linkListShowPanel"
      @close="closeLinkListPanel"
      @submitSucc="getRightImg"></link-list-panel>

  </div>
</template>

<script>
  import MyCoComponents from '../../../../components/my-co-index'
  import {showAlert, handleImgUpdate} from '../../../../config/functions'

  export default {
    name: 'coPage',

    data() {
      return {
        tabList: [
          {label: '首页', index: 0},
          {label: '产品', index: 3},
          {label: '案例', index: 1},
          {label: '公司档案', index: 2},
          {label: '关于我们', index: 4},
          {label: '联系我们', index: 5}
        ],
        coInfo: {},
        currentTab: 0,

        logo: '',
        logoTemp: '',
        logoHasChanged: false,

        rightImg: '',
        rightImgLink: '',
        tempImg: '',
        hasChanged: false,

        linkListShowPanel: false,
        linkListCurrent: '',
        linkListType: ''
      }
    },

    computed: {
      cid() {
        return this.$route.params.id
      }
    },

    methods: {
      // 打开选择链接列表的弹出框
      showLinkListPanel(type, str) {
        this.linkListCurrent = str;
        this.linkListType = type;
        this.linkListShowPanel = true
      },

      // 关闭选择链接列表的弹出框
      closeLinkListPanel() {
        this.linkListShowPanel = false;
        this.linkListCurrent = '';
        this.linkListType = ''
      },

      // logo 预展示
      handleChangeLogo(e) {
        let imgList = [...e.target.files];
        handleImgUpdate(imgList)
          .then(data => {
            this.logoTemp = data;
            this.logoHasChanged = true;
            e.target.value = ''
          })
          .catch(err => {
            console.log(err);
            e.target.value = ''
          })
      },

      // 保存logo 修改
      handleLogoSave() {
        this.$httpPost('home/user/changeLogoOfCompany.do', {
          cid: this.cid,
          val: this.logoTemp
        }).then(data => {
          showAlert(data.data);
          this.logo = this.logoTemp;
          this.logoHasChanged = false
        }).catch(err => {
          console.log(err);
          showAlert(err.message)
        })
      },

      // 右侧 url 广告位保存图片
      handleSave() {
        this.$httpPost('home/user/changeRightBanner.do', {
          cid: this.cid,
          val: this.tempImg
        }).then(data => {
          showAlert(data.data);
          this.rightImg = this.tempImg;
          this.hasChanged = false
        }).catch(err => {
          console.log(err);
          showAlert(err.message)
        })
      },

      // 右侧 url 广告位预上传
      handleChangImg(e) {
        let imgList = [...e.target.files];
        handleImgUpdate(imgList)
          .then(data => {
            this.tempImg = data;
            this.hasChanged = true;
            e.target.value = ''
          })
          .catch(err => {
            console.log(err);
            e.target.value = ''
          })
      },

      // 获取公司信息
      getCoInfo() {
        return this.$httpGet('home/company/getCompanyInform.do', {
          cid: this.cid
        }).then(data => {
          this.coInfo = data.data;
          this.logo = data.data.logo
        })
      },

      // 获取顶部右侧的图片
      getRightImg() {
        return this.$httpGet('home/company/getCompanyHomeTopRight.do', {
          cid: this.cid
        }).then(data => {
          console.log(data.data);

          this.rightImg = data.data.val;
          let val = JSON.parse(data.data.otherVal);
          if (val !== '' || val !== '')
            this.rightImgLink = (val.type === 'company' ? '公司: ' : '产品: ') + ' ' + val.name
        })
      },

      // 改变 tab 页面
      handleChangeTabEmit(val) {
        this.currentTab = val
      },
    },

    mounted() {
      this.getCoInfo().then(() => {
        this.getRightImg()
      })
    },

    components: {
      ...MyCoComponents
    }
  }
</script>

<style lang="stylus">

</style>

<style scoped lang="stylus">
  @import './MyCo.styl'
</style>
