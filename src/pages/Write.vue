<template xmlns:v-quill>
  <div class="write" v-if="this.$route.name === 'write' || (this.$route.name === 'edit' && isLoad)">
    <div class="app-content clearfix">
      <div class="content-view write-place">
        <input type="text" class="write-title" title="write-title" placeholder="添加标题" v-model="title">
        <!-- 自定义输入标签 -->
        <input-tag
          class="input-tag"
          :initLabelNames="labelNames"
          @tagsChanged="handleTagsChanged"
          :noBorder="true"></input-tag>
        <!-- 富文本组件 -->
        <rich-text
          min-height="500"
          :content="content"
          @editorChange="getContent"></rich-text>

        <p class="source clearfix">
          <span>来源</span>
          <radio-group v-model="source">
            <radio label="原创">原创</radio>
            <radio label="转载">转载（需要注明来源）</radio>
          </radio-group>
          <i-input
            v-model="sourceText"
            v-if="source==='转载'"
            type="text"
            placeholder="转载来源："
            style="margin-top: 10px"></i-input>
        </p>
      </div>
      <div class="right-side">
        <button v-if="$route.name === 'write'" class="aside-button" style="cursor:pointer; height: 62px; font-size: 18px" @click="saveContent">发布</button>
        <button v-if="$route.name === 'edit'" class="aside-button" style="cursor:pointer; height: 62px; font-size: 18px" @click="saveEdit">保存编辑</button>
      </div>
    </div>
  </div>
</template>

<script>
  import InputTag from '../components/common/input-tag/InputTag.vue'
  import IInput from 'iview/src/components/input'
  import RichText from '../components/common/RichText.vue'
  import RadioGroup from 'iview/src/components/radio/radio-group.vue'
  import Radio from 'iview/src/components/radio'
  import {showAlert} from '../config/functions'

  export default {
    name: 'Write',

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
        if (!this.canSubmit) return;
        if (this.title === '' || this.result === '' || this.labelNames.length === 0) return showAlert("信息不完整！");
        if (this.source === '转载' && this.sourceText === '') return showAlert('请填写转载来源！');

        this.canSubmit = false;
        this.$httpPost('home/inform/saveArticle.do', {
          title: this.title,
          content: this.result,
          labelNames: this.labelNames.join(','),
          source: this.source === '原创' ? '原创' : this.sourceText
        })
          .then(() => {
            showAlert("保存成功！");
            this.$router.push({name: 'home'});
            this.canSubmit = true;
          })
          .catch(err => {
            showAlert(err.message);
            this.canSubmit = true;
          })
      },

      //如果是编辑页面, 获取需要修改的信息
      getArticleInfo() {
        if (this.$route.name !== 'edit') return;
        let list = [];
        this.$httpGet('home/inform/getArticleEditInfor.do', {
          iid: this.$route.params.id
        })
          .then(data => {
            console.log(data.data);
            this.title = data.data.title;
            this.content = data.data.content;
            this.result = data.data.content;
            data.data.labelList.forEach(item => list.push(item.name));
            this.labelNames = list;
            this.source = data.data.source === '原创' ? '原创' : '转载';
            this.sourceText = data.data.source
          })
          .then(() => this.isLoad = true)
      },

      // 保存修改的信息
      saveEdit() {
        console.log({
          id: this.$route.params.id,
          title: this.title,
          content: this.result,
          labelNames: this.labelNames.join(','),
          source: this.source === '原创' ? '原创' : this.sourceText
        });
        if (!this.canSubmit) return;
        if (this.title === '' || this.result === '' || this.labelNames.length === 0)
          return showAlert("信息不完整！");
        if (this.source === '转载' && this.sourceText === '')
          return showAlert('请填写转载来源！');
        this.canSubmit = false;

        this.$httpPost('home/inform/editArticle.do', {
          id: this.$route.params.id,
          title: this.title,
          content: this.result,
          labelNames: this.labelNames.join(','),
          source: this.source === '原创' ? '原创' : this.sourceText
        })
          .then(() => {
            showAlert("保存成功！");
            this.$router.push({name: 'home'});
            this.canSubmit = true;
          })
          .catch(err => {
            showAlert(err.message || err);
            this.canSubmit = true;
          })
      }
    },

    mounted() {
      this.getArticleInfo()
    },

    components: {
      'rich-text': RichText,
      'input-tag': InputTag,
      'radio': Radio,
      'radio-group': RadioGroup,
      'i-input': IInput,
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
