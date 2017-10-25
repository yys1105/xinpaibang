<template>
  <div class="number-select">
    <input type="text" v-model="inputValue" @input="handleInput($event.target.value)" title="数量">
    <div class="input-after">
      <button type="button" class="iconfont icon-xiaosanjiao up" @click="addOne"></button>
      <button type="button" class="iconfont icon-xiaosanjiao down" @click="reduceOne"></button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'numberSelect',

    props:{
      value: {
        type: String | Number
      },
      max: {
        type: Number
      }
    },

    data () {
      return {
        inputValue: 0
      }
    },

    created() {
      this.inputValue = this.value
    },

    methods: {
      updateValue(val) {
        this.$emit('input', val)
      },

      addOne() {
        this.inputValue = +this.inputValue + 1;
      },

      reduceOne() {
        this.inputValue = +this.inputValue - 1;
        +this.inputValue < 0 && (this.inputValue = 0);
      },

      handleInput(val) {
        (isNaN(+val) || +val < 0) && (this.inputValue =  0);
      }
    },

    watch: {
      inputValue: function (val, oldVal) {
        if (+val > this.max) {
//          alert('不能超过最大值！')
          this.inputValue = oldVal;
        }
        this.updateValue(+this.inputValue)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .number-select
    display inline-block
    position relative
    width 85px
    border-radius 3px
    overflow hidden
    input
      width 65px
      height 25px
      border 1px solid #06c
      border-radius 3px 0 0 3px
      padding 0 5px
    .input-after
      width 20px
      height 25px
      position absolute
      right 0
      top 0
      background-color #06c
      .up,
      .down
        position absolute
        height 12px
        width 20px
        text-align center
        top 0
        left 0
        font-size 12px
        user-select none
        cursor pointer
        color #fff
        background-color #06c
        transition background-color 200ms
        border none
        &:hover
          background-color: #0080E8
      .up
        transform rotate(180deg)
      .down
        top 13px


</style>
