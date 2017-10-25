<template>
  <div class="reply" :class="{'card-style': hasCardStyle}" :id="'reply' + replyData.replyId">
    <img :src="replyData.userAvatar" alt="user-avatar" class="avatar-img">
    <p v-text="replyData.userName" style="color: #06c"></p>
    <p v-text="replyData.bio" style="color: #959595; line-height: 32px"></p>
    <div class="preview-content clearfix" v-show="!displayDetail">
      <img :src="replyData.originImg" v-if="replyData.originImg" alt="origin-img" class="preview-img">
      <div class="right-part clearfix" :style="textStyle">
        <p v-html="replyData.previewContent"></p>
        <a @click="toggleDetail">显示全部</a>
      </div>
    </div>

    <div class="detail-content clearfix" v-show="displayDetail">
      <div v-html="replyData.detailContent"></div>
      <p class="edit-time"><a>最后编辑于{{ replyData.date | dateFormat }}</a></p>
      <a @click="toggleDetail">收起全部</a>
    </div>

    <div class="q-meta">
      <a @click="toggleComments"><i class="iconfont icon-pinglun"></i> {{ !displayComments ? '展开评论' : '收起评论' }} </a>
      <!--<a style="margin-left: 20px" @click="collect(replyData.replyId)"><i class="iconfont icon-shoucang"></i> 收藏</a>-->
      <a style="margin-left: 20px" v-if="isLogin && (replyData.uid === userId)" @click="deleteReply(replyData.replyId)"><i class="iconfont icon-shanchu"></i> 删除</a>
    </div>
    <div class="reply-comment-list" v-if="displayComments">
      <comment :id="replyData.replyId"></comment>
    </div>
  </div>
</template>

<script>
  import Comment from '../../components/common/Comment'
  import { showAlert, isLogin } from '../../config/functions'

  export default {
    name: 'reply',
    components: {
      Comment
    },

    props: {
      replyData: {
        type: Object
      },
      isShow: {
        type: Boolean,
        default: false
      },
      hasCardStyle: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        displayDetail: this.isShow,
        displayComments: false,
        textStyle: {
          marginLeft: this.replyData.originImg ? '278px' : 0
        }
      }
    },

    computed: {
      isLogin () { return !!this.$store.state.userInfo.token },
      userId () {return this.$store.state.userInfo.userInfo.id},
      currQuestionId () { return this.$route.params.id }
    },

    methods: {
      toggleDetail () {
        this.displayDetail = !this.displayDetail
      },

      toggleComments () {
        this.displayComments = !this.displayComments
      },

      /**
       * 收藏问题的回答
       * @param {Number} id 问题回答的编号
       */
      collect(id) {
        if (!isLogin()) return;
        this.$httpPost('home/inform/collectCommentOfProblem.do', {
          icrid: id
        }).then(
          (data) => {
            showAlert(data.data)
          },
          (err) => {
            showAlert(err.message)
          }
        )
      },

      deleteReply (id) {
        this.$httpPost('home/inform/deleteCommentOfUser.do', {
          id: id
        }).then(
          data => {
            showAlert(data.data)
            this.$emit('needUpdate')
            if (this.$route.name === 'answer') this.$router.push({ name: 'question', params: {id: this.currQuestionId} })
          },
          err => showAlert(err.message || err)
        )
      }
    }
  }
</script>

<style scoped lang="stylus">

  .reply
    position relative
    padding 20px
    padding-left 105px
    margin-bottom 20px
    min-height 105px

    .avatar-img
      position absolute
      left 20px
      top 20px
      width 65px
      height 65px

    .reply-content
      margin-top 10px

    .preview-content
      .preview-img
        width 258px
        height 172px
        margin-right 20px
        float left
      .right-part
        > p
          *
            line-height 28px !important
        > a
          float right
          margin 10px 0
    .q-meta
      text-align right
    .detail-content
      .edit-time
        text-align right
        > a
          text-decoration none

      > a
        float right
        margin 10px 0

</style>
