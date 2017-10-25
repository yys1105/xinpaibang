<template>
  <div class="comment">
    <p class="comment-title"><span>评论</span>&emsp;(已有{{ totalNum }}条评论)</p>
    <div class="comment-box" @click="addReply"><i class="iconfont icon-pen input-before"></i>发表评论<i class="iconfont icon-face input-after"></i></div>
    <div class="top-comments" v-if="showTopFive">
      <div class="top-title">精彩评论</div>
      <div class="top-box">
        <span v-if="topList.length === 0">暂无评论，快点来做第一个评论的人吧！</span>
        <comment-item
          v-for="item in topList"
          :item="item"
          :key="item.id"
          :type="type"
          @needUpdate="getCommentList"></comment-item>
      </div>
    </div>

    <div class="comment-list" v-if="showReplyList">
      <p class="comment-list-title" :id="'newest' + id">最新评论</p>
      <div class="comment-list-box">
        <span v-if="commentList.length === 0">暂无评论，快点来做第一个评论的人吧！</span>
        <comment-item
          v-for="item in commentList"
          :item="item"
          :key="item.id"
          :type="type"
          :ref="'commentItem' + item.id"
          :hasDelete="true"
          @needUpdate="getCommentList"></comment-item>
      </div>
    </div>
    <pager :total="commentPageCount" :curr="commentPageCurr" @change="handlePageChange"></pager>
    <reply v-show="isReplyShow" @submit="getCommentList"></reply>
  </div>
</template>


<script>
  import Pager from '../../components/common/pager/Pager'
  import {BASE_URL} from '../../config/const'
  import Reply from './modal/Reply.vue'
  import { showAlert, isLogin } from '../../config/functions'

  let commentItem = {
    template: `
    <div class="comment-item clearfix">
      <div class="item-avatar">
        <img :src="item.userAvatar" alt="userAvatar">
      </div>
      <div class="item-content">
        <div class="item-title"><span class="item-username">{{ item.userName }}</span><span class="item-date">{{ item.date | dateFormat }}</span></div>
        <div>{{ item.content }}</div>
        <div v-if="!item.delete" class="operate-panel">
          <span @click="agree(item.id)">{{ item.goodUserTag ? '已赞' : '赞' }} ({{ item.voteNum }})</span>
          <span @click="replyToReply(item)">回复</span>
          <span
            v-if="hasDelete && !!$store.state.userInfo.token && (item.uid == $store.state.userInfo.userInfo.id)"
            @click="deleteComment(item)">删除</span>
        </div>
        <div class="comment-to-comment" v-if="item.replyNickName">
          <a>@{{ item.replyNickName }}</a>
          <span style="margin-left: 20px">{{ item.replyContent }}</span>
        </div>
      </div>
    </div>`,

    name: 'CommentItem',


    data () {
      return {
        isLocked: false
      }
    },

    props: {
      item: {
        type: Object
      },
      type: {
        type: String
      },
      hasDelete: {
        default: false
      }
    },

    methods: {
      // 回复评论
      replyToReply (val) {
        if (!isLogin()) return;

        let replyParams = this.type === 'article' ? {
          url: 'home/inform/replyCommentOfArticle.do',
          rid: val.id,
          placeholder: '@' + val.userName
        } : {
          url: 'home/inform/commentReplyOfProblem.do',
          rid: val.id,
          placeholder: '@' + val.userName
        };

        this.$store.dispatch('updateReplyParams', replyParams);
        this.$store.dispatch('updateReplyState', true)
      },

      /**
       * 点赞
       */
      agree (id) {
        if (!isLogin() && this.isLocked) return;
        this.isLocked = true;
        this.$httpPost('home/inform/goodCommentOfInform.do', {
          icrid: id
        }).then(
          (data) => {
            this.isLocked = false;
            this.$emit('needUpdate')
          },
          (err) => {
            this.isLocked = false;
            showAlert(err.message)
          }
        )
      },

      deleteComment (item) {
        this.$httpPost('home/inform/deleteCommentOfUser.do', {
          id: item.id
        }).then(
          data => {
            this.$emit('needUpdate')
            showAlert(data.data)
          }
        ).catch(
          err => {
            window.console.log(err.message || err)
            showAlert(err.message || err)
          }
        )
      }
    }

  };


  export default {
    name: 'comment',

    props: ['id', 'type'],

    components: {
      commentItem,
      Pager,
      Reply
    },

    computed: {
      showTopFive () {
        return this.topList.length !== 0
      },

      showReplyList () {
        return this.commentList.length !== 0
      },

      isReplyShow () {
        return this.$store.getters.isReplyShow
      }
    },

    methods: {
      // 分页参数变化，重新请求分页内容
      handlePageChange (val) {
        this.commentPageCurr = val;
        // 修改 scroll
        $(document.body).scrollTop($('#newest' + this.id).offset().top - 80);
        this.getCommentList()
      },

      // 格式化请求数据
      solveResponseData (currDetail) {
        let list = [];

        currDetail.forEach((val) => {
          let curr = {};

          ({
            nickname: curr.userName,
            head: curr.userAvatar,
            createTime: curr.date,
            content: curr.content,
            goodNum: curr.voteNum,
            id: curr.id,
            replyContent: curr.replyContent,
            replyNickName: curr.replyNickName,
            uid: curr.uid,
            delete: curr.delete,
            goodUserTag: curr.goodUserTag
          } = val);

          list.push(curr)
        });
        return list
      },

      /**
       * 获取评论列表
       */
      getCommentList () {
        let
          url = this.type === 'article' ?
            'home/public/getICommentArticlePage.do' : 'home/public/getReplyOfICommentPage.do',
          params =
            this.type === 'article' ? {
              iid: this.id,
              pageSize: this.pageSize,
              pageCurrent: this.commentPageCurr
            } : {
              parentId: this.id,
              pageSize: 5,
              pageCurrent: this.commentPageCurr
            };
        this.$httpGet(url, params).then(
          (data) => {
            if (data.statusCode === 200) {
              this.commentPageCount = data.data.pageCount;
              this.commentList = this.solveResponseData(data.data.rows);
              this.totalNum = data.data.total
            }
          }
        ).then(
          this.getTopFive(),
          (err) => {
            window.console.log(err.message)
          }
        )
      },

      getTopFive () {
        let
          url = this.type === 'article' ?
            'home/public/getTopFiveICommentOfArticleList.do' : 'home/public/getTopFiveICommentOfReplyProblemList.do',

          params =
            this.type === 'article' ? {
              iid: this.id
            } : {
              parentId: this.id
            };
        this.$httpGet(url, params).then((data) => {
          if (data.statusCode === 200) {
            this.topList = this.solveResponseData(data.data)
          }
        })
      },

      // 新增回复
      addReply () {
        if (!isLogin()) {
          return
        }

        let replyParams = this.type === 'article' ? { // 回复文章
          url: 'home/inform/commentArticle.do',
          iid: this.id
        } : { // 回复问题的回答及评论
          url: 'home/inform/commentReplyOfProblem.do',
          rid: this.id
        };

        this.$store.dispatch('updateReplyParams', replyParams);
        this.$store.dispatch('updateReplyState', true)
      }
    },

    mounted () {
      this.getCommentList();
    },

    data() {
      return {
        totalNum: 0,
        topList: [],
        commentList: [],
        commentPageCurr: 1,
        commentPageCount: 1,
        pageSize: 10
      }
    }
  }
</script>

<style lang="stylus">

  @import '../../assets/style/variables.styl'

  .comment
    .comment-title,
    .comment-list-title
      margin 20px 0

    .comment-title
      color $sky
      font-size 18px
      span
        font-size 20px

    .comment-box
      border 1px solid #efefef
      border-radius 4px
      padding 0 40px
      margin 20px 0
      position relative
      height 35px
      line-height 33px
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

      /*.comment-area*/
        /*background-color #fff*/
        /*width 100%*/
        /*padding 0 30px*/
        /*height 35px*/
        /*border-radius 4px*/
        /*border 1px solid #ccc*/

    .top-comments
      border 1px solid #eee
      .top-title
        background-color #eee
        height 28px
        line-height 28px
        padding 0 13px
        color #666
      .top-box
        padding 12px

    .comment-list
      padding 0 12px
      .comment-list-title
        color $sky

    .comment-item

      & + .comment-item
        margin-top 18px

      .item-avatar
        width 65px
        height 65px
        overflow hidden
        float left

        img
          width 100%
          height 100%

      .item-content
        margin-left 77px

        > div + div
          margin 18px 0

        .item-title
          background-color #D6E6F6
          padding 0 5px
          height 24px
          line-height 24px
          .item-username
            color $sky
          .item-date
            color #999
            margin-left 10px

        .operate-panel
          text-align right
          color #999
          span
            margin-left 10px
            cursor pointer
            user-select none
            &:hover
              text-decoration underline

  .comment-to-comment
    background-color #eee
    padding 15px 20px

  .question-page
    .top-comments
      border 0 !important

</style>
