<template>
  <div class="main-data-list">
    <div class="content-view">
      <div class="main-data-container">
        <info-item
          v-for="item in dataList"
          :item="item"
          :key="item.id"
          :hasExtraBar="hasExtraBar"
          @needUpdate="getList"></info-item>
      </div>
      <gear v-if="listLoading"/>
      <p v-if="!dataList.length && !listLoading" align="center" class="none-item-tips">暂无案例</p>
      <pager :curr="listCurr" :total="listTotal" @change="handlePageChange"></pager>
    </div>
    <div style="float:right;width:290px;padding: 0 20px">
      <router-link class="ivu-btn ivu-btn-primary" :to="{ name: 'addCase' }" target="_blank">添加案列</router-link>
    </div>
  </div>
</template>

<script>
  import InfoItem from '../../common/info-list/InfoItem.vue'
  import Gear from '../../common/loading/Gear.vue'
  import Pager from '../../common/pager/Pager.vue'
  import IButton from 'iview/src/components/button'


  export default {
    name: 'coCase',

    components: {
      InfoItem,
      Gear,
      Pager,
      IButton
    },

    data() {
      return {
        dataList: [],
        listLoading: false,
        listCurr: 1,
        listTotal: 1,
        hasExtraBar: true
      }
    },

    methods: {
      getList() {
        // 公司的文章问答列表 || 所有的文章问答立标
        let url = 'home/company/getArticlePageOfCompany.do'
          , param = {
              cid: this.$route.params.id,
              pageCurrent: this.listCurr,
              pageSize: 10
            };
        this.listLoading = true;
        return this.$httpGet(url, param).then(
          data => {
            let list = [...data.data.rows];
            list.forEach(item => item.source && item.source.substring(0,3) === '转自：' && (item.source = item.source.substring(3)));
            this.dataList = [...list];
            this.listLoading = false;
            this.listTotal = data.data.pageCount
          }
        ).catch(_ => {
          this.listLoading = false;
          window.console.log('--精选列表--请求异常！')
        })
      },

      handlePageChange(val) {
        this.listCurr = val;
        this.getList()
      }
    },

    created() {
      this.getList()
    }

  }
</script>

<style scoped lang="stylus">
  .main-data-list
    margin-top 20px
</style>
