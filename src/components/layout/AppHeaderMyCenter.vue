<script>
  import Poptip from 'iview/src/components/poptip/poptip.vue'

  export default {
    name: 'AppHeaderMyCenter',

    data () {
      return {
        menu: [
          {label: '设置', route: {name: 'setting'}},
          {label: '我的主页', route: {name: 'collection'}},
          {label: '我的企业', route: {name: 'myCompanies'}},
        ]
      }
    },

    methods: {
      userLogout() {
        this.$store.dispatch('signOut');
        window.location.reload()
      }
    },

    components: {
      Poptip
    }
  }
</script>

<template>
  <Poptip width="80" placement="bottom" class="header-menu">
    <div style="padding-right:20px;position: relative; cursor: pointer">
      <i class="iconfont icon-yonghu"></i>
      <span>{{ $store.getters.userInfo.nickname }}</span>
      <i class="iconfont icon-arrow"></i>
    </div>
    <div slot="content">
      <div
        v-for="(navItem, index) in menu"
        @click="$router.push(navItem.route)"
        :key="index"
        class="dropdown-item">
        <span class="nav-item">{{ navItem.label }}</span>
      </div>
      <div @click="userLogout" style="border-top: 1px solid #e0e0e0" class="dropdown-item">
        <span class="nav-item">退出登录</span>
      </div>
    </div>
  </Poptip>
</template>

<style scoped lang="stylus">
  .header-menu
    text-align center;
  .dropdown-item
    cursor: pointer;
</style>
