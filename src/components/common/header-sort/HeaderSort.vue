<script>
export default {
  name: 'headerSort',
  props: {
    tabList: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      currentTab: 0,
      underLine: {
        'width': '0',
        'left': '0'
      },
    }
  },
  watch: {
    currentTab(val, oldVal) {
      setTimeout(() => {
        let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        let $currTab = $('.search-tabs .tab.current')
        requestAnimationFrame(() => {
          this.underLine = {
            'width': $currTab.width() + 'px',
            'left': $currTab.offset().left - $('.search-tabs').offset().left - 1 + 'px'
          }
        })
      }, 10)
    }
  },

  mounted() {
    let $currTab = $('.search-tabs .tab.current')
    this.$set(this.underLine, 'width', $currTab.width() + 'px')
    this.$set(this.underLine, 'left', $currTab.offset().left - $('.search-tabs').offset().left - 1 + 'px')
  },

  methods: {
    handleTabClick(tabItem) {
      if (tabItem.index !== this.currentTab) {
        this.currentTab = tabItem.index
        this.$emit('tabChanged', this.currentTab)
      }
    }
  }
}
</script>

<template>
  <div class="search-tabs">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      :class="{'tab': true, 'current': item.index === currentTab }"
      v-text="item.label"
      @click="handleTabClick(item)"></div>
    <div class="under-line" :style="underLine"></div>
  </div>
</template>

<style lang="stylus" scoped>
  .search-tabs
    padding 0 20px
    position relative
    border 1px solid transparent
    .tab
      display inline-block
      margin-right 30px
      line-height 55px
      cursor pointer
      user-select none
    .under-line
      position absolute
      bottom 0
      z-index 10
      border-bottom 2px solid #06c
      transition all 300ms
</style>

