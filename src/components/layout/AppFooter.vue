<script>
  export default {
    name: 'AppFooter',

    data () {
      return {
        links: [
          { label: '关于我们', link: { name: 'aboutUs' }, index: 0 },
          { label: '联系我们', link: { name: 'contactUs' }, index: 1 },
          { label: '加入我们', link: { name: 'joinUs' }, index: 2 },
        ],
        brandImg: require('../../assets/images/logo-white.png'),
        friendLink: [],
        ICP: '苏ICP备16030976号',
      }
    },

    methods: {
      getFooterLinks() {
        return this.$httpGet('home/home/getFriendshipLink.do', {
        }).then(({ data }) => {
          this.friendLink = data
        })
      }
    },

    mounted () {
      this.getFooterLinks()
    }
  }
</script>

<template>
  <footer class="app-footer clearfix">
    <div class="content-container clearfix">
      <p class="friend-link" v-if="friendLink.length !== 0">
        <span>友情链接：</span>
        <a class="friend-link-item"
           target="_blank"
           v-for="item in friendLink"
           :href="item['val']">{{item['name']}}</a>
      </p>
      <p class="brand">&copy;2017 新牌榜 &emsp; <a href="http://www.miitbeian.gov.cn" target="_blank" style="text-decoration: none; color: #fff;">{{ICP}}</a></p>
      <ul class="us-links">
        <li v-for="(item, index) in links" :key="index">
          <router-link :to="item.link" v-text="item.label" target="_blank"></router-link>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped lang="stylus">
  @import '../../assets/style/variables.styl'

  $fontColor = #fff
  $backgroundColor = #ccc
  $footHeight = 130px
  $footItemLineHeight = 30px

  .app-footer
    background url("../../assets/images/footer.png") no-repeat center
    color $fontColor
    height $footHeight
    .friend-link
      span
        line-height: 1.2;
        border-left: 1px solid #fff;
        padding-left: 20px
      .friend-link-item
        color: #fff;
        margin-left: 10px
        &:hover
          font-weight bold;
          text-decoration none;

    .content-container
      padding 27px 0 0 0
      position relative
      line-height $footItemLineHeight
      .foot-logo
        position absolute
        left 0
        top 0
      .brand
        display inline-block
        margin-top 20px
        padding-left 20px
        float right
      .us-links
        display inline-block
        margin-top 20px
        border-left 1px solid #fff
        border-right 1px solid #fff
        padding-right 20px
        line-height 1.2;
        li
          display inline-block
          margin-left 20px
          a
            color $fontColor
          & + li
            a
              padding-left 20px
              border-left 1px solid $fontColor
</style>
