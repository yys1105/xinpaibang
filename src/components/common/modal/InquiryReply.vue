<script>
  import IButton from 'iview/src/components/button/button.vue'
  import IInput from 'iview/src/components/input/input.vue'
  import Modal from './_ModalTemplate.vue'
  import Loading from '../loading/Gear.vue'
  import { showConfirm, showAlert } from '../../../config/functions'

  export default {
    name: 'MessageReply',

    data () {
      return {
        content: '',
      }
    },

    computed: {
      info() { return this.$store.state.inquiryReply.info; }
    },

    methods: {
      close() { return this.$store.dispatch('toggleReplyInquiryModal') },

      send() {
        if (!this.content) return showAlert('内容不能为空！');
        if (!showConfirm('是否发送该条消息？')) return;
        this.$httpPost('home/message/replyMessage.do', {
          replayId: this.info.id,
          content: this.content,
        }).then(data => {
          showAlert('回复成功！');
          this.$parent.setNeedUpdateState(true);
          this.close();
        })
      },
      seeAll(groupNo) {
        console.log(groupNo);
      },
    },

    components: {
      IButton,
      IInput,
      Modal
    }
  }
</script>

<template>
  <modal @close="close">
    <template slot="title">发送私信</template>
    <template slot="body">
      <p class="clearfix pl-10 inquiry--to">
        <span class="inquiry--name">收件人： {{ info.user }}</span>
        <a v-if="info.user" class="inquiry--see-all float-right" @click="seeAll(info.groupNo)">来往私信&gt;</a>
      </p>
      <p class="pl-10 inquiry--content-title">内容：</p>
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
