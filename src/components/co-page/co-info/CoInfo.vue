<template>
  <div class="co-info content-view">
    <template v-if="info.synopsis !== ''">
      <div class="ql-snow">
        <div class="ql-editor info-content" v-html="info.synopsis"></div>
      </div>
    </template>
    <template v-else>
      <p v-if="info.synopsis" align="center" class="ql-editor">公司没有添加'关于我们'的信息</p>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'coInfo',

    props: {
      info: {
        type: Object
      }
    }
  }
</script>

<style scoped lang="stylus">

  .co-info
    h2
      margin-top 50px
    .info-content
      width 100%

</style>
