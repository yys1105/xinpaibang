<template>
  <div class="evaluations" id="anchor-evaluate">
    <section class="content">
      <p class="evaluate-title">
        <span>评论</span>
        (已有{{ evaluateNum }}条评论)
      </p>
      <div class="evaluate-box" @click="addReply(0)">
        <i class="iconfont icon-pen input-before"></i>
        发表评论
        <i class="iconfont icon-face input-after"></i>
      </div>
    </section>
    <!-- 精彩评价 -->
    <section class="evaluate-list" v-if="goodEvaluateList.length">
      <div class="head">
        <span>精彩评论</span>
      </div>
      <div>
        <item-comment
          v-for="(item, index) in goodEvaluateList"
          :key="index"
          :evaluate-item="item"
          @needUpdate="getReplies"></item-comment>
      </div>
    </section>

    <!-- 最新评价 -->
    <section class="evaluate-list" v-if="evaluateList.length !== 0 || loading">
      <div class="head">
        <span>最新评论</span>
      </div>
      <div>
        <gear v-if="loading"></gear>

        <item-comment
          v-for="(item, index) in evaluateList"
          :key="index"
          :evaluate-item="item"
          @needUpdate="getReplies"></item-comment>
      </div>
    </section>

    <section>
      <pager :curr="evaluateCurr" :total="evaluateTotal" @change="handlePageChange"></pager>
    </section>

    <reply-modal v-if="$store.getters.isReplyShow" @submit="getReplies"></reply-modal>
  </div>
</template>

<script>
  import Pager from '../../../components/common/pager/Pager.vue'
  import ReplyModal from '../../../components/common/modal/Reply.vue'
  import IButton from 'iview/src/components/button'
  import IInput from 'iview/src/components/input'
  import {isLogin, showAlert} from '../../../config/functions'
  import Gear from "../../../components/common/loading/Gear.vue";

  let itemComment = {
    name: 'itemComment',
    template: `
    <div class="item-comment">
      <div class="wrap content">
        <div class="avatar">
          <img :src="evaluateItem.head" alt="">
        </div>
        <div class="box-right">
          <p class="head">
            <span class="name">{{ evaluateItem.nickname }}</span>
            <span class="date">{{ evaluateItem.createTime | dateFormat }}</span>
          </p>
          <p>{{ evaluateItem.content }}</p>
          <div class="item-comment-reply" v-if="evaluateItem.replyNickName">
            <span class="name">{{ '@' + evaluateItem.replyNickName }}</span>: {{ evaluateItem.replyContent }}
          </div>
        </div>
        <div class="meta-bar">
          <a class="meta-item" @click="handleAgree(evaluateItem.id)">{{ evaluateItem.goodUserTag ? '已赞' : '赞' }}（{{ evaluateItem.goodNum }}）</a>
          <a class="meta-item" @click="handleReply(evaluateItem)">回复</a>
        </div>
      </div>
    </div>
    `,
    data() {
      return {
        agreeNum: 0
      }
    },

    props: {
      evaluateItem: {
        type: Object,
        required: true
      }
    },

    computed: {
      productId() {
        return this.$route.params.itemId
      }
    },

    methods: {
      // 评论点赞
      handleAgree(id) {
        if (!isLogin())
          return

        this.$httpPost('home/product/goodCommentProduct.do', {
          pcid: id
        })
          .then(data => {
            showAlert(data.data)
            this.requireUpdate()
          })
          .catch(err => {
            console.log(err)
            this.requireUpdate()
          })
      },
      // 评论回复
      handleReply(item) {
        if (!isLogin())
          return
        this.$store.dispatch('updateReplyParams', {
          url: 'home/product/commentProduct.do',
          pid: this.productId,
          rid: item.id,
          placeholder: `@${item.nickname}`
        })
        this.$store.dispatch('updateReplyState', true)
      },

      requireUpdate() {
        this.$emit('needUpdate')
      }
    }
  }

  export default {
    name: 'coItemEvaluate',

    data() {
      return {
        evaluateNum: 0,
        goodEvaluateNum: 0,

        loading: false,

        evaluateList: [],
        goodEvaluateList: [],

        evaluateCurr: 1,
        evaluateTotal: 1,
      }
    },

    components: {
      Gear,
      Pager,
      itemComment,
      ReplyModal
    },

    props: ['itemId'],

    methods: {
      // 翻页
      handlePageChange(val) {
        this.evaluateCurr = val
        this.getReplies()
      },

      // 新增回复
      addReply(rid) {
        if (!isLogin())
          return
        this.$store.dispatch('updateReplyParams', {
          url: 'home/product/commentProduct.do',
          pid: this.itemId,
          rid: rid
        })
        this.$store.dispatch('updateReplyState', true)
      },

      // 跟新数据
      getReplies() {
        this.loading = true
        this.evaluateList = []
        Promise.all([
          this.$httpGet('home/public/getReplyOfPCommentPage.do', {
            pid: this.itemId,
            pageCurrent: this.evaluateCurr
          }).then(data => data.data),
          this.$httpGet('home/public/getTopFivePCommentOfProductList.do', {
            pid: this.itemId
          }).then(data => data.data)
        ]).then(resList => {
          let evaluateList = resList[0]
          let goodEvaluateList = resList[1]

          this.evaluateNum = evaluateList.total
          this.evaluateList = evaluateList.rows
          this.evaluateTotal = evaluateList.pageCount
          this.goodEvaluateList = goodEvaluateList

          this.loading = false
        }).catch(err => {
          console.log('获取数据异常！', err)
          this.loading = false
        })
      }
    },


    created() {
      this.getReplies()
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/style/variables.styl'
  @import '../../../assets/style/mixin.styl'

  .content
    width 920px
    margin 0 auto
    display block

  .item-comment
    padding 30px 15px
    position relative
    .head,
    .box-right
      margin-bottom 20px
    .name
      color $sky
    .avatar
      width 73px
      height 73px
      img-center('horizon')
      position absolute
    .box-right
      min-height 80px
      margin-left 88px

    .meta-bar
      text-align center

  .item-comment-reply
    background-color #eee
    padding 15px
    margin-top 20px

  .item-comment + .item-comment
    border-top 1px solid #ccc


</style>

<style scoped lang="stylus">
  @import '../../../assets/style/variables.styl'
  @import '../../../assets/style/mixin.styl'

  .evaluations
    padding 20px 0

    .evaluate-title
      color $sky
      font-size 18px
      span
        font-size 20px

    .evaluate-box
      border 1px solid #efefef
      border-radius 4px
      padding 0 40px
      margin 20px 0
      position relative
      height 35px
      line-height 33px
      cursor pointer
      user-select none
      color #999

      .input-before, .input-after
        position absolute
        height 35px
        line-height 33px
        width 35px
        text-align center
        font-size 20px
        color $ash
      .input-before
        left 0
      .input-after
        right 0
        top 0
        line-height 37px
        cursor pointer

  .evaluate-list
    .head
      text-align center
      padding 0 20px
      position relative
      span
        display inline-block
        width 105px
        height 28px
        line-height 28px
        background-color #000
        color #fff
        text-align center
      &::after,
      &::before
        content ''
        display inline-block
        position absolute
        width 43%
        top 50%
        border-top 1px solid $sky
        z-index -10
      &::after
        left 0
      &::before
        right 0


</style>
