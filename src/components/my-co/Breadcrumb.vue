<template>
  <div class="breadcrumb" v-if="breadcrumbInfo">
    {{ breadcrumbInfo }}
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',

  computed: {
    breadcrumbInfo() {
      return this.$route.meta.breadcrumbInfo
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../assets/style/variables.styl'

  fontColor = #666

  .breadcrumb
    display inline-block
    padding 20px 0
    font-size 14px
    font-weight bold
    color fontColor

</style>

