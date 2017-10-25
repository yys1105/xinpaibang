<template>
  <div class="quiz-modal modal" @mousewheel.prevent.stop @touchstart.stop.prevent @click.self="closeQuizModal"  @keyup.esc="closeQuizModal">
    <div class="quiz-box">
      <span class="ask-box-close" @click="closeQuizModal"><i class="iconfont icon-x"></i></span>
      <h2 class="quiz-head">写下你的问题</h2>
      <i-input v-model="title" type="textarea" placeholder="问题标题"></i-input>
      <input-tag class="quiz-labels ivu-input" :initLabelNames="labels" @tagsChanged="handleTagsChanged" placeholder="添加标签"></input-tag>
      <p style="margin: 40px 10px 0; line-height: 2">问题描述（可选）:</p>
      <i-input v-model="content" type="textarea" :rows="6" placeholder="输入正文"></i-input>
      <i-button type="primary" class="submit-quiz" @click="quizSubmit">提交问题</i-button>
    </div>
  </div>
</template>

<script>
  import InputTag from '../input-tag/InputTag.vue'
  import IInput from 'iview/src/components/input'
  import {
    Select as ISelect,
    Option as IOption
  } from 'iview/src/components/select'
  import IButton from 'iview/src/components/button'
  import { showAlert } from '../../../config/functions/index'

  export default {

    name: 'askModal',

    components: {
      IInput,
      ISelect,
      IOption,
      IButton,
      InputTag
    },

    data () {
      return {
        loadingShow: false,

        title: '',
        labels: [],
        content: '',

        // 提交锁
        canSubmit: true
      }
    },

    methods: {
      handleTagsChanged(val) {
        this.label = val
      },

      /**
       * 提交问题
       */
      quizSubmit () {
        if (!this.canSubmit) return;
        this.canSubmit = false;
        if (this.$store.getters.userInfo) {
          if (!this.title || !this.labels.length || !this.content) {
            showAlert('信息不完整哦！');
            return
          }
          this.$httpPost('home/inform/saveQuestion.do', {
            title: this.title,
            content: this.content,
            labelNames: this.labels.join(',')
          }).then(
            (data) => {
              showAlert(data.data);
              this.$store.dispatch('updateQuizState', false);
              this.$router.push({ name: 'home' });
              this.canSubmit = true;
            },
            (err) => {
              showAlert(err.message);
              this.canSubmit = true;
            }
          )
        } else {
          showAlert('尚未登陆');
          this.$store.dispatch('updateQuizState', false);
          this.$store.dispatch('updateLoginState', true)
        }
      },

      closeQuizModal () {
        this.$store.dispatch('updateQuizState', false)
      }

    }
  }
</script>

<style scoped lang="stylus">

  @import '../../../assets/style/variables.styl'

  .quiz-modal
    min-width 1220px

    .quiz-box
      position relative
      background-color #fff
      border-radius 3px
      width 30%
      min-width 450px
      min-height 500px
      margin 8% auto
      padding 20px

      .ask-box-close
        position absolute
        right 10px
        top 10px
        cursor pointer

      .quiz-head
        text-align center
        margin 10px 0 50px

      .quiz-labels
        margin-top 20px
        border 1px solid #dddee1
        border-radius 4px
        height auto

      .submit-quiz
        display block
        margin 20px auto 0
        width 232px

</style>
