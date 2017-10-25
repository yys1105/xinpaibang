<template>
  <div class="co-product-list">
    <div class="content-view">
      <div class="clearfix">
        <co-item
          v-for="(item, index) in itemList"
          class="co-item"
          :key="index"
          :item="item"
          :canMovePrev="index != 0 || curr != 1"
          :canMoveNext="index != coItemTotal-1"></co-item>
      </div>
      <gear v-if="loading"></gear>
      <p v-if="!itemList.length && !loading" align="center" class="none-item-tips">暂无产品</p>
      <pager :curr="curr" :total="total" @change="handlePageChange"></pager>
    </div>
    <div style="float:right;width:290px;padding: 0 20px">
      <i-button type="primary" @click="$router.push({ name: 'addItem' })">添加产品</i-button>
    </div>
  </div>
</template>

<script>
import CoItem from '../co-item/CoItem';
import Pager from '../../common/pager/Pager';
import IButton from 'iview/src/components/button';
import Gear from "../../common/loading/Gear.vue";

export default {
  name: 'CoPatent',

  data() {
    return {
      itemList: [],
      total: 1,
      curr: 1,
      coItemTotal: 0,
      loading: false
    }
  },

  methods: {
    getCoGoods() {
      this.loading = true;
      this.$httpGet('home/user/getGoodPageOfCompany.do', {
        cid: this.$route.params.id,
        pageCurrent: this.curr,
        pageSize: 9
      }).then(data => {
        this.itemList = [];
        setTimeout(() => {
          this.total = data.data.pageCount;
          this.coItemTotal = data.data.total;
          this.itemList = data.data.rows;
          this.loading = false
        }, 100)
      }).catch(err => {
        this.loading = false
      })
    },

    handlePageChange(val) {
      this.curr = val;
      this.getCoGoods()
    }
  },

  created() {
    this.getCoGoods()
  },

  components: {
    Gear,
    CoItem,
    Pager,
    IButton
  }
}
</script>

<style scoped lang="stylus">
  .co-product-list
    margin 20px 0

  .co-item
    width 263px
    height 400px
    display inline-block
    float left
    margin 0 20px 40px

  .tips
    height 80px
    line-height 80px
    color #06c
    user-select none
    cursor pointer
</style>
