<template>
  <div class="content-view">
    <template v-if="!loading">
      <template v-if="successList.length">
        <p class="title">超级管理</p>
        <co-list-card
          class="card"
          :isMyCompany="true"
          v-for="(item, index) in successList"
          :hasButton="false"
          :item="item"
          :key="index"></co-list-card>
      </template>

      <template v-if="auditingList.length">
        <p class="title">认领审核中</p>
        <co-list-card
          class="card"
          v-for="(item, index) in auditingList"
          :hasButton="false"
          :item="item"
          :key="index"></co-list-card>

      </template>

      <template v-if="failedList.length">
        <p class="title">审核失败</p>
        <co-list-card
          class="card"
          v-for="(item, index) in failedList"
          :hasExtraButtons="true"
          :item="item"
          :key="index"
          @update="updateAfterDelete"></co-list-card>
      </template>
    </template>
    <template v-else>
      <gear></gear>
    </template>
  </div>
</template>

<script>
  import CoListCard from '../../../../components/my-co-list/CoListCard.vue'
  import Gear from '../../../../components/common/loading/Gear.vue'

  export default {
    name: '',

    data () {
      return {
        failedList: [],
        auditingList: [],
        successList: [],

        loading: false
      }
    },

    methods: {

      test() { console.log(111) },

      getFailed() {
        return this.$httpGet('home/user/claimFail.do', {}).then((data) => data.data)
      },

      getAuditing() {
        return this.$httpGet('home/user/claimAuditing.do', {}).then((data) => data.data)
      },

      getSuccess() {
        return this.$httpGet('home/user/claimSuccess.do', {}).then((data) => data.data)
      },

      updateAfterDelete() {
        this.getFailed().then(date => {
          this.failedList = data
        })
      },

      initClaimList() {
        this.loading = true
        Promise.all([this.getFailed(), this.getAuditing(), this.getSuccess()])
          .then(data => {
            [this.failedList, this.auditingList, this.successList] = data
            this.loading = false
          })
      }
    },

    created() {
      this.initClaimList()
    },

    components: {
      CoListCard,
      Gear
    }
  }
</script>

<style scoped lang="stylus">
  .title
    padding 0 20px
    line-height 40px
  .card
    border-radius 0 !important
    box-shadow 0 0 5px #aaa !important


  .loading
    font-size 12px

  .card + .card
    margin-top 15px

</style>
