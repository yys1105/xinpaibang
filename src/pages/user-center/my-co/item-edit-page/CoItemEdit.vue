<template>
  <div class="item-page" v-if="complete">
    <p class="co-label">
      <template v-if="coInfo.cid">
        <router-link :to="{ name: 'companyIndex', params: { id: coInfo.cid } }" target="_blank">
          {{ coInfo.name }}
        </router-link>
      </template>
    </p>
    <section class="clearfix">
      <img-box-edit
        :imgList="itemPreviewImgList"
        @updateList="handleListUpdate"
        @setImg="handleSetFirstPic"></img-box-edit>
      <div class="buy-box">
        <div class="item-title">
          <input v-model="itemName" type="text" title="产品名称" placeholder="输入产品名称" class="item-title-input">
        </div>
        <div class="item-operate">
          <div class="item-price clearfix">
            <span class="label">价格：</span>
            <input v-model="itemPrice"  min="0" title="价格" placeholder="输入产品价格" style="line-height: normal">
            <span class="label">元 <span style="font-size:12px;">（输入0则表示为面议）</span></span>
          </div>
          <div class="item-num-select clearfix">
            <span class="label">数量： </span>
            <input v-model="itemNum" min="0" title="数量" placeholder="输入最大产品数量">
            <span class="label">件</span>
          </div>
        </div>
      </div>
    </section>
    <section class="clearfix">
      <ul class="tabs clearfix">
        <li class="current">产品介绍</li>
      </ul>
      <product-intro
        :images="productInfoImgList"
        @listChange="handleProductIntroImgsChange"
        @deleteImg="removeImg"></product-intro>
      <rich-text :content="richTextContent" @editorChange="handleEditorChange"></rich-text>

      <div class="btns">
        <i-button type="ghost" @click="previewItem">预览</i-button>
        <i-button type="ghost" @click="saveItem">保存</i-button>
      </div>
    </section>
  </div>
</template>

<script>
  import NumberSelect from "../../../../components/common/number-select/NumberSelect.vue"
  import IButton from 'iview/src/components/button/button.vue'
  import ImgBoxEdit from "./ImgBoxEdit.vue"
  import ProductIntro from "./ProductIntro.vue"
  import RichText from '../../../../components/common/RichText.vue'
  import { showAlert, showConfirm } from '../../../../config/functions'


  export default {
    name: 'coItemEdit',

    components: {
      ProductIntro,
      ImgBoxEdit,
      NumberSelect,
      IButton,
      RichText
    },

    data () {
      return {
        complete: false,
        coInfo: {},
        itemName: 0,
        itemNum: 0,
        itemPrice: '',
        itemPreviewImgList: [],
        productInfoImgList: [],
        richTextContent: '',
        result: '',
        firstPicIndex: 0,
      }
    },


    computed: {
      // 公司id
      cid() {
        return this.$route.params.id
      },

      // 产品id
      itemId() {
        return this.$route.params.itemId
      },

      itemParam() {
        return {
          itemInfo: {
            name: this.itemName,
            num: this.itemNum,
            price: this.itemPrice
          },
          itemPreviewImgList: this.itemPreviewImgList,
          productInfoImgList: this.productInfoImgList,
          richTextContent: this.result
        }
      }
    },

    watch: {
      'itemParam': {
        deep: true,
        handler: function (val) {
          window.sessionStorage.setItem('itemParam', JSON.stringify(this.itemParam))
        }
      },
      itemNum(val) {
        let temp = +(val + '');
        (isNaN(temp) || (temp < 0)) && (this.itemNum = 0);
      },
      itemPrice(val) {
        let temp = +(val + '');
        (isNaN(+temp) || (+temp < 0)) && (this.itemPrice = 0);
      },
      itemName(val) {
        let temp = val;
        if (temp.length > 50) {
          showAlert('产品名称最多50个字！');
          temp = temp.substr(0, 50)
        }
        this.itemName = temp
      }
    },

    methods: {

      handleProductIntroImgsChange(list) {
        this.productInfoImgList = list
      },

      // 预览操作
      previewItem() {
        let name = this.itemName
          , num = this.itemNum
          , price = this.itemNum
          , itemPreviewImgList = this.itemPreviewImgList
          , productInfoImgList = this.productInfoImgList
          , content = this.result
          , url = '';

        if (!name)
          return showAlert('产品名称是必填的！');
        if (!num)
          return showAlert('产品数量是必填的！');
        if (!price)
          return showAlert('产品价格是必填的！');
        if (!itemPreviewImgList.length)
          return showAlert('请插入产品的预览图片！');
        if (!productInfoImgList.length && !content && !showConfirm('没有产品介绍是否预览？'))
          return;
        url = window.location.origin + `#/user-center/my-company/${this.cid}/item-preview/${this.itemId}`;
        return window.open(url, '_blank')
      },

      // 富文本编辑器变更
      handleEditorChange(content) {
        this.result = content
      },

      // 左上图片跟新
      handleListUpdate(list) {
        this.itemPreviewImgList = list
      },

      // 获取公司信息
      getCoInfo() {
        this.$httpGet('home/company/getCompanyInform.do', {
          cid: this.cid
        })
          .then(data => this.coInfo = {...data.data})
          .catch(err => console.log(err))
      },

//      // 处理输入
//      handleInput(val) {
//        console.log(val)
//      },

      getItemDetail() {
        this.$httpGet('home/public/getProductDetail.do', {
          id: this.itemId
        }).then(data => {
          let item = data.data;
          this.itemName = item.name;
          this.itemNum = item.num;
          this.itemPrice = item.price;
          this.itemPreviewImgList = item.displayPictures.split(',');
          this.productInfoImgList = item.detailImage.split(',');
          this.richTextContent = item.introduce
          this.result = item.introduce

        })
      },

      // 设置首图
      handleSetFirstPic(index) {
        this.firstPicIndex = index;
        showAlert('设置成功')
      },

      saveItem() {
        if (!showConfirm('是否提交当前修改?'))
          return;
        this.$httpPost('home/user/editProduct.do', {
          id: this.itemId,
          cid: this.cid,
          imageUrl: this.itemPreviewImgList[this.firstPicIndex],
          displayPictures: this.itemPreviewImgList,
          name: this.itemName,
          price: this.itemPrice,
          detailImage: this.productInfoImgList,
          introduce: this.result,
          num: this.itemNum
        }).then(data => {
          showAlert(data.data);
          this.$router.push({ name: 'myCompanyIndex', params: { id: this.cid }})
        }).catch(err => {
          if (err.message) {
            showAlert(err.message)
          }
        })
      },

      // 删除产品介绍的图片
      removeImg(index) {
        this.productInfoImgList.splice(index, 1)
      },

      updateImages(list) {
        this.productInfoImgList = list
      }
    },

    created() {
      Promise.all([this.getCoInfo(), this.getItemDetail()]).then(() => {
        this.complete = true
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../../../assets/style/variables.styl'
  @import '../../../../assets/style/mixin.styl'


  section
    margin-top 20px

  .item-page
    padding-top 20px
    .co-label
      background-color $borderDefault
      line-height 40px
      padding-left 20px

  .item-title-input
    outline none
    padding 10px
    border 1px solid #ccc
    width 100%

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
        padding 40px 0
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
  .btns
    text-align center
    border-top 1px solid $sky
    padding-top 20px
    margin-bottom 20px
</style>
