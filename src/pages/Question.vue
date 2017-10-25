<template>
  <div class="question-page">
    <template v-if="!questionLoading">
      <div class="question-detail">
        <div class="label-list">
          <link-label v-for="(label, index) in questionDetail.labels" :label="label.name" :key="index"></link-label>
        </div>
        <h2 class="question-title">{{ questionDetail.title }}</h2>
        <div>
          <p class="question-content">
            {{ questionDetail.content.length > 150 ? (isShowDetail ? questionDetail.content : questionDetail.content.slice(0, 150)) : questionDetail.content}}
            <span v-if="questionDetail.content.length > 150 && !isShowDetail">...</span>
          </p>
          <div class="clearfix">
            <a class="showMore" @click="questionShowMore" v-if="questionDetail.content.length > 150" v-text="!isShowDetail ? '显示全部' : '收起全部'">显示全部</a>
          </div>
        </div>
        <div class="meta-panel">
          <a class="meta-item" @click="focus(questionId)">+ 关注问题</a>
          <a class="meta-item"><i class="iconfont icon-flight"></i> 分享</a>
        </div>
      </div>
      <router-view></router-view>
    </template>
    <gear v-else-if="questionLoading"></gear>
  </div>
</template>

<script>
  import Gear from '../components/common/loading/Gear.vue'
  import {
    showAlert,
    isLogin
  } from '../config/functions'
  import LinkLabel from "../components/common/LinkLabel.vue";

  export default {
    name: 'question',

    components: {
      LinkLabel,
      Gear
    },

    data() {
      return {
        // 问题详情
        questionDetail: {
          title: '',
          author: '',
          date: '',
          content: '',
          labels: [],
        },
        questionTitle: '',
        questionAuthor: '',
        questionDate: '',
        questionContent: '',
        questionReplyCurr: 1,
        // 问题是否展开
        isShowDetail: false,
        // 提交锁，防止重复提交
        isLocked: false,
        questionLoading: false
      }
    },

    computed: {
      questionId() {
        return this.$route.params.id
      },
      userInfo() {
        return this.$store.getters.token ? this.$store.getters.userInfo : {}
      },
      isLogin() {
        return !!this.$store.getters.token
      }
    },

    created() {
      this.getQuestionDetail();
    },

    methods: {
      // 展示更多内容
      questionShowMore() {
        this.isShowDetail = !this.isShowDetail
      },
      // 获取问题详情
      getQuestionDetail() {
        this.questionLoading = true
        this.$httpGet('home/public/getProblemInformDetail.do', {
          id: this.questionId
        }).then(data => {
          let
            questionDetail = data.data,
            labelList = [];
          ({
            title: this.questionDetail.title,
            author: this.questionDetail.author,
            date: this.questionDetail.date,
            content: this.questionDetail.content,
            source: this.questionDetail.source,
            goodUserTag: this.questionDetail.goodUserTag
          } = data.data);
          // 文章类型
          questionDetail.labelList.forEach((item, index) => {
            labelList.push({
              name: item,
              key: index
            })
          });
          this.questionDetail.labels = labelList;
          this.questionLoading = false
        }).catch(err => {
          showAlert(err.message || '服务器异常！');
          this.$router.replace({ name: 'home' })
          this.questionLoading = false
        })
      },
      /**
       * 关注某一问题
       * @param {Number} id 关注问题的id
       */
      focus(id) {
        if (!isLogin()) return;
        this.$httpPost('home/inform/followQuestion.do', {
          iid: id
        }).then(data => {
          showAlert(data.data)
          this.getQuestionDetail()
        }).catch(err => {
          showAlert(err.message)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../assets/style/variables.styl'

  .question-page
    .question-detail
      .label-list
        margin 25px 0

      .question-title
        color $sky
        font-weight bold
        margin 25px 0

      .question-content
        font-size 16px
        line-height 30px

        &.displayPart
          overflow hidden
          text-overflow ellipsis
          display -webkit-box
          -webkit-line-clamp 3
          -webkit-box-orient vertical

      .showMore
        float right
        line-height 30px

    .meta-panel
      margin-top 20px

      .meta-item
        margin-left 20px

    .reply-comment-list
      border 1px solid #ededed
      padding 0 15px 15px
      margin-top 10px
</style>
