<script>
  export default {
    name: 'SiteAbout',

    data () {
      return {
        content: '',
        title: ''
      }
    },

    computed: {
      type() {
        return this.$route.name
      }
    },

    methods: {
      getContent() {
        this.$httpGet('home/home/getConfigDtaInform.do', { configDataType: this.type })
          .then(({ data }) => ({ name: this.title, val: this.content } = data))
      }
    },

    created() {
      this.getContent();
    }
  }
</script>

<template>
  <div class="ql-editor site-info" style="padding-bottom: 20px;">
    <h4 v-text="title" align="center" style="margin-top: 20px;"></h4>
    <p v-html="content"></p>
  </div>
</template>

<style lang="stylus">
  .ql-editor.site-info
    p img
      max-width 1190px
</style>

<style scoped lang="stylus">
  .ql-editor
    overflow hidden
    img
      max-width 1190px
</style>
