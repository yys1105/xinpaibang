<template>
  <div class="content-view">
    <header-sort :tabList="tabList" @tabChanged="handleTabChanged"></header-sort>
    <div class="search-co">
      <input type="text" placeholder="点击输出查询内容" title="搜索公司" v-model="searchData">
      <div class="search-button">
        <button type="button" @click="handleSearch">搜索企业</button>
      </div>
    </div>
    <gear v-if="loading"></gear>
    <co-list-card v-for="(item, index) in coList" :key="index" class="co-card" :item="item"></co-list-card>
    <pager :curr="curr" :total="total" @change="handlePagerChange"></pager>
  </div>
</template>

<script>
  import CoListCard from '../../../../components/my-co-list/CoListCard.vue'
  import HeaderSort from '../../../../components/common/header-sort/HeaderSort.vue'
  import Pager from '../../../../components/common/pager/Pager.vue'
  import Gear from '../../../../components/common/loading/Gear.vue'
  import {showAlert} from '../../../../config/functions'

  export default {
    name: '',

    data() {
      return {
        tabList: [
          { label: '企业名称', tag: 'name', index: 0 },
          { label: '工商注册号', tag: 'registrationNumber', index: 1 },
          { label: '法人代表', tag: 'legalRepresentative', index: 2 }
        ],
        coList: [],
        searchData: '',
        currTab: 0,

        curr: 1,
        total: 1,

        loading: false
      }
    },

    methods: {
      /**
       * 点击 tab
       * @param {Number} val tabList 的序号
       */
      handleTabChanged(val) {
        this.currTab = val
      },

      /**
       * 获取认领企业列表
       */
      getCoClaimList() {
        this.loading = true;
        let param = {
          [this.tabList[this.currTab].tag]: this.searchData
        };
        if (this.searchData === '')
          param = {};
        param.pageCurrent = this.curr;
        param.pageSize = 10;
        this.coList = [];
        this.$httpGet('home/user/noClaimCompany.do', param)
          .then(data => {
            this.coList = data.data.rows;
            this.total = data.data.pageCount;
            this.loading = false
          })
          .catch(err => {
            this.loading = false;
            if (err || err.message) {
              showAlert(err.message+' 稍后再试！');
            }
          })
      },

      /**
       * 搜索操作
       */
      handleSearch() {
        this.curr = 1
        this.getCoClaimList()
      },

      /**
       * 分页操作
       */
      handlePagerChange(val) {
        this.curr = val
        this.getCoClaimList()
      }
    },

    created() {
      this.getCoClaimList()
    },

    components: {
      CoListCard,
      HeaderSort,
      Pager,
      Gear
    }
  }
</script>

<style scoped lang="stylus">

  .search-co
    margin-top -2px
    display table
    width 100%
    height 35px
    border-collapse separate
    box-shadow 0 0 5px #bbb
    margin-bottom 10px
    input
      width 100%
      display table-cell
      border 1px solid #cccccc
      padding 10px
      padding-left 20px
    .search-button
      height 100%
      width 15%
      display table-cell
      button
        height 100%
        width 100%
        border 0
        background-color #0066CB
        color #fff

  .co-card
    margin-bottom 20px
    border 1px solid #cccccc

</style>
