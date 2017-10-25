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
          <p>{{ itemInfo.name }}</p>
        </div>
        <div class="item-operate">
          <div class="item-price">
            <span class="label">价格：</span>
            <span class="price" v-if="itemInfo.price !== 0">￥{{itemInfo.price}}</span>
            <span class="price" v-else>面议</span>
          </div>
          <div class="item-num-select clearfix">
            <span class="label" style="float: left">数量：</span>
            <number-select v-model="num" :max="itemInfo.num" style="float: left" @input="handleInput"></number-select>
            <span class="label" style="float: left; margin-left: 20px">(最多{{itemInfo.num}}件)</span>
          </div>
          <div class="buy-button">
            <i-button type="ghost" @click="$store.dispatch('toggleSendMsgBoxShow', {show: true, item: itemInfo})">立即购买</i-button>
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
          <img v-for="(img, index) in itemIntroImgs" src="" v-lazy="img" :key="index" alt="">
        </div>
      </div>
      <div class="site-info">
        <h5 align="center">平台声明</h5>
        <p>本网站所提供的信息，只供参考使用。</p>
        <p>本网站及其雇员一概毋须以任何方式就任何信息传递或传送的失误、不准确或错误对用户或任何其他人负任何直接或间接的责任。</p>
        <p>在法律允许的范围内，本网站在此申明，不承担用户或任何人士就使用或未能使用本网站所提供的信息或任何链接或项目所引致的任何直接、间接、附带</p>
        <p>、从属、特殊、惩罚性或惩戒性的损害赔偿（包括但不限于收益、预期利润的损失或失去的业务、未实现预期的节省）。</p>
      </div>

      <co-item-evaluate :item-id="itemId"></co-item-evaluate>

    </section>
  </div>
</template>

<script>
  import NumberSelect from "../../../components/common/number-select/NumberSelect.vue";
  import ImgBox from '../../user-center/my-co/item-edit-page/ImgBox.vue'
  import IButton from 'iview/src/components/button';
  import CoItemEvaluate from "./CoItemEvaluate.vue";

  export default {
    name: 'coItemPage',

    data() {
      return {
        coInfo: {},
        currentImgIndex: 0,
        imgList: [],
        itemInfo: {},
        num: 0,

        itemIntroText: '',
        itemIntroImgs: '',

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
      }
    },

    methods: {
      goAnchor(selector) {
        let $anchor = $(selector);
        $(window).scrollTop($anchor.offset().top);
      },

      getCoInfo() {
        this.$httpGet('home/company/getCompanyInform.do', {
          cid: this.cid
        }).then(data => {
          this.coInfo = {...data.data}
        })
      },

      handleInput(val) {
        console.log(val)
      },

      getItemDetail() {
        this.$httpGet('home/public/getProductDetail.do', {
          id: this.itemId
        }).then(data => {
          this.itemInfo = data.data;
          this.imgList = data.data.displayPictures.split(',');
          this.itemIntroImgs = data.data.detailImage.split(',');
          this.itemIntroText = data.data.introduce;
          console.log(this.itemInfo);
        })
      },

    },

    created() {
      this.getItemDetail()
    },

    mounted() {
      this.getCoInfo();
    },

    components: {
      CoItemEvaluate,
      NumberSelect,
      IButton,
      ImgBox
    },
  }
</script>

<style scoped lang="stylus">
  @import "./ItemPage.styl"
</style>
