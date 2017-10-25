<script>
  export default {
    name: 'ModalTemplate',
  }
</script>

<template>
  <div class="modal">
    <div class="modal-box">
      <div class="modal-box--header">
        <p class="modal-box--title"><slot name="title"></slot></p>
        <button type="button" class="modal-box--close text-button" @click="$emit('close')"><i class="iconfont icon-close-empty"></i></button>
      </div>
      <div class="modal-box--body"><slot name="body"></slot></div>
      <div class="modal-box--foot"><slot name="foot"></slot></div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .modal-box
    width 400px;
    min-height 200px;
    margin 100px auto;
    background #fff;
    border-radius 3px;
    border 1px solid #aaa;
    box-shadow 0 1px 1px #aaa;
    padding 10px;
    position relative;
    &--close
      position absolute;
      right 5px;
      top 5px;
    &--title
      font-size 18px;
      line-height 25px;
      font-weight bold;
      margin-top 10px;
      padding-left 10px;
      margin-bottom 20px;

</style>
