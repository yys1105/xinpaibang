<template>
  <div>
    <div class="reply-list">
      <div class="reply-head">{{ totalReply }}个回答</div>
      <reply v-for="(item, index) in replyList" :reply-data="item" :key="index" @needUpdate="getReplies"></reply>
      <p align="center" style="margin-bottom: 20px" v-if="loadingShow">
        <span v-for="(str, index) in loadingStr" :key="index" :class="{'bigger': index === biggerOne}" v-text="str"></span>
      </p>
      <div class="reply-foot" @click="showMoreReply" v-if="!isComplete">显示更多</div>
    </div>

    <div class="write-reply card-style" v-if="isLogin" id="write">
      <div class="user-info">
        <img :src="userInfo.head" alt="" class="user-avatar">
        <p class="reply-username">{{ userInfo.nickname }}</p>
        <p class="reply-bio">{{ userInfo.signature }}</p>
      </div>
      <div class="write-box clearfix">
        <rich-text :content="writeReplyInfo.content" @editorChange="getContent" ref="richText"></rich-text>
        <i-button type="primary" class="submit-reply" @click="replySubmit">发布</i-button>
      </div>
    </div>
    <!-- 未登录提示 -->
    <div class="write-reply card-style" v-if="!isLogin">
      <p class="login-tips">立即登录回答此问题<a @click="$store.dispatch('updateLoginState', true)">点击这里登陆</a></p>
    </div>
  </div>
</template>

<script>
  import Reply from './Reply.vue'
  import RichText from '../../components/common/RichText.vue'
  import IButton from 'iview/src/components/button'
  import {
    showAlert,
    isLogin
  } from '../../config/functions'

  export default{
    name: 'QuestionAnswerList',
    data () {
      return {
        flag: false,
        biggerOne: 0,
        loadingStr: 'loading...',
        loadingShow: false,
        // 回复列表
        replyList: [],
        totalReply: 0,
        writeReplyInfo: {
          content: ''
        },
        result: '',
        // 数据是否请求完成
        isComplete: true,
        // 提交锁，防止重复提交
        isLocked: false
      }
    },

    components: {
      'reply': Reply,
      'rich-text': RichText,
      'i-button': IButton,
    },

    computed: {
      questionId () {
        return this.$route.params.id
      },
      isLogin () {
        return this.$store.getters.token
      },
      userInfo () {
        return this.$store.getters.token ? this.$store.getters.userInfo : {}
      }
    },

    created () {
      this.getReplies();
      setInterval(() => {
        if (this.biggerOne < this.loadingStr.length - 1) {
          this.biggerOne += 1
        } else {
          this.biggerOne = 0
        }
      }, 100)
    },

    methods: {
      // 获取问题回复
      getReplies (callback) {
        this.loadingShow = true;
        this.$httpGet('home/public/getICommentProblemPage.do', {
          iid: this.questionId,
          pageCurrent: this.questionReplyCurr
        }).then((data) => {
          this.replyList = [];
          this.loadingShow = false;
          this.isComplete = (data.data.pageCurrent === data.data.pageCount)|| (data.data.total === 0);
          let list = data.data.rows;
          this.totalReply = data.data.total;
          list.forEach((item) => {
            this.replyList.push({
              userName: item.nickname,
              userAvatar: item.head,
              bio: item.signature,
              originImg: item.contentImage,
              replyId: item.id,
              date: item.createTimeStr,
              previewContent: item.contentDescribe,
              detailContent: item.content,
              commentNum: item.commentNum,
              uid: item.uid
            })
          });
          callback && callback()
        }).catch(() => {
          this.loadingShow = false;
          callback && callback()
        })
      },

      // 获取富文本问题内容
      getContent (val) {
        this.result = val
      },

      // 提交回答
      replySubmit () {
        if (this.isLocked) return;
        this.isLocked = true;
        this.$httpPost('/home/inform/replyProblem.do', {
          iid: this.questionId,
          content: this.result,
        }).then(() => {
          showAlert("回答成功！");
          // 清空富文本
          this.writeReplyInfo.content = '';
          this.$refs.richText.clear();
          this.getReplies();
          $(window).scrollTop($('.reply-list').offset().top - 85);
          this.isLocked = false;
        }).catch((err) => {
          showAlert(err.message);
          this.isLocked = false;
        })
      },

      showMoreReply () {
        if (!this.isLocked) {
          this.isLocked = true;
          this.questionReplyCurr += 1;
          this.getReplies(() => {
            this.isLocked = false;
          });
        }
      },

      jumpToBottom () {
        this.flag = true
      }
    },

    watch: {
      replyList (list) {
        if (list.length !== 0 && this.flag) {
          setTimeout(() => {
            document.body.scrollTop = document.getElementById('write').offsetTop;
          }, 300);
          this.flag = false
        }
      }
    },

    beforeRouteEnter (to, from, next) {
      let flag = false;
      if (from.name === 'answer' && !(to.params.needJump===false)) {
        flag = true;
      }
      next(vm => {
        flag && vm.jumpToBottom()
      })
    }
  }
</script>

<style scoped lang="stylus">

  @import '../../assets/style/variables.styl'

  .write-reply
    padding 20px
    background-color #fff
    .login-tips
      text-align center

    .user-info
      position relative
      margin-left 65px
      min-height 50px

      .user-avatar
        width 50px
        height 50px
        position absolute
        left -65px
        top 0

      .reply-username
        color $sky

      .reply-bio
        font-size 14px
        color #959595
        margin-top 10px

    .write-box
      margin-top 20px

    .submit-reply
      margin-top 20px
      float right

  .bigger
    font-size 20px
</style>
