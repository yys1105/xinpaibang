<script>
  import { CONVERSATION_ID } from '../../config/const';
  import {showAlert, showConfirm} from "../../config/functions/index";
  export default {
    name: 'MessageList',

    props: {
      messageList: {
        type: Array,
        default: () => [],
      },
      loading: {
        type: Boolean,
        default: false,
      }
    },

    computed: {
      uid() {
        return this.$store.getters.userInfo.id
      }
    },

    methods: {
      handleReply(item) {
        this.$store.dispatch('toggleReplyInquiryModal', {
          show: true,
          info: {user: item.userName, id: item.id, groupNo: item.groupNo}
        })
      },

      routeToConversation(item) {
        let route = {}
          , groupNo = item.groupNo
          , conversationId = item.id
        if (!item.systemAll) {
          route = {
            name: 'conversation',
            params: { groupNo: groupNo}
          }
        } else {
          route = {
            name: 'conversation',
            params: {groupNo: `${groupNo}-${this.uid}`}
          }
        }
        window.sessionStorage.setItem(CONVERSATION_ID, conversationId)
        this.$router.push(route)

      },

      handleDelete(id) {
        if (!showConfirm('确定要删除这条消息？')) return;
        this.$httpPost('home/message/deleteMessage.do', {
          id: id
        }).then(data => {
          showAlert('删除成功！')
          this.$emit('changed')
        })
      }
    },
  }
</script>

<template>
  <div class="message-list">
    <transition name="fade">
      <div class="_message temp" v-if="loading">
        <div class="_message--avatar"></div>
        <div class="_message--info">
          <p class="info-head"><span class="info--name"></span></p>
          <p class="info-body">
            <span class="content-bar line-one"></span>
            <span class="content-bar line-two"></span>
          </p>
          <p class="info-foot clearfix">
            <span class="info--date"></span>
            <span class="info-operate"></span>
          </p>
        </div>
        <p align="center"><a>加载中...</a></p>
      </div>
    </transition>

    <transition-group name="fade">
      <template v-if="!loading">
        <div class="_message" v-for="(item, index) in messageList" :key="index">
          <div class="_message--avatar">
            <img :src="item.userHead || '/static/images/logo-avatar.png'" alt="">
          </div>
          <div class="_message--info">
            <p class="info-head"><span class="info--name">{{item.userName}}</span></p>
            <p class="info-body">{{item.content}}</p>
            <p class="info-foot clearfix">
              <span class="info--date">{{item.createTimeStr}}</span>
              <span class="info-operate">
                <button type="button" class="operate--see-all" v-if="$route.name === 'message'" @click="routeToConversation(item)">来往私信&gt;&gt;</button>
                <button type="button" class="operate--replay" v-if="!item.owner" @click="handleReply(item)">回复</button>
                <button type="button" class="operate--delete" v-if="item.owner" @click="handleDelete(item.id)">删除</button>
              </span>
            </p>
          </div>
        </div>
      </template>
    </transition-group>

    <template v-if="!loading && messageList.length === 0">
      <p align="center"><a>没有此类消息！</a></p>
    </template>
  </div>
</template>

<style scoped lang="stylus">
  @import '../../assets/style/variables.styl'

  .message-list
    margin-bottom 20px;
    position relative;
    min-height 200px;
    ._message
      display block;
      position relative;
      padding 10px 0;
      border-top 1px dashed #e0e0e0;
      min-height 100px;
      &--avatar
        position absolute;
        left 0;
        top 10px;
        height 40px;
        width 40px;
        border 1px solid #999;
        border-radius 3px;
        img
          width 100%;
          height 100%;
      &--info
        margin-left 50px;
        p
          margin 0 0 10px;
        .info
          &--name
            color $sky;
          &-body
            word-break break-all;
          &--date
            color $ash;
          &-operate
            float right;
            > button
              border 0;
              color $ash;
              background transparent;
              margin-left 20px;
              cursor pointer;
      &.temp
        opacity 1;
        position absolute;
        width 100%;
        top 0;
        ._message--avatar
          background #999;
          border-radius 0;

        .info--name,
        .content-bar,
        .info--date,
        .info-operate
          display inline-block;
          height 19px;

        .info--name
          min-width 80px;
          background-color #579fe6;
        .info-body
          .content-bar
            width 100%;
            background-color rgb(121, 125, 134);
            &.line-two
              width 40%;
        .info--date
          width 100px;
          background-color #d6d6d6;
        .info-operate
          width 200px;
          background-color #d6d6d6;

  .fade-leave-active
    opacity 0
    transition opacity 100ms ease;

</style>
