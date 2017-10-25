<template>
  <div class="img-box-edit item-img-show">
    <swiper :options="swiperOptionTop" ref="swiperTop" style="height:342px">
      <swiper-slide v-for="(img, index) in list" :key="index" class="item-big-img">
        <img src="" v-lazy="img" alt="">
      </swiper-slide>
      <!-- <div class="swiper-button-next swiper-button-white" slot="button-next"></div> -->
      <!-- <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div> -->
    </swiper>
    <!-- swiper2 Thumbs -->
    <swiper :options="swiperOptionThumbs" class="gallery-thumbs item-img-list" ref="swiperThumbs">
      <swiper-slide v-for="(img, index) in list" :key="index" class="img-wrap">
        <img src="" v-lazy="img" alt="">
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { showAlert, showConfirm } from '../../../../config/functions'

export default {
  name: 'imgBoxEdit',

  props: {
    imgList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      swiperOptionTop: {
        notNextTick: true,
        // nextButton: '.swiper-button-next',
        // prevButton: '.swiper-button-prev',
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        spaceBetween: 10
      },
      swiperOptionThumbs: {
        notNextTick: true,
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
      },
    }
  },

  computed: {
    list() {
      return this.imgList
    },

    swiper() {
      return this.$refs.mySwiper.swiper
    },
  },

  mounted() {
    const swiperTop = this.$refs.swiperTop.swiper
    const swiperThumbs = this.$refs.swiperThumbs.swiper
    swiperTop.params.control = swiperThumbs
    swiperThumbs.params.control = swiperTop
  }
}
</script>

<style lang="stylus" scoped>

@import '../../../../assets/style/variables.styl'
@import '../../../../assets/style/mixin.styl'

  .img-box-edit
    display inline-block
    position relative

  .item-img-show
    border 1px solid $borderDefault
    padding 12px
    width 580px
    height 450px
    float left
    overflow hidden
    .item-big-img
      width 554px
      height 330px
      margin-bottom 12px
      img-center()
    .item-img-list
      width 554px
      height 82px

</style>

<style>
  .swiper-button-disabled {
    opacity: 0.2 !important;
  }
</style>

<style scoped lang="stylus">
  .swiper-button-white
    background-color #cdcdcd !important
    padding 20px
    height 60px
    opacity 0.8

  .swiper-slide {
    background-size: cover;
    background-position: center;
  }
  .gallery-top {
    /* height: 300px !important; */
    width: 100%;
  }
  .gallery-thumbs {
    /* height: 50px !important; */
    box-sizing: border-box;
    /* padding: 10px 0; */
  }
  .gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
</style>
