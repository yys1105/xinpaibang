<template>
  <div class="item-page">
    <p class="co-label">
      <router-link :to="{ name: 'companyIndex', params: { id: coInfo.cid } }" target="_blank">
        {{ coInfo.name }}
      </router-link>
    </p>
    <section class="clearfix">
      <img-box :imgList="imgList"></img-box>
      <div class="buy-box">
        <div class="item-title">
          <p>{{ itemName }}</p>
        </div>
        <div class="item-operate">
          <div class="item-price">
            <span class="label">价格：</span>
            <span class="price" v-if="itemPrice !== 0">￥{{ itemPrice }}</span>
            <span class="price" v-else>面议</span>
          </div>
          <div class="item-num-select clearfix">
            <span class="label" style="float: left">数量：</span>
            <number-select v-model="num" style="float: left" @input="handleInput"></number-select>
            <span class="label" style="float: left; margin-left: 20px">(最多{{ itemNum }}件)</span>
          </div>
          <div class="buy-button">
            <i-button type="ghost">立即购买</i-button>
          </div>
        </div>
      </div>
    </section>
    <section class="clearfix">
      <ul class="tabs clearfix">
        <li class="current">产品介绍</li>
        <li @click="goAnchor('#anchor-'+'evaluate')">累计评价</li>
      </ul>
      <div class="item-intro">
        <div class="ql-snow">
          <div class="ql-editor" v-html="itemIntroText"></div>
        </div>
        <div class="info-img-area">
          <img v-for="(img, index) in itemIntroImgs" :src="img" :key="index" alt="">
        </div>
      </div>
      <div class="site-info">
        <h5 align="center">平台声明</h5>
        <p>本网站所提供的信息，只供参考使用。</p>
        <p>本网站及其雇员一概毋须以任何方式就任何信息传递或传送的失误、不准确或错误对用户或任何其他人负任何直接或间接的责任。</p>
        <p>在法律允许的范围内，本网站在此申明，不承担用户或任何人士就使用或未能使用本网站所提供的信息或任何链接或项目所引致的任何直接、间接、附带</p>
        <p>、从属、特殊、惩罚性或惩戒性的损害赔偿（包括但不限于收益、预期利润的损失或失去的业务、未实现预期的节省）。</p>
      </div>
    </section>

    <div style="text-align: center; margin: 20px">
      <i-button type="ghost" @click="closeThisPage">关闭预览</i-button>
    </div>

  </div>
</template>

<script>
  import NumberSelect from "../../../../components/common/number-select/NumberSelect.vue";
  import IButton from 'iview/src/components/button';
  import ImgBox from './ImgBox.vue'
  import { showAlert } from '../../../../config/functions'


  export default {
    name: 'coItemPage',

    data() {
      return {
        coInfo: {},
        currentImgIndex: 0,
        imgList: [],
        num: 1,

        itemName: '',
        itemNum: 0,
        itemPrice: '--',

        itemIntroText: '',
        itemIntroImgs: [],

        evaluateNum: 0,

        bigImgLoading: false,
        showFront: false,
        showBehind: false,
        operateBarShow: false,
      }
    },

    computed: {
      cid() {
        return this.$route.params.id
      },

      itemId() {
        return this.$route.params.itemId
      },

      itemParam() {
        return this.$route.params.itemParam
      }
    },

    methods: {
      // 关闭预览
      closeThisPage() {
        window.close()
      },

      // 点击小图片切换大图片
      handleClickSmallImg(val) {
        this.currentImgIndex = val
      },

      // 获取公司信息
      getCoInfo() {
        this.$httpGet('home/company/getCompanyInform.do', {
          cid: this.cid
        }).then(data => {
          this.coInfo = {...data.data}
        })
      },

      // 数量选择
      handleInput(val) {
//        console.log(val)
      },

      // 初始化预览数据
      getItemParams() {
        let itemParam = JSON.parse(window.sessionStorage.getItem('itemParam'))

        this.itemName = itemParam.itemInfo.name
        this.itemNum = itemParam.itemInfo.num
        this.itemPrice = itemParam.itemInfo.price

        this.imgList = itemParam.itemPreviewImgList
        this.itemIntroText = itemParam.richTextContent
        this.itemIntroImgs = itemParam.productInfoImgList
      },
    },

    created() {
      this.getItemParams()
    },
    mounted() {
      this.getCoInfo()
    },

    components: {
      NumberSelect,
      IButton,
      ImgBox
    },
  }
</script>


<style scoped lang="stylus">

  @import '../../../../assets/style/variables.styl'
  @import '../../../../assets/style/mixin.styl'

  colorGray = #eee

  section
    margin-top 20px

  .item-page
    padding-top 20px
    margin-bottom 20px
    .co-label
      background-color colorGray
      line-height 40px
      padding-left 20px


  .buy-box
    float left
    width 600px
    margin-left 40px
    .item-title
      font-size 20px
      height 68px
    .item-operate
      border 1px solid #A3C8ED
      background-color #F9FCFF
      width 600px
      height 382px
      padding 20px 40px
      .label
        color #999
        line-height 25px
        font-size 14px
      .item-price
        height 128px
        line-height 128px
        border-bottom 2px dashed #428EDA
        .price
          font-size 28px
          color #f30
      .item-num-select,
      .buy-button,
      .co-meta
        margin-top 40px


  .tabs
    border-bottom 1px solid $sky
    li
      display inline-block
      float left
      width 108px
      height 40px
      line-height 40px
      text-align center
      user-select none
      cursor pointer
      &.current
        background-color $sky
        color #fff

  .site-info
    text-align center
    padding 20px 0
    border-bottom 1px solid $sky
    h5,
    p
      line-height 50px

</style>
