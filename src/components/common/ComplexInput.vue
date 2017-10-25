<template>
  <div class="complex-input">
    <slot name="prepend"></slot>

    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      title="complexInput"
      v-on:input="updateValue($event.target.value)"
    >

    <div class="append-box input-after" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'complexInput',
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String
      },
      'type': {
        type: String,
        default: 'text'
      }
    },

    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    },

    mounted () {
    }
  }
</script>

<style lang="stylus">

  @import '../../assets/style/variables.styl'

  .complex-input
    height 46px
    display table
    position relative
    border-collapse separate
    width 100%

    input
      height 46px
      width 100%
      line-height 1
      font-size 16px
      padding 0 14px
      border 1px solid #DEDEDE
      float: left

    .input-after
      height 46px
      width 117px
      display table-cell
      text-align center
      background-color #DEDEDE
      *
        width 117px
        height 46px
        border 0
        background-color #DEDEDE
        cursor pointer
      button
        width 117px
        text-align center
        position relative
        float left


</style>
