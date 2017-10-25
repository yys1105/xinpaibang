<template>
  <div class="img-box-edit item-img-show">
    <swiper :options="swiperOptionTop" ref="swiperTop" style="height:342px">
      <swiper-slide v-for="(img, index) in list" :key="index" class="item-big-img">
        <img :src="img" alt="">
      </swiper-slide>
      <!-- <div class="swiper-button-next swiper-button-white" slot="button-next"></div> -->
      <!-- <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div> -->
    </swiper>
    <!-- swiper2 Thumbs -->
    <swiper :options="swiperOptionThumbs" class="gallery-thumbs item-img-list" ref="swiperThumbs">
      <swiper-slide v-for="(img, index) in list" :key="index" class="img-wrap">
        <img :src="img" alt="">
        <div class="img-meta clearfix">
          <button class="img-meta-item" @click="deleteImg(index)" title="删除该图片"><i class="iconfont icon-shanchu"></i></button>
          <button class="img-meta-item" @click="setImg(index)" title="设置为展示"><i class="iconfont icon-shezhi"></i></button>
        </div>
      </swiper-slide>
    </swiper>
    <button class="img-wrap" style="position: absolute;left: 12px">
      <img src="/static/images/img_placeholder.jpg" alt="" style="top: 0;left: 50%">
      <label class="cover">
        <span class="text">新增图片</span>
        <input type="file" hidden  accept="image/jpeg,image/jpg,image/png" @change="addImg" multiple="multiple">
      </label>
    </button>
  </div>
</template>

<script>
import { showAlert, showConfirm, handleImgUpdate } from '../../../../config/functions'

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
        autoplay : 5000,
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

  methods: {
    setImg(index) {
      this.$emit('setImg', index)
    },
    deleteImg(index) {
      let list = [...this.list]
      list.splice(index, 1)
      this.$emit('updateList', list)
    },
    addImg(e) {
      let tempList = [...e.target.files]
      if (this.list.length + tempList.length > 5) {
        e.target.value = ''
        return showAlert('最多上传五张图片')
      }
      handleImgUpdate(tempList)
        .then(data => {
          this.$emit('updateList', [...data, ...this.list])
          showAlert('上传成功')
          e.target.value = ''
        })
        .catch(err => {
          console.log(err)
          e.target.value = ''
        })
    },
  },

  mounted() {
    console.log(this.imgList)

    const swiperTop = this.$refs.swiperTop.swiper
    const swiperThumbs = this.$refs.swiperThumbs.swiper
    swiperTop.params.control = swiperThumbs
    swiperThumbs.params.control = swiperTop
  }
}
</script>

<style>
  .swiper-button-disabled {
    opacity: 0 !important;
  }
</style>
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
      position absolute
      width 444px
      height 82px
      right 12px

  .swiper-button-white
    background-color #cdcdcd !important
    padding 20px
    height 60px
    opacity 0.8

  .swiper-slide
    background-size cover
    background-position center

  .gallery-top
    width 100%

  .gallery-thumbs
    box-sizing border-box

  .gallery-thumbs
    .swiper-slide
      width 25%
      height 100%
      opacity 0.4

  .gallery-thumbs
    .swiper-slide-active
      opacity 1

  .img-meta
    position absolute
    z-index 5
    top 0
    width 100%
    height 20px
    padding 0 5px
    background-color rgba(255,255,255,0.7)
    cursor default

    .img-meta-item
      float right
      border 0
      outline 0
      background-color transparent
      height 20px
      width 20px
      margin-left 5px
      user-select none
      cursor pointer

</style>
