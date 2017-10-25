<template>
  <aside class="right-side">
    <div class="btn-group">
      <button v-if="$route.name === 'article'" type="button" class="aside-button" @click="publishArticle">发表文章</button>
      <button v-if="isCardStyle" type="button" class="aside-button" @click="jumpToReply">回&emsp;答</button>
      <button type="button" class="aside-button ghost" @click="putQuiz">提&emsp;问</button>
    </div>
    <!--<div class="help-list" :class="{ 'card-style': isCardStyle}">-->
      <!--<dl>-->
        <!--<dt class="title">推荐列表</dt>-->
        <!--<dd v-for="item in recommendList" class="list-item">-->
          <!--<a :href="item.link">{{ item.label }}</a>-->
        <!--</dd>-->
      <!--</dl>-->
      <!--<dl>-->
        <!--<dt class="title">工具栏</dt>-->
        <!--<dd v-for="item in toolList" class="list-item">-->
          <!--<a :href="item.link">{{ item.label }}</a>-->
        <!--</dd>-->
      <!--</dl>-->
    <!--</div>-->
    <!--<div class="poster">-->
      <!--<a :href="posterInfo.link">-->
        <!--<img :src="posterInfo.imgUrl" :alt="posterInfo.label">-->
      <!--</a>-->
    <!--</div>-->
  </aside>
</template>

<script>
  import {
    isLogin,
    showAlert
  } from '../../config/functions'

  export default {
    name: 'app-aside',

    computed: {
      isCardStyle () {
        return this.$route.name === 'question' || this.$route.name === 'answer'
      },
      isLogin () {
        return this.$store.getters.userInfo
      }
    },

    methods: {
      putQuiz () {
        if (isLogin()) {
          this.$store.dispatch('updateQuizState', true)
        } else {
          this.$store.dispatch('updateLoginState', true)
        }
      },

      publishArticle () {
        if (isLogin()) {
          this.$router.push({name: 'write'})
        }
      },

      jumpToReply () {
        if (isLogin()) {
          this.$route.name !== 'question'
            ? this.$router.push({name: 'question', id: this.$route.params.id}) : $('body').scrollTop($('#write').offset().top)
        } else {
          this.$store.dispatch('updateLoginState', true);
        }
      }
    },

    data () {
      return {
        recommendList: [
          {label: '如何看待此文章', link: ''},
          {label: '相关文章', link: ''},
          {label: '相关问答', link: ''},
          {label: '相关企业', link: ''},
          {label: '相关产品', link: ''}
        ],
        toolList: [
          {label: '个人编辑列表、草稿', link: ''},
          {label: '标签（话题）管理', link: ''},
          {label: '个人收藏列表', link: ''},
          {label: '其他', link: ''}
        ],
        posterInfo: {imgUrl: '/static/images/poster/poster-default.png', link: '', label: 'default-poster'}
      }
    }
  }
</script>

<style scoped lang="stylus">

  @import '../../assets/style/variables.styl'

  .help-list, .poster
    text-align center
    margin-top $panelGutter
    background-color transparent

    dl + dl
      margin-top 34px

  .help-list
    padding 12px 0

  .title
    font-size 20px

  .list-item
    font-size 16px
    color $sky
    margin 12px 0

  .poster
    img
      width 100%

  .card-style
    box-shadow 0 0 3px $lightAsh
    border-radius 2px
    background-color #fff

</style>
