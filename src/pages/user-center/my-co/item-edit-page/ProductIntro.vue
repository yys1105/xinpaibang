<script>
  import {showAlert, handleImgUpdate} from '../../../../config/functions'

  // 单个 img 组件
  let imgCol = {
    template: `
    <div class="img-col">
      <div class="img-box">
        <img :src="img.imgSrc" alt="图片">
        <span class="close" @click="deleteImg" title="删除">
          <i class="iconfont icon-guanbi"></i>
        </span>
        <div class="img-operate-item clearfix">
          <div @click="$emit('moveForward', img.index)" title="将图片前移">前移</div>
          <div @click="$emit('moveBackward', img.index)" title="将图片后移">后移</div>
        </div>
      </div>
    </div>`,
    props: {
      img: {
        type: Object,
      }
    },
    data() {
      return {
        imgPlaceHolder: ''
      }
    },
    methods: {
      deleteImg() {
        this.$emit('removeImg', this.img.index)
      }
    }
  };

  export default {
    name: 'productIntro',

    props: {
      images: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      imgList() {
        return [...this.images]
      }
    },

    methods: {
      handleInputChange(e) {
        let tempList = [...e.target.files];
        if ((this.imgList.length + tempList.length) > 5)
          return showAlert('最多上传五张图片');
        handleImgUpdate(tempList)
          .then(data => {
            this.$emit('listChange', [...this.imgList, ...data]);
            e.target.value = '';
            showAlert('上传成功！')
          })
          .catch(err => {
            console.log('图片错误！');
            e.target.value = ''
          })
      },

      removeImg(index) {
        this.$emit('deleteImg', index)
      },

      handleMoveForward(index) {
        if (index === 0) return showAlert("已经是第一张");
        let list = [...this.images];
        [list[index-1], list[index]] = [list[index], list[index-1]];
        this.$emit('listChange', list);
      },

      handleMoveBackward(index) {
        if (index === (this.imgList.length - 1)) return showAlert("已经是最后一张");
        let list = [...this.images];
        [list[index], list[index+1]] = [list[index+1], list[index]];
        this.$emit('listChange', list);
      },
    },

    components: {
      imgCol
    }
  }
</script>

<template>
  <div class="item-intro">
    <div class="img-container">
      <div class="img-row clearfix">
        <img-col
          v-for="(imgSrc, index) in imgList"
          :key="index"
          :img="{imgSrc, index}"
          @moveForward="handleMoveForward"
          @moveBackward="handleMoveBackward"
          @removeImg="removeImg"></img-col>
        <div class="img-col">
          <label class="img-placeholder">
            <input hidden type="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png" @change="handleInputChange">
            <img src="/static/images/img_placeholder.jpg" alt="">
            <div class="cover">
              <span class="text">点击上传图片</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- style for component imgCol -->
<style lang="stylus">
  @import '../../../../assets/style/mixin.styl';

  .item-intro
    margin-top 20px
    .img-container
      width 1220px
      position relative
      .img-row
        width 1270px
        position relative
        left -25px
        .img-col
          display inline-block
          width 33.333%
          height 245px
          float left
          padding 0 25px
          margin-bottom 20px
          .img-box
            display block
            border 1px solid #ccc
            overflow hidden
            height 245px
            position relative
            z-index 1
            img-center('all')
            img
              max-height 245px
              max-width 100%
            span
              position absolute
              right 5px
              top 2px
              z-index 2
              cursor pointer
            .img-operate-item
              position absolute
              bottom 0
              width 100%
              height 20px
              line-height 20px
              z-index 2
              text-align center
              background-color rgba(255, 255, 255, 0.9)
              border-top 1px solid #ccc
              div
                cursor pointer
                user-select none
                width 100px
                display inline-block

</style>
<style scoped lang="stylus">
  @import '../../../../assets/style/mixin.styl'

  .cover,
  .text
    cursor pointer
    user-select none

  .img-placeholder
    display block
    border 1px solid #ccc
    overflow hidden
    height 245px
    img-center('horizon')

</style>
