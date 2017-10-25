<template>
  <div class="my-collect">
    <header-sort class="border" :tabList="tabList" @tabChanged="handleTabChange"></header-sort>
    <div class="">
      <loading v-if="loading"></loading>
      <template v-if="searchData.length">
        <combine-info v-for="(item, index) in searchData" :info="item" :key="index" @needUpdate="getCollections({ type: tabList[currentTab].tag ,pageCurrent: pageCurrent })"></combine-info>
      </template>
      <template v-else-if="!loading && !searchData.length">
        <p align="center">无相关信息</p>
      </template>
    </div>
    <pager :total="pageCount" :curr="pageCurrent" @change="handlePageChange"></pager>
  </div>
</template>
<script>
import HeaderSort from '../../../components/common/header-sort'
import CombineInfo from '../../../components/common/CombineInfo'
import Pager from '../../../components/common/pager'
import Loading from '../../../components/common/loading/Gear'

export default {
  name: 'myCollections',

  components: {
    Pager,
    HeaderSort,
    CombineInfo,
    Loading
  },

  data() {
    return {
      tabList: [
        { label: '所有', tag: 'all', index: 0 },
        { label: '资讯', tag: 'info', index: 1 },
        { label: '企业', tag: 'co', index: 2 },
        { label: '产品', tag: 'product', index: 3 },
      ],
      loading: false,
      searchData: [],
      pageCount: 1,
      pageCurrent: 1,
      currentTab: 0
    }
  },

  methods: {
    handlePageChange(val) {
      this.pageCurrent = val

      let params = {
        type: this.tabList[this.currentTab].tag,
        pageCurrent: this.pageCurrent
      }
      this.getCollections(params)
    },
    handleTabChange(val) {
      this.currentTab = val
      let params = {
        type: this.tabList[val].tag,
        pageCurrent: 1
      }
      this.getCollections(params)
    },
    getCollections({ type = 'all', pageCurrent = 1 } = {}) {
      this.searchData = []
      this.loading = true
      let url = {
        'all': 'home/user/myCollect.do',
        'info': 'home/user/collectInform.do',
        'co': 'home/user/collectCompany.do',
        'product': 'home/user/collectProduct.do',
      }
      this.$httpGet( url[type], {
        pageCurrent: pageCurrent
      })
        .then(data => {
          this.searchData = data.data.rows
          this.pageCount = data.data.pageCount
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    }
  },

  created() {
    this.getCollections()
  },


}
</script>

<style lang="stylus" scoped>
  .border
    margin-bottom 20px
</style>

