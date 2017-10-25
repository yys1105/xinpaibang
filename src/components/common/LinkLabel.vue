<script>
  export default {
    name: 'LinkLabel',

    props: {
      label: {
        type: String,
        required: true
      },
      fontSize: {
        type: [String, Number],
        default: 14
      },
    },

    methods: {
      handleLabelClick() {
        this.$root.$children[0].$refs.appHeader.changeSearchText(this.label);
        this.$store.dispatch('search', {
          searchInfo: {title: this.label, pageCurrent: 1},
          searchType: 'all'
        }).then(() => this.$router.push({name: 'search'}))
      }
    }
  }
</script>

<template>
  <a
    class="link-label"
    @click="handleLabelClick"
    v-text="`#${label}#`"
    :title="`在搜索页面搜索更多${label}的信息`"
    :style="{'font-size': parseInt(this.fontSize) + 'px'}"></a>
</template>

<style scoped lang="stylus">
  .link-label
    display inline-block
    margin-right 10px
    font-weight bold
</style>
