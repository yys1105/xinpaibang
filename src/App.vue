<script>
  import AppHeader from './components/layout/AppHeader.vue';
  import AppFooter from "./components/layout/AppFooter.vue";
  import Login from './components/common/modal/Login.vue';
  import Quiz from './components/common/modal/Quiz.vue';
  import SendMsg from './components/common/modal/Inquiry.vue';
  import {mapGetters} from 'vuex';
  import {getWinSize} from './config/functions';

  export default {
    name: 'app',

    components: {
      Login,
      Quiz,
      SendMsg,
      AppHeader,
      AppFooter,
    },

    data() {
      return {
        headerBanner: null,
      }
    },

    computed: {
      loginBoxShowStyle() {
        let modalShow = this.isLoginBoxShow || this.isQuizBoxShow;

        return {
          minWidth: '1220px',
          width: modalShow ? getWinSize()[0] + 'px' : 'auto',
          height: modalShow ? getWinSize()[1] + 'px' : 'auto',
          overflow: modalShow ? 'hidden' : 'visible'
        }
      },

      minContentHeight() {
        return getWinSize()[1]
      },

      isGray() {
        return (this.$route.name === 'question') || (this.$route.name === 'answer') || (this.$route.name === 'claim')
      },

      ...mapGetters({
        isQuizBoxShow: 'isQuizShow',
        isLoginBoxShow: 'isLoginShow',
        isSendMsgBoxShow: 'isSendMsgBoxShow'
      }),
    },

    methods: {
      getHeaderBanner() {
        return this.$httpGet('home/home/getNoticeBarImage.do', {}).then(({data}) => {
          typeof data !== 'undefined' && (this.headerBanner = {
            src: data.val,
            link: data.otherVal,
          })
        })
      }
    },

    created() {
      this.getHeaderBanner()
    }
  }
</script>

<template>
  <div
    v-cloak
    id="app"
    class="clearfix app-shell"
    :style="loginBoxShowStyle"
    :class="{ 'bg-gray': isGray }">
    <app-header
      v-if="$route.name !== 'guide'"
      ref="appHeader"
      :show="true"></app-header>
    <a
      v-if="headerBanner"
      class="header-banner"
      :href="headerBanner.link"
      target="_blank">
      <img :src="headerBanner.src" alt="">
    </a>
    <router-view
      class="app-content content-container"
      :style="{'min-height': minContentHeight - 130 + 'px'}"></router-view>
    <app-footer></app-footer>
    <login v-if="isLoginBoxShow"></login>
    <quiz v-if="isQuizBoxShow"></quiz>
    <send-msg v-if="isSendMsgBoxShow"></send-msg>
  </div>
</template>

<style lang="stylus">

  @import 'assets/style/common.styl'

  #app
    min-height 100%
    overflow-x hidden
    font 14px 'Microsoft Yahei'
    &.app-shell
      padding

  .to-top
    $size = 60px
    display inline-block
    position fixed
    right 50px
    bottom 50px
    width $size
    height $size
    border 1px solid #ccc
    background-color #fff
    border-radius 3px

</style>
