<script>
  import MessageList from './_MessageList.vue';
  import MessageReply from '../../components/common/modal/InquiryReply.vue';
  import Pager from "../../components/common/pager/Pager.vue";
  import { CONVERSATION_ID } from '../../config/const'

  export default {
    name: 'Conversation',

    data () {
      return {
        curr: 1,
        total: 1,

        messageList: [],
        loading: false,
        partnerInfo: {}
      }
    },

    computed: {
      groupNo() {
        return this.$route.params.groupNo
      },

      needUpdate() {
        return this.$parent.getNeedUpdateState();
      },

      conversationId() {
        return window.sessionStorage.getItem(CONVERSATION_ID)
      }
    },

    watch: {
      '$route' (to, from) {
        // 对路由变化作出响应...
        if (to.params.groupNo !== from.params.groupNo) {
          let groupNo = to.params.groupNo;
          [this.messageList, this.partnerInfo, this.curr, this.total] = [[], {}, 1, 1];
          this.getMessages()
        }
      },

      needUpdate(val) {
        if (val) {
          this.updateList()
          this.$parent.setNeedUpdateState(false)
        }
      }
    },


    methods: {
      handlePagerChange(val) {
        this.curr = val
        this.getMessages()
      },

      getMessages() {
        this.loading = true
        this.$httpGet('home/message/getReplayDetailMessagePage.do', {
          groupNo: this.groupNo,
          pageCurrent: this.curr
        }).then(({data}) => {
          [this.messageList, this.curr, this.total] = [data.rows, data.pageCurrent, data.pageCount];
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },

      updateList() {
        this.curr = 1
        this.messageList = []
        this.getMessages()
      },

      getPartner() {
        this.$httpGet('home/message/getMessageOwnerInform.do' ,{
          id: this.conversationId
        }).then(({ data }) => {
          this.partnerInfo = data
        })
      },
    },

    created() {
      this.getPartner()
      this.getMessages();
      console.log(this.conversationId,CONVERSATION_ID);
    },

    components: {
      Pager,
      MessageList,
      MessageReply,
    }
  }
</script>

<template>
  <div class="conversation">
    <div class="partner clearfix">
      <div class="partner--avatar">
        <img :src="partnerInfo.head || '/static/images/logo-avatar.png'" alt="">
      </div>
      <div class="partner--name">{{partnerInfo.username}}</div>
      <button type="button" class="text-button float-right" style="height: 35px;" @click="$router.push({name: 'message'})"><a>返回列表</a></button>
    </div>
    <div class="conversation--content">
      <message-list
        :messageList="messageList"
        :loading="loading"
        @changed="updateList"></message-list>
      <pager :curr="curr" :total="total" @change="handlePagerChange"></pager>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  @import '../../assets/style/variables.styl'

  $conversationHeadHeight = 35px;

  .conversation
    .partner
      display block;
      position relative;
      margin-bottom 20px;
      &--avatar
        position absolute;
        left 0;
        top 0;
        width $conversationHeadHeight;
        height $conversationHeadHeight;
        border 1px solid #999;
        border-radius 3px;
        img
          width 100%;
          height 100%;
      &--name
        margin-left 40px;
        line-height $conversationHeadHeight;
        height $conversationHeadHeight;
        font-size 30px;
        display inline-block;


</style>
