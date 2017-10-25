<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'coPageIndex',

    computed: {
      cid() {
        return this.$route.params.id
      }
    },

  }
</script>
