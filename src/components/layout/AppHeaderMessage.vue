<script>
  import Poptip from 'iview/src/components/poptip/poptip.vue'
  import {CONVERSATION_ID} from '../../config/const'

  export default {
    name: 'AppHeaderMessage',

    data () {
      return {
        tabList: [
          { label: '询盘', index: 0 },
          { label: '系统', index: 1 }
        ],
        currTabIndex: 0,
        inquiryData: [],
        systemData: [],
        timer: null,
        hasNewMessage: false,
      }
    },

    methods: {
      handleTabChange(index) {
        [this.currTabIndex, this.newMessageList] = [index, []];
        this.getMessages();
      },

      checkNews() {
        return this.$httpPost('home/message/haveNewMessage.do', {
        }).then(({data}) => {
          this.hasNewMessage = data
        })
      },

      getMessages() {
        return Promise.all([
          this.$httpGet('home/message/getInquiryMessagePage.do', {
            pageSize: 5
          }).then(({data}) => data),
          this.$httpGet('home/message/getSystemMessagePage.do', {
            pageSize: 5
          }).then(({data}) => data),
        ]).then(([inquiryData, systemData]) => {
          this.inquiryData = inquiryData.rows
          this.systemData = systemData.rows
        }).catch(() => {
          this.inquiryData = []
          this.systemData = []
        })
      },

      routeToConversation(item) {
        let groupNo = item.groupNo
        if (item.systemAll) {
          groupNo = `${item.groupNo}-${this.$store.getters.userInfo.id}`
        }
        let route = {name: 'conversation', params: {groupNo: groupNo}}
        window.sessionStorage.setItem(CONVERSATION_ID, item.id)
        this.$router.push(route)
      },

    },

    mounted() {
      this.getMessages();
      this.checkNews();
      this.timer = setInterval(this.getMessages, 60000);
    },

    beforeDestroy() {
      clearInterval(this.timer)
      this.timer = null
    },

    components: {
      Poptip
    },
  }
</script>

<template>
  <Poptip width="240" placement="bottom" class="header-menu">
    <i class="iconfont icon-message-copy" style="cursor: pointer">
      <span class="icon-new-message" v-if="hasNewMessage"></span>
    </i>
    <div slot="content" class="header-menu--box">
      <ul class="header-menu--tab clearfix">
        <li v-for="(item, index) in tabList"
            :key="index"
            class="tab-item"
            :class="{'active': item.index === currTabIndex}"
            @click="handleTabChange(index)">{{item.label}}</li>
      </ul>
      <div class="header-menu--content">
        <template v-if="currTabIndex === 0">
          <a @click="routeToConversation(item)" class="_message" v-for="(item, index) in inquiryData" :key="index">
            <div class="_message--avatar">
              <img :src="item.userHead || '/static/images/logo-avatar.png'">
            </div>
            <div class="_message--info">
              <p class="info-name">{{item.userName}}</p>
              <p class="info-content">{{item.content}}</p>
            </div>
          </a>
        </template>
        <template v-if="currTabIndex === 1">
          <a @click="routeToConversation(item)" class="_message" v-for="(item, index) in systemData" :key="index">
            <div class="_message--avatar">
              <img :src="item.userHead || '/static/images/logo-avatar.png'">
            </div>
            <div class="_message--info">
              <p class="info-name">{{item.userName}}</p>
              <p class="info-content">{{item.content}}</p>
            </div>
          </a>
          <template v-if="systemData.length === 0">
            <br>
            <p align="center">暂无系统消息！</p>
          </template>
        </template>
      </div>
      <div class="header-menu--foot">
        <p align="right"><router-link :to="{name: 'message'}">更多···</router-link></p>
      </div>
    </div>
  </Poptip>
</template>

<style scoped lang="stylus">
  @import '../../assets/style/variables.styl'

  $borderColor = #f0f0f0

  .header-menu
    .icon-message-copy
      position relative
      span.icon-new-message
        content " "
        display inline-block
        position absolute
        width 10px
        height 10px
        border 2px solid #fff
        border-radius 5px
        background-color: #f00
        right -2px
        top -2px
    &--box
      padding 0 10px;
    &--tab
      border-bottom 1px solid $borderColor;
      padding-bottom 7px;
      .tab-item
        display inline-block;
        box-sizing border-box;
        float left;
        width 50%;
        text-align center;
        color $ash;
        transition color 300ms;
        cursor pointer;
        &:hover
          color lighten($sky, 30);
        & + .tab-item
          border-left 1px solid $borderColor;
        &.active
          color $sky
    &--content
      ._message
        padding 5px 0;
        position relative;
        border-bottom 1px solid $borderColor;
        width 220px;
        height 50px;
        color $dark;
        display block;
        text-decoration none;
        &--avatar
          position absolute;
          left 0;
          top 5px;
          width 40px;
          height 40px;
          border 1px solid #999;
          border-radius 3px;
          img
            width 100%;
            height 100%;
        &--info
          margin-left 45px;
          .info-content
            overflow hidden;
            white-space nowrap;
            text-overflow ellipsis;
    &--foot
      padding-top 7px;
</style>
