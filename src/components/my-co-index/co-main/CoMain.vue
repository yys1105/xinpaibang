<template>
  <div class="co-main clearfix">
    <div class="company-banner">
      <template v-if="coBanner"><img :src="coBanner" v-if="!hasBannerChanged"></template>
      <template v-if="tempCoBanner"><img :src="tempCoBanner" v-if="hasBannerChanged"></template>
      <div class="cover">
        <template v-if="hasBannerChanged">
          <p class="link">
            <a @click="handleBannerSave">保存</a>
            <a @click="hasBannerChanged = false">取消</a>
          </p>
        </template>
        <template v-else>
          <label class="link" v-if="!hasBannerChanged">
            <a>点击修改图片</a>
            <input type="file" hidden accept="image/jpg,image/jpeg,image/png" @change="handleImgChange">
          </label>
          <p class="cover-bottom-text">
            <a @click="showLinkListPanel('Center', coBannerLink)">更换该图片点击跳转地址</a>
          </p>
        </template>
      </div>
    </div>

    <div class="content-view">
      <div class="product-list">
        <div class="clearfix">
          <co-item
            v-for="(item, index) in coItemList"
            class="co-item"
            :key="index"
            :canMovePrev="index != 0"
            :canMoveNext="index != coItemTotal-1"
            :item="item"></co-item>
        </div>
        <div v-if="coItemList.length" align="right" class="more-product"><a @click="$emit('changeTab', 3)">更多产品》</a></div>
      </div>


      <info-list
        :list="dataList"
        :loading="listLoading"
        :listCompleted="listComplete"
        :hasExtraBar="true"
        @requireMore="requireMore"
        @needUpdate="getArticleList"></info-list>
    </div>

    <div class="co-info clearfix">
      <div class="info-item" v-for="(item, index) in coInfoList" :key="index">
        <div class="info-label">{{ item.label }}</div>
        <div class="info-value">{{ info[item.value] }}</div>
      </div>
      <button type="button" class="float-right side-modify-btn" @click="$emit('changeTab', 5)">修改</button>
    </div>

    <link-list-panel
      :current-link="linkListCurrent"
      :type="linkListType"
      v-if="linkListShowPanel"
      @close="closeLinkListPanel"
      @submitSucc="getBanner"></link-list-panel>
  </div>
</template>

<script>
  import CoMainJs from './CoMain'

  export default CoMainJs
</script>

<style scoped lang="stylus">
  @import './CoMain.styl'
</style>
