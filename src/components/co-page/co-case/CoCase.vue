<template>
  <info-list
    class="content-view"
    :list="dataList"
    :loading="listLoading"
    :listCompleted="listComplete"
    @requireMore="getList"></info-list>
</template>

<script>
  import InfoList from '../../common/info-list'

  export default {
    name: 'coCase',

    components: {
      InfoList
    },

    data() {
      return {
        dataList: [],
        listLoading: false,
        listComplete: false,
        listCurr: 1
      }
    },

    methods: {
      getList() {
        //公司的文章问答列表 || 所有的文章问答立标
        let
          url = 'home/company/getArticlePageOfCompany.do',
          param = {
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
            data.data.pageCurrent === data.data.pageCount && (this.listComplete = true);
            this.listCurr = data.data.pageCurrent;
          }
        ).catch(err => {
          this.listLoading = false;
          console.log(err)
        })
      }
    },

    created() {
      this.getList()
    }

  }
</script>

<style scoped lang="stylus">

</style>
