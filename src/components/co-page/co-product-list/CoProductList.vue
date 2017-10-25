<template>
  <div class="co-patent clearfix content-view">
    <co-item v-for="(item, index) in patentList" class="co-item" :key="index" :item="item"></co-item>
    <gear v-if="loading"></gear>
    <p v-if="!patentList.length && !loading" align="center" class="none-item-tips">暂无产品</p>
    <pager :curr="curr" :total="total" @change="handlePageChange"></pager>
  </div>
</template>

<script>
import CoItem from '../co-item/CoItem'
import Gear from "../../common/loading/Gear.vue"
import Pager from "../../common/pager/Pager.vue";


export default {
  name: 'coProductList',

  data() {
    return {
      patentList: [],
      loading: false,
      curr: 1,
      total: 1,
    }
  },

  methods: {
    handlePageChange(val) {
      this.curr = val
      this.getCoGoods()
    },

    getCoGoods() {
      this.loading = true
      this.$httpGet('home/company/getGoodPageOfCompany.do', {
        cid: this.$route.params.id,
        pageCurrent: this.curr,
        pageSize: 9
      }).then(data => {
        this.loading = false
        this.patentList = data.data.rows
        this.total = data.data.pageCount
      }).catch(err => {
        this.loading = false
        this.patentList = []
      })
    },
  },

  created() {
    this.getCoGoods()
  },

  components: {
    Pager,
    Gear,
    CoItem
  }
}
</script>

<style scoped lang="stylus">
  .co-patent
    margin-top 20px

  .co-item
    width 270px
    height 400px
    display inline-block
    float left
    margin 0 20px 40px

  .content-view
    width 930px !important
</style>
