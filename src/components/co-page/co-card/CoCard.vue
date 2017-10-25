<template>
  <div class="co-card clearfix">
    <router-link :to="{ name: 'companyIndex', params:{id: item.cid} }" class="co-img" target="_blank">
      <div class="img-control">
        <img src="" v-lazy="item.logo" alt="logo">
      </div>
    </router-link>
    <div class="right-content">
      <router-link :to="{name: 'companyIndex', params:{id: item.cid}}" class="co-name link" target="_blank"> {{ item.name }} </router-link>
      <p class="co-synopsis"> {{ item.synopsis }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'coCard',

  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '../../../assets/style/variables.styl'

.co-card
  padding 8px
  position relative
  height 196px
  text-overflow ellipsis
  overflow hidden
  .co-img
    position absolute
    width 318px
    height 180px
    border-radius 3px
    overflow hidden
    left 8px
    cursor pointer
  .right-content
    float left
    margin-left 328px
    .co-name
      font-size 24px
      margin-top 20px
      text-decoration none
      color #333
      &:hover
        color #57a3f3
    .co-synopsis
      margin-top 30px

</style>

