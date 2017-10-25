<template>
  <header class="app-header" :style="{left: topLeft}" v-if="show">
    <div class="header-content">
      <router-link :to="{ name: 'home' }" class="logo">
        <img src="../../assets/images/logo.png" alt="logo">
      </router-link>
      <div class="search" v-if="$route.name !== 'guide'">
        <input type="text" title="header-search" v-model="searchText" @keyup.enter="handleSearch">
        <span class="search-icon" @click="handleSearch">
          <img src="../../assets/images/search.png" alt="search">
        </span>
        <p class="hot-search-list">
          <a v-for="(item, index) in hotTopics" :key="index" @click="searchHotTopic(item)">{{item.name}}</a>
        </p>
      </div>
      <div class="setting" v-if="this.$route.name !== 'guide'">
        <template v-if="!isLogin">
          <a class="login-text" @click="userLogin">请登录</a>
          <a class="register-text" @click="userRegister">用户注册</a>
        </template>
        <template v-else>
          <message v-if="$route.name !== 'message'"></message>
          <my-center></my-center>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
  import Dropdown from 'iview/src/components/dropdown'
  import IButton from 'iview/src/components/button/button.vue'
  import Message from './AppHeaderMessage.vue'
  import MyCenter from './AppHeaderMyCenter.vue'
  import {showAlert} from '../../config/functions'

  export default {
    name: 'app-header',

    data() {
      return {
        topLeft: 0,
        searchText: '',
        hotTopics: [],
      }
    },

    props: {
      show: {
        type: Boolean,
        default: false
      }
    },

    components: {
      Dropdown,
      IButton,
      Message,
      MyCenter
    },

    computed: {
      isLogin() {
        return this.$store.getters.token
      },

      userName() {
        return this.$store.getters.userInfo.nickname
      },

      searchType() {
        return this.$store.getters.getSearchType
      }
    },

    methods: {
      changeSearchText(val) {
        this.searchText = val
      },

      mySetting() {
        this.$router.push({name: 'user-center'})
      },

      topFixMove() {
        this.topLeft = -$('body').scrollLeft() + 'px'
      },

      userLogin() {
        this.$store.dispatch('updateLoginState', true);
      },

      userRegister() {
        this.$store.dispatch('changeLoginShow', 'register');
        this.$store.dispatch('updateLoginState', true);
      },

      handleSearch(e) {
        let text = this.searchText
          , params = {
          searchInfo: {
            title: text,
            pageCurrent: 1
          },
          searchType: this.searchType
        };
        if (this.$route.name !== 'search') {
          // window.open(window.location.href+'search?text='+text, '_blank')
          this.$router.push({name: 'search'});
          e.target.blur()
        } else if (this.$route.name === 'search') {

        } else {
          return showAlert('请填入搜索信息')
        }
        this.$store.dispatch('search', params)
      },

      getHotTopicList() {
        this.$httpGet('home/public/getHotSpotList.do', {})
          .then(({data}) => {
            this.hotTopics = data
            window.sessionStorage.setItem('HOT_TOPIC', JSON.stringify(this.hotTopics))
          })
      },

      searchHotTopic(item) {
        this.changeSearchText(item.name)
        this.$store.dispatch('search', {
          searchInfo: {title: this.searchText, pageCurrent: 1},
          searchType: 'all'
        }).then(() => this.$router.push({name: 'search'}))
      }
    },

    mounted() {
      window.addEventListener('scroll', this.topFixMove)
      this.getHotTopicList()
      setInterval(this.getHotTopicList, 60000)
    }
  }
</script>

<style scoped lang="stylus">

  @import '../../assets/style/variables.styl'

  .app-header
    position fixed
    top 0
    z-index 100
    width 100%
    min-width 1220px
    height $appHeaderHeight
    background-color #fff
    border-bottom 1px solid #eee
    /*box-shadow 0 1px 7px #efefef*/
    /* content area */
    .header-content
      box-sizing border-box
      margin 0 auto
      width $pageWidth
      position relative
      height $appHeaderHeight
      .logo,
      .search,
      .setting
        display inline-block
      /* logo */
      .logo
        float left
        /*width 135px*/
        height 64px
        position absolute
        left 0
        top 50%
        margin-top -32px
        cursor pointer
        img
          /*width 100%*/
          height 100%
      /* search bar */
      .search
        $searchBarWidth = 400px
        $searchBarHeight = 60px
        float left
        position absolute
        left 50%
        top 50%
        margin-top -25px
        margin-left (- $searchBarWidth / 2)
        width $searchBarWidth
        height $searchBarHeight
        overflow hidden
        .hot-search-list
          margin-top 5px;
          padding 0 20px;
          a
            color #999;
            margin-right 10px;
            &:hover
              color $sky;
        input
          border 0
          outline 0
          width 100%
          height 34px
          padding 0 20px
          color #aaa
          background-color #EEEEEE
          border-radius 17px
        .search-icon
          display inline-block
          width 26px
          height 26px
          position absolute
          top 4px
          right 4px
          cursor pointer
          img
            width 100%
            height 100%
      /* setting icon */
      .setting
        float right
        box-sizing border-box
        height 60px
        min-width 100px
        position absolute
        right 0
        top 50%
        margin-top -30px
        user-select none
        .login-text
          color #D8665F
          font-size 15px
          line-height 60px
        .register-text
          color #999
          margin-left 10px
          font-size 15px
          line-height 20px
        .icon-arrow
          display inline-block
          position absolute
          height 16px
          top 50%
          margin-top -8px
          right 0

        .nav-item
          display block
          text-align center

</style>
