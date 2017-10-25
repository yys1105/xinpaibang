<template>
  <ul class="co-contract content-view">
    <li v-for="item in contractList" class="contract-item clearfix">
      <span class="item-icon iconfont" :class="item.icon"></span>
      <div class="item-content">
        <p style="margin-top: 10px">{{ item.label }}</p>
        <p style="margin-top: 10px"><a style="text-decoration: none">{{ info[item.value] }}</a></p>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'coContractUs',

    props: {
      info: {
        type: Object
      }
    },

    data () {
      return {
        contractList: [
          { icon: 'icon-dingwei', label: '地址', value: 'address' },
          { icon: 'icon-dianhua', label: '电话', value: 'landlineTelephone' },
          { icon: 'icon-xinjianbianhao', label: '邮箱', value: 'email' },
          { icon: 'icon-wangluo', label: '网站', value: 'website' }
        ]
      }
    },
  }
</script>

<style scoped lang="stylus">

  .co-contract
    margin-top 50px
  .contract-item
    padding-left 40px
    position relative
    z-index 10
    margin-bottom 40px
    min-height 85px
    .item-icon
      display inline-block
      width 50px
      height 50px
      text-align center
      border-radius 50%
      box-shadow 0 0 20px #ccc
      margin 0 15px
      position absolute
      top 15px
      color #aaaaaa
      font-size 20px
      &.iconfont::before
        display inline-block
        width 50px
        height 50px
        line-height 50px
        text-align center
    .item-content
      display inline-block
      /*float right*/
      margin-left 100px
    & + .contract-item
      .item-icon::after
        content ''
        display inline-block
        position absolute
        height 60px
        width 1px
        left 25px
        top -68px
        background-color #ECECEC
        box-shadow 0 0 15px #000

</style>
