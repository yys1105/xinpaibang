<template>
  <div class="main clearfix">
    <!-- main -->
    <div class="content-view" style="padding-top: 30px">
      <div class="home-banner">
        <Carousel
          :autoplay="true"
          :autoplay-speed="3000"
          arrow="never"
          style="height: 100%;overflow: hidden">
          <Carousel-item v-for="(item, index) in carouseDataList" :key="index">
            <div class="carousel-item">
              <template v-if="item.otherVal !== '-'">
                <a :href="item.otherVal" target="_blank">
                  <img src="" v-lazy="item.img" alt="">
                </a>
              </template>
              <template v-else>
                <img src="" v-lazy="item.img" alt="">
              </template>
              <p class="carousel-info" v-text="item.info"></p>
            </div>
          </Carousel-item>
        </Carousel>
      </div>
      <div class="main-data-list">
        <div class="main-data-title">
          <span
            v-for="(item, index) in tabOfList"
            :key="index"
            :class="{'main-data-title-item': true, 'active': activeItemIndex === item.index }"
            @click="tabClick(item)">{{ item.name }}</span>
        </div>
        <info-list
          :list="mainList"
          :loading="mainListLoading"
          :listCompleted="mainListComplete"
          @requireMore="getMainDataList"
          ref="chosenList"></info-list>
      </div>
    </div>
    <!-- 侧边 -->
    <home-aside></home-aside>
  </div>
</template>

<script>
  import HomeJs from './Home'

  export default HomeJs
</script>

<style lang="stylus" scoped>
  @import './Home.styl'
</style>
