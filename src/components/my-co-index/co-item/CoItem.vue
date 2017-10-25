<template>
  <Card class="card" dis-hover>
    <router-link :to="{ name:'companyItemShop', params: { id: item.cid, itemId: item.id } }" target="_blank" class="img-box">

      <img src="" v-lazy="item.imageUrl" alt="card-img">
    </router-link>
    <p align="center" class="item-name">{{ item.name }}</p>

    <div class="operate-btn-group">
      <table>
        <tr>
          <th>
            <i-button
              class="btn"
              type="ghost"
              @click="changeItemStatus(item)">{{ item.shelves ? '下架' : '上架'}}</i-button>
          </th>
          <th>
            <i-button
              class="btn"
              type="ghost"
              @click="moveItem('前移')"
              v-if="canMovePrev && item.shelves">前移</i-button>
            <i-button
              class="btn"
              type="ghost"
              @click="deleteItem(item)"
              v-if="!item.shelves">删除</i-button>
          </th>
          <th>
            <i-button
              class="btn"
              type="ghost"
              @click="moveItem('后移')"
              v-if="canMoveNext && item.shelves">后移</i-button>
          </th>
          <th>
            <i-button
              class="btn"
              type="ghost"
              @click="jumpToModify(item)">修改</i-button>
          </th>
        </tr>
      </table>
    </div>
  </Card>
</template>

<script>
  import {
    Row as IRow,
    Col as ICol
  } from 'iview/src/components/grid'
  import Card from 'iview/src/components/card'
  import IButton from 'iview/src/components/button'
  import { showAlert, showConfirm } from '../../../config/functions'

  export default {
    name: 'coItem',

    props: {
      item: {
        type: Object
      },
      index: {
        type: Number
      },
      canMovePrev: {
        type: Boolean,
        default: true
      },
      canMoveNext: {
        type: Boolean,
        default: true
      }
    },

    methods: {
      needUpdate() {
        this.$parent.getCoGoods()
      },

      // 删除下架产品
      deleteItem(item) {
        if (!showConfirm('删除该下架产品？'))
          return
        this.$httpPost('home/user/deleteProduct.do', {
          pid: item.id
        }).then(data => {
          showAlert(data.data)
          this.needUpdate()
        })
      },


      // 改变公司产品上架下架状态
      changeItemStatus(item) {
        let tips = item.shelves ? '下架' : '上架'
        if (!showConfirm(`确认${tips}`))
          return
        this.$httpPost('home/user/shelvesOfProductStatusChange.do', {
          id: item.id
        }).then(data => {
          showAlert(data.data)
//          this.needUpdate()
          this.item.shelves = !item.shelves
        }).catch(err => {
          console.log(err.message || err)
        })
      },

      // 前移后移公司产品
      moveItem(val) {
        if (!showConfirm(`确认${val}?`))
          return
        this.$httpPost('home/user/positionOfProductChange.do', {
          pid: this.item.id,
          front: val === '前移'
        }).then(data => {
          showAlert(data.data)
          this.needUpdate()
        }).catch(err => {
          console.log(err.message || err)
        })
      },

      jumpToModify(item) {
        window.open(window.location.href+'item/' + item.id)
      }
    },

    components: {
      Card,
      IButton,
      IRow,
      ICol
    },

    data () {
      return {}
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
      display block
      img-center('horizon')
      img
        height 300px
    .item-name
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .operate-btn-group
      table
        width 100%
      th
        width 25%
      border-top 1px solid #ededed
      padding-top 10px
      margin-top 10px
      .btn
        height 30px
        line-height 30px
        padding 0 14px
        font-size 12px
</style>
