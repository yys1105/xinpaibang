<template>
  <div class="layout clearfix">
    <router-view class="content-view"></router-view>
    <app-aside></app-aside>
  </div>
</template>

<script>
  import AppAside from './AppAside'

  export default {
    name: 'content-layout',

    components: {
      AppAside
    },

    created () {},

    data () {
      return {
        headerBanner: '/static/images/header_banner.png',
      }
    }
  }
</script>

<style scoped lang="stylus">

  @import '../../assets/style/variables.styl'

  .app-content
    padding-bottom 100px

</style>
