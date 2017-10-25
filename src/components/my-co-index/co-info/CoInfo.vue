<template>
  <div class="co-info content-view">
    <template v-if="editMode">
      <rich-text :content="content" @editorChange="handleEditorChange"></rich-text>
      <div style="text-align: center;margin-top: 20px;">
        <i-button type="primary" style="width: 100px;" @click="handleSubmit">提交</i-button>
      </div>
    </template>
    <template v-else>
      <template v-if="content !== ''">
        <div class="ql-snow">
          <div class="ql-editor" v-html="content"></div>
        </div>
      </template>
      <template v-else>
        <p align="center" class="ql-editor">公司没有添加'关于我们'的信息</p>
      </template>
      <div style="text-align: center;margin-top: 20px;">
        <i-button type="primary" style="width: 100px;" @click="editMode = true">修改</i-button>
      </div>
    </template>
  </div>
</template>

<script>
  import RichText from '../../common/RichText.vue'
  import IButton from 'iview/src/components/button'
  import { showConfirm, showAlert } from '../../../config/functions'

  export default {
    name: 'coInfo',

    components: {
      RichText,
      IButton
    },

    props: {
      info: {
        type: Object
      }
    },

    data() {
      return {
        content: '',
        result: '',

        editMode: false,
      }
    },

    computed: {
      cid() {
        return this.$route.params.id
      }
    },

    methods: {
      handleEditorChange(val) {
        this.result = val
      },

      handleSubmit() {
        if (!showConfirm('确认提交吗？'))
          return;
        this.$httpPost('home/user/synopsisOfCompanyEdit.do', {
          cid: this.cid,
          synopsis: this.result
        }).then(data => {
          console.log(data);
          showAlert('提交成功');
          this.$emit('needUpdate');
          this.editMode = false
        }).catch(err => {
          if (err || err.message) {
            showAlert(err.message)
          }
          console.log(err.message || err);
        })
      }
    },

    created() {
      this.content = this.info.synopsis
    }
  }
</script>

<style scoped lang="stylus">

  .co-info
    margin-bottom 20px;
    h2
      margin-top 50px
    .info-content
      width 650px
      margin 30px auto

</style>
