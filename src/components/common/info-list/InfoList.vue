<template>
  <div class="main-data-list">
    <div class="main-data-container">
      <info-item
        v-for="item in list"
        :item="item"
        :key="item.id"
        :hasExtraBar="hasExtraBar"
        @needUpdate="needUpdate"></info-item>
    </div>
    <gear v-if="loading" />
    <p align="center" class="load-more" @click="requireMore" v-if="list.length !== 0 && !loading && !listCompleted">加载更多</p>
    <p align="center" class="load-more" v-if="listCompleted">{{ list.length === 0 ? '暂无信息' : '到底了，没有更多了' }}</p>
  </div>
</template>

<script>
import InfoItem from './InfoItem.vue'
import Gear from '../loading/Gear.vue'

export default {
  name: '',

  components: {
    InfoItem,
    Gear
  },

  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    listCompleted: {
      type: Boolean,
      default: false
    },
    hasExtraBar: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      infoListCurr: 1
    }
  },

  methods: {
    requireMore() {
      this.$emit('requireMore')
    },

    needUpdate() {
      this.$emit('needUpdate')
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/style/variables.styl'

  .main-data-list
    margin 20px 0
    .load-more
      height 80px
      line-height 80px
      color $sky
      user-select none
      cursor pointer

</style>
