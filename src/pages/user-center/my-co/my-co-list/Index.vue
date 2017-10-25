<template>
  <div>
    <bread-crumb></bread-crumb>
    <div class="me clearfix">
      <ul class="left-menu clearfix">
        <router-link :to="{ name: 'myCompanies' }" tag="li" class="left-menu-item" active-class="highlight">我的企业</router-link>
        <router-link :to="{ name: 'claimList' }" tag="li" class="left-menu-item" active-class="highlight">认领企业</router-link>
      </ul>
      <router-view class="me-view"></router-view>
    </div>
  </div>
</template>
<script>
  import BreadCrumb from '../../../../components/my-co/Breadcrumb.vue'
  export default {
    name: 'myCompanyList',
    components: {
      BreadCrumb
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/style/variables.styl'
  .me
    width $pageWidth
    margin 0 auto
    background-color #eee
    padding 20px 0
    .left-menu
      width 270px
      float left
      .left-menu-item
        line-height 52px
        user-select none
        cursor pointer
        padding-left 20px
        &.highlight
          background-color rgba(0, 0, 0, 0.3)
          &:hover
            background-color rgba(0, 0, 0, 0.3)
        &:hover
          background-color rgba(0, 0, 0, 0.1)
        & + .left-menu-item
          margin-top 5px
    .me-view
      float left
      width 950px
      padding-right 20px

</style>
