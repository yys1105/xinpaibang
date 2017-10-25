<template>
  <div class="modal reply" @keyup.esc="closeModal">
    <div class="reply-box">
      <i class="iconfont icon-x" @click="closeModal"></i>
      <div class="reply-head">
        <p>{{ username }}</p>
        <p style="font-size: 13px; color: #999" v-text="signature"></p>
      </div>
      <div class="reply-body">
        <i-input type="textarea" :rows="5" title="reply" v-model="content" :placeholder="'添加评论:  ' + (params.placeholder || '')" ></i-input>
      </div>
      <div class="reply-foot clearfix">
        <i-button class="xpb-btn" type="primary" @click="submitReply">发&emsp;布</i-button>
      </div>
    </div>
  </div>
</template>

<script>
  import IButton from 'iview/src/components/button'
  import IInput from 'iview/src/components/input'
  import { showAlert } from '../../../config/functions/index'


  export default {
    name: 'name',

    components: {
      IButton,
      IInput
    },

    data () {
      return {
        content: '',
        canSubmit: true
      }
    },

    computed: {
      params () {
        return this.$store.getters.replyParams
      },
      user () {
        return this.$store.getters.userInfo
      },
      username () {
        return this.user ? this.$store.getters.userInfo.nickname : ''
      },
      signature () {
        return this.user ? this.$store.getters.userInfo.signature : ''
      }

    },


    methods: {
      // 提交回复
      submitReply () {
        if (this.content === '')
          return showAlert('请填写评论信息！')

        // 锁定提交，防止多次提交
        if (!this.canSubmit) return;
        this.canSubmit = false;

        let
          {url : url} = this.params,
          paramsData = {};
        for (let key of Object.keys(this.params)) {
          (key !== 'url' && key !== 'placeholder') && (paramsData[key] = this.params[key])
        }
        paramsData.content = this.content;
        this.$httpPost(url, paramsData)
          .then(
            (data) => {
              showAlert(this.params.placeholder ? "回复成功！" : "评论成功!");
              this.$store.dispatch('updateReplyParams', {});
              this.content = '';
              this.$emit('submit');
              this.$store.dispatch('updateReplyState', false);
              this.canSubmit = true
            },
            (err) => {
              showAlert(err.message);
              this.canSubmit = true
            }
          )
      },

      // 关闭弹出层
      closeModal () {
        this.$store.dispatch('updateReplyState', false)
      }
    }
  }
</script>

<style scoped lang="stylus">

  @import '../../../assets/style/variables.styl'

  .reply
    .reply-box
      position relative
      width 475px
      background-color #fff
      margin 10% auto 0
      border-radius 3px

      .iconfont
        position absolute
        right 10px
        top 10px
        cursor pointer

      .reply-head,
      .reply-body,
      .reply-foot
        padding 15px 20px
        box-shadow none

      .reply-head,
      .reply-body
        border-bottom 1px solid #efefef

      .reply-foot
        .xpb-btn
          float right

</style>
