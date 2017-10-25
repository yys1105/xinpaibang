<template>
  <div class="search-page">
    <div v-if="hotTopicImage !== ''" class="hot-topic-image">
      <img :src="getHotTopicImage()" alt="">
    </div>
    <header-sort class="border" :tabList="tabList" @tabChanged="handleTabChanged"></header-sort>
    <div>
      <loading v-if="loadingState"></loading>
      <template v-if="!loadingState && searchData.length === 0">
        <p align="center" style="margin-bottom: 20px">{{ '该页查找不到相关"' + searchText + '"的' + currentTab + '信息' }}</p>
      </template>
      <template v-if="searchTotal !== 0 && !loadingState">
        <combine-info v-for="(item, index) in searchData" :info="item" :key="index"></combine-info>
        <pager :total="pageCount" :curr="pageCurrent" @change="handlePageChange"></pager>
      </template>
    </div>
  </div>
</template>

<script>
  import Pager from '../components/common/pager'
  import HeaderSort from '../components/common/header-sort'
  import CombineInfo from '../components/common/CombineInfo'
  import Loading from '../components/common/loading/Gear'
  import {mapGetters, mapActions} from 'vuex'
  import {HOT_TOPIC} from "../config/const";

  export default {
    name: 'Search',

    beforeRouteLeave(to, from, next) {
      this.search({
        searchInfo: {title: '', pageCurrent: 1},
        searchType: 'all'
      }).then(() => next())
    },

    beforeRouteEnter(to, from, next) {
      next(vm => { vm.isRefresh = (from.name === 'search' || from.name === null) })
    },

    data() {
      return {
        tabList: [
          {label: '所有', tag: 'all', index: 0},
          {label: '资讯', tag: 'info', index: 1},
          {label: '企业', tag: 'co', index: 2},
          {label: '产品', tag: 'product', index: 3},
        ],
        currentTab: '所有',
        isRefresh: false,
        hotTopicImage: ''
      }
    },

    methods: {
      // 更换标签
      handleTabChanged(val) {
        let type = this.tabList[val].tag;
        this.currentTab = this.tabList[val].label;
        this.search({
          searchInfo: {title: this.searchText, pageCurrent: 1},
          searchType: type
        });
      },

      // 点击分页
      handlePageChange(val) {
        this.search({
          searchInfo: {title: this.searchText, pageCurrent: val},
          searchType: this.searchType
        }).then(() => $(document.body).scrollTop(0))
      },

      getHotTopicImage() {
        let list = this.hotTopicList
          , text = this.searchText
          , image = ''

        for (let item of list) {
          if (item.name === text) {
            image = item.image
          }
        }
        return image;
      },

      ...mapActions([
        'search'
      ])
    },

    watch: {
      isRefresh: function (val) {
        val && this.search({
          searchInfo: {title: this.searchText, pageCurrent: 1},
          searchType: this.searchType,
        })
      }
    },

    computed: {
      ...mapGetters({
        searchData: 'getSearchData',
        searchText: 'getSearchText',
        searchType: 'getSearchType',
        loadingState: 'getSearchLoadingState',
        pageCount: 'getSearchPageCount',
        pageCurrent: 'getPageCurrent',
        searchTotal: 'getSearchTotal'
      }),

      hotTopicList() {
        return JSON.parse(window.sessionStorage.getItem(HOT_TOPIC))
      }
    },

    updated() {
      this.hotTopicImage = this.getHotTopicImage()
    },

    components: {
      'pager': Pager,
      'header-sort': HeaderSort,
      'combine-info': CombineInfo,
      'loading': Loading,
    },
  }
</script>

<style lang="stylus" scoped>
  @import '../assets/style/mixin.styl'
  .search-page
    min-height 100%
    width 970px
    margin 0 auto
    background-color #eee
    padding 10px 20px 20px
    box-sizing border-box
    .hot-topic-image
      margin-top 10px;
      height 220px
      position relative
      width 100%
      border 1px solid #ccc
      img-center('vertical')
    > * + *
      margin-top 20px
</style>
