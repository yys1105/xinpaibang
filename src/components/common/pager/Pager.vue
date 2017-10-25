<template>
  <ul class="simple-pager" @click="onPagerClick" v-if="total > 1">
    <li class="pagi-tool pagi-prev" :class="{ 'pagi-disable': curr === 1 || total === 0}"></li>

    <li v-if="curr - 2 > 1 || total === 0" :class="{ 'active': curr === 1 }">1</li>

    <li v-if="curr - 3 > 1" class="pagi-tool pagi-other"></li>

    <li v-for="n in total" :key="n" v-if="Math.abs(curr - n) <= 2" :class="{ 'active': curr === n }">{{ n }}</li>

    <li v-if="curr + 3 < total" class="pagi-tool pagi-other"></li>

    <li v-if="curr + 2 < total">{{ total }}</li>

    <li class="pagi-tool pagi-next" :class="{ 'pagi-disable': curr === total || total === 0 }"></li>
  </ul>
</template>

<script>
export default {
  name: 'pager',

  props: {
    total: Number,
    curr: Number
  },

  methods: {
    onPagerClick(event) {
      const target = event.target;

      if (
        target.nodeName === 'UL' ||
        target.className.indexOf('pagi-other') !== -1 ||
        target.className.indexOf('active') !== -1
      ) return;

      let
        newPage = Number(target.textContent),
        currentPage = this.curr,
        totalPage = this.total;

      if (target.className.indexOf('pagi-prev') !== -1) {
        newPage = this.curr - 1
      } else if (target.className.indexOf('pagi-next') !== -1) {
        newPage = this.curr + 1
      }

      if (newPage > totalPage) {
        newPage = totalPage
      } else if (newPage < 1) {
        newPage = 1
      }

      if (newPage !== this.curr) {
        this.$emit('change', newPage)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import './Pager.styl'
</style>
