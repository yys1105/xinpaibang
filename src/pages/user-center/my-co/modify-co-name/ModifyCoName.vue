<template>
  <div class="modify-co-name">
    <div class="stepItem">
      <p v-text="`1 ${noticeList[0]}`"></p>
    </div>
    <div class="stepItem">
      <p v-text="`2 ${noticeList[1]}`"></p>
    </div>
    <div class="stepItem">
      <p v-text="`3 ${noticeList[2]}`"></p>
      <div class="input-place">
        <input v-model="newName" type="text" title="modify-name" placeholder="输入新的企业名称，需与营业执照上一致">
      </div>
    </div>
    <div class="stepItem">
      <p v-text="`4 ${noticeList[3]}`"></p>
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
          <input type="file" title="fileUpload" accept="image/jpeg,image/jpg,image/png" v-show="false" @click="currIndex = n-1" @change="imgUpload">
        </label>
        <i-button type="primary" @click="handleSubmit">提交</i-button>
      </div>
    </div>
  </div>
</template>

<script>
  import IButton from 'iview/src/components/button/button.vue'
  import { showAlert } from '../../../../config/functions'

  export default {
    name: 'modifyCoName',

    components: {
      IButton
    },

    computed: {
      cid() {
        return this.$route.params.id
      }
    },

    data () {
      return {
        noticeList: [
          '修改企业名称需要经过平台审核，1-3个工作日内完成',
          '修改企业名称需要企业的超级管理员提出申请',
          '输入新的企业名称',
          '上传企业资料'
        ],
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
        newName: ''
      }
    },
    methods: {
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

      // 提交处理
      handleSubmit() {
        console.log(this.cid)
        let businessLicenseImage = this.img[0]
        let positiveIDCard = this.img[1]
        let reverseIDCard = this.img[2]
        if (!this.newName)
          return showAlert('填写的公司名称不能为空！')
        if (!businessLicenseImage || !positiveIDCard || !reverseIDCard)
          return showAlert('上传图片不完整！请点击对应图片上传！')
        this.$httpPost('home/user/changeCompanyNameApply.do', {
          cid: this.cid,
          newName: this.newName,
          businessLicenseImage,
          positiveIDCard,
          reverseIDCard
        }).then(data => {
          showAlert(data.data)
          this.$router.replace({ name: 'myCompanyIndex', params: { id: this.cid } })
        }).catch(err => {
          showAlert(err.message)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import 'ModifyCoName.styl'
</style>
