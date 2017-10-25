<template>
  <div class="combine-info">
    <info-item v-if="info.inform" :item="info.inform" class="border" style="padding: 8px" @needUpdate="$emit('needUpdate')"></info-item>
    <co-card v-if="info.company" :item="info.company" class="border"></co-card>
    <div class="border" style="padding: 19px" v-if="info.product && info.product.length">
      <co-item v-for="(item, index) in info.product" :item="item" :key="index" class="co-item" @needUpdate="$emit('needUpdate')"></co-item>
    </div>
  </div>
</template>

<script>
import InfoItem from './info-list/InfoItem.vue'
import CoCard from '../../components/co-page/co-card/CoCard'
import CoItem from '../../components/co-page/co-item/CoItem'

export default {
  name: 'CombineInfo',

  components: {
    'info-item': InfoItem,
    'co-card': CoCard,
    'co-item': CoItem,
  },

  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="stylus" scoped>
  .combine-info
    margin-bottom 20px
  .border + .border
    margin-bottom 20px
  .co-item
    width 270px
    display inline-block
    & + .co-item
      margin-left 40px
</style>

