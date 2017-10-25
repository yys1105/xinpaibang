<template>
  <div class="card-style clearfix" v-if="item.cid">
    <router-link :to="jumpLink" target="_blank" class="img-box">
      <img src="" v-lazy="item.logo" alt="co-logo">
    </router-link>
    <div class="content-box">
      <router-link :to="jumpLink" target="_blank"  class="title">{{ item.name }}</router-link>
      <p class="line">
        <span class="label">工商注册号：</span>
        <span class="value">{{ item.registrationNumber }}</span>
      </p>
      <p class="line">
        <span class="label">法人代表：</span>
        <span class="value">{{ item.legalRepresentative }}</span>
      </p>
      <div class="line clearfix">
        <span class="label" style="float: left">会员认证标签 / 平台荣誉：</span>
        <span class="value clearfix">
          <img :src="item.memberTag" style="float: left">
          <img :src="item.reputation" style="float: left; margin-left: 10px;">
        </span>
      </div>
    </div>
    <div class="handle-box" v-if="hasButton && !hasExtraButtons">
      <i-button type="ghost" @click="handleClaim(item)">认领</i-button>
    </div>
    <div class="handle-box" v-if="hasExtraButtons">
      <i-button type="ghost" @click="handleClaim(item)">重新认领</i-button>
      <i-button type="ghost" @click="handleDelete(item)">删除</i-button>
    </div>
  </div>
</template>

<script>
  import IButton from 'iview/src/components/button/button.vue'
  import { showAlert } from '../../config/functions'

  export default {
    name: 'coListCard',

    props: {
      item: {
        type: Object
      },
      hasButton: {
        type: Boolean,
        default: true
      },
      hasExtraButtons: {
        type: Boolean,
        default: false
      },
      isMyCompany: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      jumpLink() {
        return this.isMyCompany ? { name: 'myCompanyIndex', params: { id: this.item.cid } } : { name: 'companyIndex', params: { id: this.item.cid } }
      }
    },

    methods: {
      /**
       * 认领企业
       * @param item
       */
      handleClaim(item) {
        this.$router.push({ name: 'claim', params:{ id: item.cid} })
      },

      /**
       *  删除企业
       */
      handleDelete(item) {
        this.$httpPost('home/user/deleteClaim.do', {
          id: item.id
        }).then(({ data }) => {
          showAlert(data)
          this.$emit('update')
        })
      }
    },

    components: {
      IButton
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../assets/style/mixin.styl'

  .card-style
    padding 15px
    height 190px
    position relative

  .img-box
    width 200px
    height 150px
    display inline-block
    img-center('all')
    position absolute
    left 15px
    img
      max-width 200px
      max-height 150px
  .content-box
    float left
    margin-left 210px

  .title
    margin-bottom 20px
    font-size 24px
    color #333
    display inline-block
    cursor pointer
    user-select none

  .line
    line-height 30px
    vertical-align -webkit-baseline-middle
    vertical-align middle

  .label
    color #AFAFAF

  .value
    color #3E7FD4
    display inline-block
    img
      height 16px
      margin-top 7px

  .handle-box
    position absolute
    right 20px
    bottom 20px

</style>
