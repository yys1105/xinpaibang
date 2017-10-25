<script>
  import Breadcrumb from "../../components/my-co/Breadcrumb.vue";
  import InquiryReply from "../../components/common/modal/InquiryReply.vue";

  export default {
    name: 'Message',

    computed: {
      replyInquiryShow() {
        return this.$store.state.inquiryReply.isShow
      }
    },

    methods: {
      setNeedUpdateState(bool = true) {
        this.needUpdate = bool
      },
      getNeedUpdateState() {
        return this.needUpdate
      }
    },

    data () {
      return {
        needUpdate: false,
      }
    },

    watch: {
      needUpdate (val) {
        console.log('needUpdate: ', val);
      }
    },

    components: {
      InquiryReply,
      Breadcrumb,
    }
  }
</script>

<template>
  <div class="message content-container">
    <div class="content-view">
      <breadcrumb></breadcrumb>
      <router-view></router-view>
      <inquiry-reply v-if="replyInquiryShow"></inquiry-reply>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .message
    margin-bottom 20px;
</style>
