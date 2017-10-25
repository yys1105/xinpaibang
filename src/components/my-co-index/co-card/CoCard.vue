<template>
  <div class="co-card clearfix">
    <router-link :to="{ name: 'companyIndex', params:{id: item.cid} }" class="co-img">
      <div class="img-control">
        <img v-if="item.logo" src="" v-lazy="item.logo" alt="logo">
      </div>
    </router-link>
    <div class="right-content">
      <router-link :to="{name: 'companyIndex', params:{id: item.cid}}" tag="h2" class="co-name link"> {{ item.name }} </router-link>
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
  .co-img
    position relative
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
      margin-top 20px
    .co-synopsis
      margin-top 10px


</style>

