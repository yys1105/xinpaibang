<template>
  <Card class="card" dis-hover>
    <router-link class="img-box" style="display:block" :to="{ name:'companyItemShop', params: { id: item.cid, itemId: item.id } }" target="_blank">
      <img src="" v-lazy="item.imageUrl" alt="card-img">
    </router-link>
    <p align="center" class="item-name">{{ item.name }}</p>
    <div class="operate-btn-group" v-if="$route.name !== 'collection'">
      <i-button class="btn" type="primary" @click="inquiryUs(item)">联系我们</i-button>
      <i-button v-if="!item.collectTag" class="btn" type="ghost" @click="addCart">购物车</i-button>
      <i-button v-else class="btn" type="ghost" disabled>已收藏</i-button>
    </div>
    <div class="operate-btn-group" v-if="$route.name == 'collection'">
      <i-button class="btn" type="primary" @click="inquiryUs(item)">联系我们</i-button>
      <i-button class="btn" type="ghost" @click="removeCollect">删除收藏</i-button>
    </div>
  </Card>
</template>

<script>
  import Card from 'iview/src/components/card'
  import IButton from 'iview/src/components/button'
  import { showAlert, isLogin, showConfirm } from '../../../config/functions'


  export default {
    name: 'coItem',

    props: {
      item: {
        type: Object
      }
    },

    components: {
      Card,
      IButton
    },

    methods: {
      inquiryUs(item) {
        this.$store.dispatch('toggleSendMsgBoxShow', {show: true, item: item})
      },

      removeCollect() {
        if (!showConfirm('从个人收藏移除？'))
          return
        this.$httpPost('home/user/deleteCollectProductOfUser.do', {
          pid: this.item.id
        }).then(data => {
          showAlert(data.data)
          this.$emit('needUpdate')
        }).catch(err => {
          if (err.message)
            showAlert(err.message)
        })
      },

      addCart() {
        if (!isLogin() || !showConfirm('添加到个人收藏？'))
          return
        this.$httpPost('home/product/collectProduct.do', {
          id: this.item.id
        }).then(data => {
          showAlert(data.data)
        }).catch(err => {
          if (err.message)
            showAlert(err.message)
        })
      }
    },

    data () {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../../assets/style/variables.styl'
  @import '../../../assets/style/mixin.styl'

  .card
    text-align center
    .img-box
      height 295px
      margin-bottom 10px
      img-center('horizon')
      img
        height 300px
    .item-name
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .operate-btn-group
      border-top 1px solid #ededed
      padding-top 10px
      margin-top 10px
      .btn
        height 30px
        line-height 30px
        padding-top 0
        padding-bottom 0
</style>
