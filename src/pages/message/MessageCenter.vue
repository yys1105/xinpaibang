<script>
  import Pager from "../../components/common/pager/Pager.vue";
  import MessageList from "./_MessageList.vue";

  export default {
    components: {
      MessageList,
      Pager
    },
    name: 'MessageCenter',

    data () {
      return {
        curr: 1,
        total: 1,
        currActive: 0,
        tabList: [
          { label: '询盘', index: 0, url: 'home/message/getInquiryMessagePage.do' },
          { label: '系统', index: 1, url: 'home/message/getSystemMessagePage.do' },
        ],
        messageList: [],
        inquiryList: [],
        systemList: [],
        loading: false,
      }
    },

    computed: {
      needUpdate() {
        return this.$parent.getNeedUpdateState();
      }
    },

    watch: {
      needUpdate(val) {
        if (val) {
//          this.updateList()
          this.$parent.setNeedUpdateState(false);
        }
      },
      $route: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },

    methods: {
      getMessagePage() {
        this.loading = true
        this.$httpGet(this.tabList[this.currActive].url, {
          pageCurrent: this.curr
        })
          .then(({data}) => {
            [this.messageList, this.total, this.curr] = [data.rows, data.pageCount, data.pageCurrent];            // messageList total curr
            this.currActive === 0 ? (this.inquiryList = this.messageList) : (this.systemList = this.messageList)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            console.log(err);
          })
      },

      handlePagerChange(val) {
        this.curr = val
        this.getMessagePage()
      },

      handleTabChange(index) {
        [this.currActive, this.curr, this.total, this.messageList] = [index, 1, 1, []];
        this.getMessagePage(this.curr)
      },

//      updateList() {
//        this.curr = 1
//        this.inquiryList = this.systemList = this.messageList = []
//        this.getMessagePage()
//      }
    },

    mounted() {
      this.getMessagePage()
    }
  }
</script>

<template>
  <div class="message-center">
    <div class="message-center--tabs">
      <button
        v-for="(item, index) in tabList"
        class="tab-item"
        :class="{'active': item.index === currActive}"
        :key="index"
        @click="handleTabChange(item.index)">{{ item.label }}</button>
    </div>

    <div class="message-center--content">
      <template v-if="currActive === 0">
        <message-list :messageList="inquiryList" :loading="loading"></message-list>
      </template>
      <template v-if="currActive === 1">
        <message-list :messageList="systemList" :loading="loading"></message-list>
      </template>
      <pager :curr="curr" :total="total" @change="handlePagerChange"></pager>
    </div>

  </div>
</template>

<style scoped lang="stylus">
  @import '../../assets/style/variables.styl'

  .message-center
    &--tabs
      margin-bottom 10px;
      .tab-item
        display: inline-block;
        background-color: #FFF;
        line-height 30px;
        padding 0 20px;
        border-radius 5px;
        color $ash;
        cursor pointer;
        user-select none;
        transition background 200ms;
        border 0;
        &.active
          background-color: lighten($sky, 50);
          color $sky;
        &+.tab-item
          margin-left 10px;
        &:not(.active):hover
          background-color lighten($sky, 55);
          color lighten($sky, 30);

</style>
