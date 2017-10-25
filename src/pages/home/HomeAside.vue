<script>
  import LinkLabel from '../../components/common/LinkLabel.vue';
  import {showAlert} from "../../config/functions/index";
  import Gear from "../../components/common/loading/Gear.vue";

  export default {
    name: 'HomeAside',

    data () {
      return {
        popularDataList: [],
        popularLabelList: [],
        mainQuestions: [],
        coList: [],
        loading: false
      }
    },

    methods: {
      initData() {
        this.loading = true;
        Promise.all([
          this.$httpGet('home/home/getHotTopFiveInform.do', {}).then(data => data.data),
          this.$httpGet('home/home/getHotTopLabel.do', {}).then(data => data.data),
          this.$httpGet('home/home/getFiveProblemList.do', {}).then(data => data.data),
          this.$httpGet('home/company/getRecommendCompanyList.do', {}).then(data => data.data),
        ]).then(dataList => {
          [this.popularDataList, this.popularLabelList, this.mainQuestions, this.coList] = dataList;
          this.loading = false;
        }).catch(err => {
          console.log('home aside', err);
          // showAlert('数据异常！');
        })
      },
    },

    created() {
      this.initData()
    },

    components: {
      Gear,
      LinkLabel,
    }
  }
</script>

<template>
  <div class="right-side" style="padding-top: 30px">
    <template v-if="!loading">
      <!-- 合作企业 -->
      <div class="side-list" v-if="coList.length !== 0">
        <p class="side-list-title">合作企业</p>
        <div class="co-img-list">
          <router-link
            v-for="(item, index) in coList"
            :key="index"
            :to="{ name: 'companyIndex', params: { id: item.cid } }"
            class="co-list-item"
            target="_blank">
            <img :src="item.recommendImage" alt="" title="item.name">
            <p class="co-name">{{ item.name }}</p>
          </router-link>
        </div>
      </div>
      <!-- 热门内容 -->
      <div class="side-list" v-if="popularDataList.length !== 0">
        <p class="side-list-title">热门内容</p>
        <div class="side-item " v-for="(item, index) in popularDataList" :key="index">
          <router-link
            :to="{ name: item.informType, params: { id: item.id } }"
            class="side-item-title question-item"
            target="_blank">
            {{ item.title }}
          </router-link>
          <p class="side-item-content" v-text="item.describe"></p>
        </div>
      </div>
      <!-- 集思广益 -->
      <div class="side-list" v-if="mainQuestions.length !== 0">
        <p class="side-list-title">集思广益</p>
        <router-link
          v-for="item in mainQuestions"
          :to="{ name: 'question', params: { id: item.id } }"
          tag="div"
          class="side-item"
          :key="item.id">
          <a class="question-item">{{ item.title }}</a>
        </router-link>
        <!--<p class="text-right"><a>更多&gt;</a></p>-->
      </div>
      <!-- 热门标签 -->
      <div class="side-list" v-if="popularLabelList.length !== 0">
        <p class="side-list-title">热门标签</p>
        <div class="label-container">
          <link-label v-for="(label, index) in popularLabelList" :label="label.name" :key="index" style="line-height: 30px;"></link-label>
        </div>
      </div>
    </template>
    <template v-else>
      <gear></gear>
    </template>
  </div>
</template>

<style scoped lang="stylus">
  @import "../../assets/style/variables.styl"
  @import "../../assets/style/mixin.styl"

  .side-list
    + .side-list
      margin-top 16px
    .side-list-title
      display block
      text-align center
      padding-bottom 10px
      font-size 22px
      border-bottom 1px solid #0066CC
      text-decoration none
    .side-item
      padding 10px 0
      .side-item-title
        width 100%
        font-size 14px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .side-item-content
        font-size 12px
        line-height 20px
        color #999
      + .side-item
        border-top 1px dashed #ccc
    .label-container
      padding 20px 10px
    .question-item
      display inline-block
      width 100%
      cursor pointer
      user-select none
      translate color .2s ease
      color #333
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      text-decoration none
      &:hover
        color #57a3f3
    .co-img-list .co-list-item
      display inline-block
      width 100%
      height 120px;
      img-center('all')
      margin-top 10px
      position relative
      img
        min-width 100%
        height 120px;
      .co-name
        position absolute
        display inline-block
        bottom 0
        width 100%
        height 120px;
        line-height 120px;
        text-align center
        font-size 14px
        background rgba(0, 0, 0, 0)
        color rgba(255, 255, 255, 0)
        transition all 200ms
      &:hover
        .co-name
          color rgba(255, 255, 255, 1)
          background-color rgba(0, 0, 0, 0.7)





</style>
