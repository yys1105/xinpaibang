<template>
  <div>
    <header-sort
      class="border"
      :tabList="tabList"
      @tabChanged="handleTabChange"></header-sort>
    <loading v-if="loading"></loading>
    <template v-if="list.length">
      <info-item
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        class="border"
        style="padding: 8px"></info-item>
      <pager
        :total="pageCount"
        :curr="pageCurrent"
        @change="handlePageChange"></pager>
    </template>
    <template v-if="!loading && !list.length">
      <p style="padding-left: 20px">暂时没有发布任何咨询。</p>
    </template>
  </div>
</template>

<script>
  import HeaderSort from '../../../components/common/header-sort'
  import InfoItem from '../../../components/common/info-list/InfoItem.vue'
  import Pager from '../../../components/common/pager'
  import Loading from '../../../components/common/loading/Gear'

  export default {
    name: 'Post',
    components: {
      InfoItem,
      Pager,
      Loading,
      HeaderSort
    },
    data() {
      return {
        list: [],
        pageCurrent: 1,
        pageCount: 1,
        loading: false,
        tabList: [
          // @formatter:off
          { label: '文章', tag: 'article', index: 0 },
          { label: '回答', tag: 'answer', index: 1 },
          { label: '提问', tag: 'question', index: 2 }
          // @formatter:on
        ],
        urls: {
          'article': 'home/user/myInform.do?informType=article',
          'answer': 'home/user/myComment.do',
          'question': 'home/user/myInform.do?informType=question'
        },
        currTab: 0
      }
    },
    methods: {
      // 监听 tab 变化
      handleTabChange(val) {
        this.currTab = val;
        this.pageCurrent = 1;
        this.getPostList();
      },

      // 监听 分页器 变化
      handlePageChange(val) {
        this.pageCurrent = val;
        this.getPostList();
      },

      // 获取消息
      getPostList() {
        this.loading = true;
        this.list = [];
        this.$httpGet(this.urls[this.tabList[this.currTab].tag], {
          pageCurrent: this.pageCurrent
        })
          .then(data => {
            this.list = data.data.rows;
            this.pageCount = data.data.pageCount;
            this.loading = false
          })
          .catch(err => {
            console.log(err);
            this.loading = false
          })
      }
    },
    created() {
      this.getPostList()
    }
  }
</script>

<style lang="stylus" scoped>

  .border
    margin-bottom 20px

</style>
