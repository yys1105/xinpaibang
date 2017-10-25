<template xmlns:v-quill>
  <div class="write">
    <div class="app-content clearfix">
      <div class="content-view write-place">
        <input type="text" class="write-title" title="write-title" placeholder="添加标题" v-model="title">
        <input-tag class="input-tag" :initLabelNames="labelNames" @tagsChanged="handleTagsChanged" :noBorder="true" placeholder="添加标签"></input-tag>
        <rich-text :content="content" min-height="500" @editorChange="getContent"></rich-text>
        <p class="source clearfix">
          <span>来源</span>
          <Radio-group v-model="source">
            <Radio label="原创">原创</Radio>
            <Radio label="转载">转载（需要注明来源）</Radio>
          </Radio-group>
          <i-input
            v-model="sourceText"
            v-if="source==='转载'"
            type="text"
            placeholder="转载来源："
            style="margin-top: 10px"></i-input>
        </p>
      </div>
      <div class="right-side">
        <button class="aside-button" style="cursor:pointer;height: 62px; font-size: 18px" @click="saveContent">发布</button>
      </div>
    </div>
  </div>
</template>

<script>
  import InputTag from '../../../../components/common/input-tag/InputTag.vue'
  import IInput from 'iview/src/components/input'
  import RichText from '../../../../components/common/RichText.vue'
  import RadioGroup from 'iview/src/components/radio/radio-group.vue'
  import Radio from 'iview/src/components/radio'
  import {showAlert} from '../../../../config/functions'

  export default {
    name: 'write',

    data() {
      return {
        content: '',
        result: '',

        title: '',
        labelNames: [],
        // 提交锁
        canSubmit: true,
        isLoad: false,

        source: '原创',
        sourceText: '',
        tagsArray: []
      }
    },

    methods: {
      handleTagsChanged(val) {
        this.labelNames = val
      },

      getContent(val) {
        this.result = val
      },

      /**
       * 发布编辑内容
       */
      saveContent() {

        if (!this.canSubmit)
          return;
        if (this.title === '' || this.result === '' || this.labelNames.length === 0)
          return showAlert("信息不完整！");
        if (this.source === '转载' && this.sourceText === '')
          return showAlert('请填写转载来源！');
        this.canSubmit = false;

        this.$httpPost('home/inform/saveArticle.do', {
          cid: this.$route.params.id,
          title: this.title,
          content: this.result,
          labelNames: this.labelNames.join(','),
          source: this.source === '原创' ? '原创' : ('转自：'+ this.sourceText)
        }).then(
          () => {
            showAlert("保存成功！");
            this.$router.push({name: 'myCompanyIndex'});
            this.canSubmit = true;
          },
          err => {
            showAlert(err.message);
            this.canSubmit = true;
          }
        )
      },
    },


    components: {
      RichText,
      InputTag,
      Radio,
      RadioGroup,
      IInput
    }
  }
</script>

<style scoped lang="stylus">

  .right-side
    padding-top 80px

  .write-title
    padding 0 15px
    width 100%
    border 0
    outline none
    font-size 24px
    font-weight bold
    line-height 30px
    margin 25px 0
  .input-tag
    padding 0 15px
  .source
    margin-left 15px
    > span
      display inline-block
      margin-top -1px
      margin-right 10px
    *
      font-size 14px
      float left

</style>
