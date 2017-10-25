<template>
  <div class="company-page">
    <header class="company-page-header">
      <Row>
        <i-col span="4" class="text-left co-banner">
          <img src="" v-lazy="coInfo.logo">
        </i-col>
        <i-col span="16" class="text-center">
          <h1 class="co-name">{{ coInfo.name }}
            <img :src="coInfo.reputation">
            <img :src="coInfo.memberTag">
          </h1>
        </i-col>
        <i-col span="4" class="text-right co-right">
          <template v-if="rightImgLink === '{}'">
            <img src="" v-lazy="rightImg">
            <!--<div class="cover" v-if="noRightImgPlaceholder !== ''">-->
              <!--<span class="text">{{ noRightImgPlaceholder }}</span>-->
            <!--</div>-->
          </template>

          <template v-if="rightImgLink !== '{}'">
            <template v-if="rightImgLink.type === 'company'">
              <router-link :to="{ name: 'companyIndex', params: { id: rightImgLink.id } }" target="_blank">
                <img src="" v-lazy="rightImg">
                <!--<div class="cover" v-if="noRightImgPlaceholder !== ''">-->
                  <!--<span class="text">{{ noRightImgPlaceholder }}</span>-->
                <!--</div>-->
              </router-link>
            </template>
            <template v-if="rightImgLink.type === 'product'">
              <router-link :to="{ name: 'companyItemShop', params: { id: rightImgLink.cid || '', itemId: rightImgLink.id } }" target="_blank">
                <img src="" v-lazy="rightImg">
                <!--<div class="cover" v-if="noRightImgPlaceholder !== ''">-->
                  <!--<span class="text">{{ noRightImgPlaceholder }}</span>-->
                <!--</div>-->
              </router-link>
            </template>
          </template>
        </i-col>
      </Row>
    </header>

    <div class="tab-list">
      <div
        v-for="(item, index) in tabList"
        class="tab"
        :class="{'active': currentTab === item.index}"
        v-text="item.label"
        @click="currentTab = item.index"></div>
    </div>
    <div class="tab-content">
      <!--<keep-alive>-->
        <co-main v-if="currentTab === 0" :info="coInfo" @changeTab="changeTab"></co-main>
        <co-case v-else-if="currentTab === 1"></co-case>
        <co-docs v-else-if="currentTab === 2" :info="coInfo"></co-docs>
        <co-product-list v-else-if="currentTab === 3"></co-product-list>
        <co-info v-else-if="currentTab === 4" :info="coInfo"></co-info>
        <co-contract-us v-else-if="currentTab === 5" :info="coInfo"></co-contract-us>
      <!--</keep-alive>-->
    </div>
  </div>
</template>

<script>
  import CoComponents from '../../components/co-page'

  export default {
    name: 'coPage',

    data () {
      return {
        tabList: [
          { label: '首页', index: 0 },
          { label: '产品', index: 3 },
          { label: '案例', index: 1 },
          { label: '公司档案', index: 2 },
          { label: '关于我们', index: 4 },
          { label: '联系我们', index: 5 }
        ],
        coInfo: {},
        currentTab: 0,
        noRightImgPlaceholder: '',
        rightImg: '',
        rightImgLink: "{}"
      }
    },

    computed: {
      cid() { return this.$route.params.id }
    },

    methods: {
      // 更换 tab
      changeTab(index) {
        this.currentTab = index
      },

      getCoInfo() {
        return this.$httpGet('home/company/getCompanyInform.do', {
          cid: this.cid
        }).then(data => {
          this.coInfo = data.data
        })
      },

      getRightImg() {
        this.noRightImgPlaceholder = '加载中'
        return this.$httpGet('home/company/getCompanyHomeTopRight.do', {
          cid: this.cid
        }).then(data => {
          this.rightImg = data.data.val
          if (data.data.otherVal !== '-')
            this.rightImgLink = JSON.parse(data.data.otherVal)
          this.noRightImgPlaceholder = ''
        }).catch(err => {
          if (err.message) {
            this.rightImg = ''
            this.noRightImgPlaceholder = err.message
          } else {
            this.noRightImgPlaceholder = '加载图片出错!'
          }
        })
      }
    },

    mounted() {
      this.getCoInfo()
      this.getRightImg()
    },

    components: CoComponents
  }
</script>

<style scoped lang="stylus">
  @import './CoPage.styl'
</style>
