<template>
  <div class="claim">
    <div class="content-view">
      <breadcrumb></breadcrumb>
      <co-list-card :item="item" :hasButton="false"></co-list-card>
      <div class="tips">
        <p>1 认领企业需要经过平台1-3个工作日审核</p>
        <p>2 认领企业成功后，本用户账号则为该企业的平台超级管理员，请在提交申请前确认账户名并绑定手机号</p>
        <div class="info-area">
          <label>
            <span class="label">联系人</span>
            <input type="text" class="value" style="width:150px" v-model="contacts">
          </label><br>
          <label>
            <div class="label">联系方式</div>
            <span class="value">{{ currPhoneNum }}</span>
            <a @click="isChangePhoneShow = true">更换手机</a>
          </label>
        </div>
        <p>3 上传企业资料</p>
        <div class="update-co-img-list">
          <label v-for="n in 3" class="update-co-img update-co-img-1 clearfix">
            <img v-if="!imgLoadUp[n-1]" :src="placeHolderImg" alt="update-co-img">
            <img v-show="imgLoadUp[n-1]" :src="img[n-1]" alt="update-co-img" @load="handleImgLoadUp(n-1)">
            <div class="cover" v-if="!imgLoadUp[n-1]">
              <span v-if="!uploadState[n-1]" v-text="uploadTips[n-1]"></span>
            </div>
            <div class="cover" v-if="loadingState[n-1]">
              <span>加载中...</span>
            </div>
            <input type="file" title="fileUpload" accept="image/jpeg,image/jpg,image/png" v-show="false"
                   @click="currIndex = n-1" @change="imgUpload">
          </label>
          <i-button type="primary" @click="handleSubmit">提交</i-button>
        </div>
      </div>
    </div>

    <change-phone-modal
      v-if="isChangePhoneShow"
      :currPhoneNum="currPhoneNum"
      :boxType="'1'"
      @close="isChangePhoneShow = false" @changePhone="changePhone"></change-phone-modal>
  </div>
</template>

<script>
  import Breadcrumb from '../../../../components/my-co/Breadcrumb.vue'
  import CoListCard from '../../../../components/my-co-list/CoListCard.vue'
  import IButton from 'iview/src/components/button/button.vue'
  import {showAlert, showConfirm} from '../../../../config/functions'
  import ChangePhoneModal from '../../../../components/common/ChangePhoneModal.vue'

  export default {
    name: 'claim',

    created() {
      this.currPhoneNum = this.userInfo.mobile
      this.contacts = this.userInfo.nickname
      this.getCoInfo()
    },

    data() {
      return {
        isChangePhoneShow: false,
        item: {
          cid: '',
          logo: '',
          name: '',
          registrationNumber: '',
          legalRepresentative: '',
          memberTag: '',
        },
        contacts: '',
        currPhoneNum: '',
        placeHolderImg: '/static/images/img_placeholder.jpg',
        img: [],          // 图片地址列表
        imgLoadUp: [],    // 图片加载完成状态
        uploadState: [],  // 图片上传完成状态
        loadingState: [], // 加载过程状态
        currIndex: 0,
        uploadTips: [
          '点击上传营业执照',
          '点击上传企业法人代表身份证正面（有国徽）',
          '点击上传企业法人代表身份证反面'
        ],
      }
    },

    computed: {
      cid() {
        return this.$route.params.id
      },
      userInfo() {
        return this.$store.getters.userInfo
      }
    },

    methods: {
      /**
       * 获取公司信息
       */
      getCoInfo() {
        this.$httpGet('home/company/getCompanyInform.do', {
          cid: this.cid
        }).then(({data}) => {
          ({
            cid: this.item.cid,
            logo: this.item.logo,
            name: this.item.name,
            registrationNumber: this.item.registrationNumber,
            legalRepresentative: this.item.legalRepresentative,
            memberTag: this.item.memberTag,
          } = data)
        }).catch(err => {
          console.log(err)
        })
      },

      // 处理图片加载完成
      handleImgLoadUp(index) {
        this.$set(this.imgLoadUp, index, true)
        this.$set(this.loadingState, index, false)
      },

      // 图片预上传
      imgUpload(e) {
        let index = this.currIndex
        let selectedImg = e.target.files[0]
        // uploading start
        this.$set(this.uploadState, index, true)
        this.$set(this.loadingState, index, true)
        this.$httpPost('admin/file/ajaxUploadImg.do', {
          file: selectedImg
        }).then(data => {
          this.$set(this.img, index, data.data)
        }).catch(err => {
          console.log(err)
          this.$set(this.uploadState, index, false)
          this.$set(this.uploadTips, index, '上传出现错误，请刷新重试')
        })
      },

      changePhone(val) {
        this.currPhoneNum = val
      },

      handleSubmit() {

        if (!showConfirm('确认提交？'))
          return

        let cid = this.cid
        let contacts = this.contacts
        let mobile = this.currPhoneNum
        let businessLicenseImage = this.img[0]
        let positiveIDCard = this.img[1]
        let reverseIDCard = this.img[2]

        if (!businessLicenseImage || !positiveIDCard || !reverseIDCard)
          return showAlert('图片上传不完整')

        this.$httpPost('home/user/applyClaimCompany.do', {
          cid,
          contacts,
          mobile,
          businessLicenseImage,
          positiveIDCard,
          reverseIDCard,
        }).then(({data}) => {
          showAlert(data)
          this.$router.replace({ name: 'myCompanies' })
        }).catch(err => {
          if (err && err.message) {
            showAlert(err.message)
          } else {
            console.log(err)
          }
        })
      }
    },

    components: {
      Breadcrumb,
      CoListCard,
      IButton,
      ChangePhoneModal,
    }
  }
</script>

<style scoped lang="stylus">
  .tips
    margin-top 30px
    p
      line-height 30px

  .label
    display inline-block
    width 100px
    text-align right
    margin-right 10px

  .value
    display inline-block
    min-width 150px
    margin-right 10px
    border 1px solid #ccc
    background #fff
    color #2baee9
    padding 0 5px

  .info-area
    label
      display inline-block
      margin 10px 0

</style>
