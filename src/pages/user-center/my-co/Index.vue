<template>
  <div class="my-company">
    <breadcrumb></breadcrumb>
    <router-view></router-view>
  </div>
</template>

<script>
import Breadcrumb from '../../../components/my-co/Breadcrumb'

export default {
  name: 'myCoView',

  components: {
    Breadcrumb
  }
}
</script>

