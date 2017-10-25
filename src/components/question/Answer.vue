<template>
  <div>
    <router-link :to="{ name: 'question', params: { id: questionId, needJump: false } } " tag="div" class="card-style see-all">查看全部 {{ total }} 个回答</router-link>
    <reply class="current-answer" :isShow="true" :reply-data="answer"></reply>
    <router-link :to="{ name: 'question', params: { id: questionId, needJump: false } } " tag="div" class="card-style see-all">查看全部 {{ total }} 个回答</router-link>
  </div>
</template>

<script>
  import Reply from './Reply.vue'

  export default{
    name: 'questionAnswer',

    components: {
      Reply
    },

    data () {
      return {
        answer: {
          userName: '',
          userAvatar: '',
          bio: '',
          originImg: '',
          replyId: '',
          date: '',
          previewContent: '',
          detailContent: '',
          commentNum: '',
          uid: ''
        },
        total: 0
      }
    },

    computed: {
      questionId () {
        return this.$route.params.id
      },
      answerId () {
        return this.$route.params.aid
      }
    },

    methods: {
      getAnswer () {
        this.$httpGet('home/public/getICommentOfProblemById.do', {
          id: this.answerId
        }).then(
          (data) => {
            ({
              nickname: this.answer.userName,
              head: this.answer.userAvatar,
              signature: this.answer.bio,
              contentImage: this.answer.originImg,
              id: this.answer.replyId,
              createTime: this.answer.date,
              contentDescribe: this.answer.previewContent,
              content: this.answer.detailContent,
              commentNum: this.answer.commentNum,
              uid: this.answer.uid
            } = data.data)
          }
        ).then(
          _ => {
            this.$httpGet('home/public/getICommentProblemPage.do', {
              iid: this.questionId
            }).then( data => this.total = data.data.total)
          }
        ).catch(
          _ => this.$router.replace({ name: 'question', params: { id: this.questionId } })
        )
      }
    },

    created () {
      this.getAnswer()
    }
  }
</script>

<style scoped lang="stylus">

  .see-all
    color #999
    height 40px
    line-height 40px
    user-select none
    text-align center
    margin 20px 0

  .see-all
    cursor pointer

  .more-answer
    margin 0
    position relative
    z-index 10
    p
      padding 0 20px
      text-align center
      position relative
      height 40px
      line-height 40px
      &::after
        content ''
        position absolute
        border-top 1px solid #ccc
        display block
        width 40%
        top 50%
        z-index 0
      &::before
        content ''
        position absolute
        border-top 1px solid #ccc
        display block
        width 40%
        top 50%
        right 20px
        z-index 0

  .current-answer
    margin 20px 0


</style>
