<script>
  import IInput from 'iview/src/components/input/input.vue'
  import IButton from 'iview/src/components/button/button.vue'
  import Modal from './_ModalTemplate.vue'
  import { showAlert, showConfirm} from '../../../config/functions'

  let productText = 'this.$store.state.inquiry.itemInfo.name'
    , contactText = 'this.temp + this.$store.getters.userInfo.mobile'
    , tempPrefix = 'template_'

  export default {
    name: 'Inquiry',

    data () {
      return {
        content: '',
        temp: '直接站内信回复或者电话我都可以，我的号码是: ',
      }
    },

    computed: {
      coInfo() { return this.$store.state.inquiry.coInfo },
      [tempPrefix+1]() {
        return `你好，我想购买贵公司的产品 （${eval(productText)}），请尽快联系我。\n${eval(contactText)}`
      },
      [tempPrefix+2]() {
        return `你好，我对贵公司提供的产品 （${eval(productText)}）很感兴趣，希望作进一步的了解，请尽快联系我。\n${eval(contactText)}`
      },
      [tempPrefix+3]() {
        return `你好，贵公司提供的产品（${eval(productText)}），包括对应的技术支持和售后指导吗？期待你的答复。\n${eval(contactText)}`
      }
    },

    methods: {
      changeTemplate(index) {
        this.content = this[tempPrefix+index]
      },

      close() {
        this.$store.dispatch('toggleSendMsgBoxShow')
      },

      send() {
        if (!showConfirm('是否发送该条询盘？')) return;
        this.$httpPost('home/message/addInquiryMessage.do', {
          cid: this.coInfo.cid,
          content: this.content
        }).then(({data}) => {
          showAlert('发送成功！')
          this.close()
        })
      }
    },

    components: {
      Modal,
      IInput,
      IButton,
    }
  }
</script>

<template>
  <modal @close="close">
    <template slot="title">发送询盘</template>
    <template slot="body">
      <p class="clearfix pl-10 inquiry--to">
        <span class="inquiry--name">收件人： {{ coInfo.name }}</span>
        <a v-if="coInfo.cid" class="inquiry--see-all float-right">来往私信&gt;</a>
      </p>
      <p class="pl-10 inquiry--content-title">
        内容：
        <button type="button" class="text-button" @click="changeTemplate(1)"><a>模板1</a></button>
        <button type="button" class="text-button" @click="changeTemplate(2)"><a>模板2</a></button>
        <button type="button" class="text-button" @click="changeTemplate(3)"><a>模板3</a></button>
      </p>
      <i-input type="textarea" placeholder="输入正文" v-model="content" autosize></i-input>
    </template>
    <p align="center" class="inquiry--operate" slot="foot">
      <i-button type="ghost" @click="close">取消</i-button>
      <i-button type="primary" @click="send">发送</i-button>
    </p>
  </modal>
</template>

<style scoped lang="stylus">
  .inquiry
    &--to
      margin-bottom 10px;
    &--content-title
      margin-bottom 10px;
    &--operate
      margin 10px 0;

</style>
