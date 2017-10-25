<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="content-box">
      <p class="header">修改图片链接</p>
      <span class="close" @click="$emit('close')"><i class="iconfont icon-guanbi"></i></span>
      <div class="content">
        <table>
          <tr>
            <td class="table-list-left">当前链接</td>
            <td class="table-list-item">{{ (currentLink === '-' || currentLink === '') ? '暂无链接' : currentLink }}</td>
          </tr>
        </table>
        <br>
        <table>
          <tr>
            <td class="table-list-left">可选链接</td>
            <td class="table-list-item">
              <div class="chosen-list">
                <p class="item-detail" v-for="link in jumpLinkList">
                  <label>
                    <input type="radio" :value="{id: link.id, name: link.name, type: link.type, cid: (link.cid ? link.cid : link.id)}" v-model="selected">
                    {{ (link.type === 'company' ? '公司 : ' : '产品 : ') + '  ' + link.name }}
                  </label>
                </p>
              </div>
            </td>
          </tr>
        </table>
        <div class="submit-btn">
          <i-button type="ghost" @click="handlePanelSubmit">提交</i-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IButton from 'iview/src/components/button'
  import { showAlert } from '../../config/functions'

  export default {
    name: 'linkListPanel',

    data () {
      return {
        jumpLinkList: [],
        selected: ''
      }
    },

    props: {
      currentLink: {
        type: String
      },
      type: {
        type: String
      }
    },

    computed: {
      cid() {
        return this.$route.params.id
      }
    },

    methods: {
      getJumpLinkList() {
        this.$httpPost('home/user/getBannerUrlOfCompany.do', {
          cid: this.cid
        }).then(data => {
          console.log(data.data)
          this.jumpLinkList = data.data
        })
      },

      handlePanelSubmit() {
        console.log(JSON.stringify(this.selected))
        let select = JSON.stringify(this.selected)
        if (select === '')
          return showAlert('请选择跳转链接！')
        this.$httpPost('home/user/change'+ this.type +'BannerTranslateUrl.do', {
          cid: this.cid,
          url: JSON.stringify(this.selected)
        })
          .then(data => {
            showAlert(data.data)
            this.selected = ''
            this.$emit('submitSucc')
            this.$emit('close')
          })
          .catch(err => {
            console.log(err)
            showAlert('提交失败！')
          })
      }
    },

    created() {
      // 如果没有传 type 直接关闭这个组件
      if(this.type === '')
        this.$emit('close')
    },

    mounted() {
      this.getJumpLinkList()
      console.log(this.currentLink, this.type)
    },

    components: {
      IButton
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../assets/style/variables.styl'

  .company-page
    .content-box
      width 500px
      min-height 400px
      background-color #fff
      margin 100px auto
      border 1px solid #bbb
      border-radius 3px
      padding 15px
      position relative
      .header
        font-size 17px
        font-weight bold
      .close
        position absolute
        right 15px
        top 15px
        cursor pointer
        user-select none
      .content
        margin-top 20px
        padding 20px

      .table-list-left
        width 100px
        vertical-align top

      .table-list-item
        color $sky
        .item-detail
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          width 300px
          margin-bottom 5px
      .chosen-list
        max-height 300px
        overflow auto
      .submit-btn
        text-align center
        margin-top 20px

</style>
