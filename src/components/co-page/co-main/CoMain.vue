<template>
  <div class="co-main clearfix">
    <div class="company-banner">
      <template v-if="coBannerLinkItem === '{}'">
        <img src="" v-lazy="coBanner" alt="company-banner">
        <!--<div class="cover" v-if="noBannerPlaceHolder !== ''">-->
          <!--<span class="text">{{ noBannerPlaceHolder }}</span>-->
        <!--</div>-->
      </template>
      <template v-if="coBannerLinkItem !== '{}'">
        <template v-if="coBannerLinkItem.type === 'company'">
          <router-link :to="{ name: 'companyIndex', params: { id: coBannerLinkItem.id } }" target="_blank">
            <img src="" v-lazy="coBanner" alt="company-banner">
            <!--<div class="cover" v-if="noBannerPlaceHolder !== ''">-->
              <!--<span class="text">{{ noBannerPlaceHolder }}</span>-->
            <!--</div>-->
          </router-link>
        </template>
        <template v-if="coBannerLinkItem.type === 'product'">
          <router-link :to="{ name: 'companyItemShop', params: { id: coBannerLinkItem.cid || '', itemId: coBannerLinkItem.id } }" target="_blank">
            <img src="" v-lazy="coBanner" alt="company-banner">
            <!--<div class="cover" v-if="noBannerPlaceHolder !== ''">-->
              <!--<span class="text">{{ noBannerPlaceHolder }}</span>-->
            <!--</div>-->
          </router-link>
        </template>
      </template>
    </div>

    <div class="content-view">
      <div class="product-list">
        <div class="clearfix">
          <co-item v-for="(item, index) in coItemList" class="co-item" :key="index" :item="item"></co-item>
        </div>
        <p v-if="coItemList.length" align="right" class="more-product"><a @click="$emit('changeTab', 3)">更多产品》</a></p>
      </div>
      <info-list
        v-if="dataList.length !== 0"
        :list="dataList"
        :loading="listLoading"
        :listCompleted="listComplete"
        @requireMore="getArticleList"></info-list>
      <gear v-if="listLoading"></gear>
    </div>

    <div class="co-info">
      <div class="info-item" v-for="item in coInfoList">
        <div class="info-label">{{ item.label }}</div>
        <div class="info-value">{{ info[item.value] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import CoMainJs from './CoMain'

  export default CoMainJs
</script>

<style scoped lang="stylus">
  @import './CoMain.styl'
</style>
