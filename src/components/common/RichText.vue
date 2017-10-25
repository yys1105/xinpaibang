<!--<template>-->
<!--<quill-editor-->
<!--v-model="richContent"-->
<!--ref="myQuillEditor"-->
<!--:options="editorOption"-->
<!--:style="{ 'margin-bottom': '50px' }"-->
<!--@change="onEditorChange($event)">-->
<!--<div id="toolbar" slot="toolbar">-->
<!--<span class="ql-formats">-->
<!--<select class="ql-size" title="字号大小">-->
<!--<option value="small" title="偏小"></option>-->
<!--<option selected title="正常"></option>-->
<!--<option value="large" title="偏大"></option>-->
<!--<option value="huge" title="大"></option>-->
<!--</select>-->
<!--</span>-->
<!--<span class="ql-formats">-->
<!--<button class="ql-bold" tittle="加粗"></button>-->
<!--<button class="ql-italic" title="斜体"></button>-->
<!--<button class="ql-underline" title="下划线"></button>-->
<!--<button class="ql-header" value="1" title="标题1"></button>-->
<!--</span>-->
<!--<span class="ql-formats">-->
<!--<button class="ql-list" value="ordered" title="有序列表"></button>-->
<!--<button class="ql-list" value="bullet" title="无序列表"></button>-->
<!--<select class="ql-align" title="对齐方式">-->
<!--<option selected title="左对齐"></option>-->
<!--<option value="center" title="居中对齐"></option>-->
<!--<option value="right" title="右对齐"></option>-->
<!--<option value="justify" title="两段对齐"></option>-->
<!--</select>-->
<!--</span>-->
<!--<span class="ql-formats">-->
<!--<button class="ql-clean" title="清除格式"></button>-->
<!--<button class="ql-link" title="链接"></button>-->
<!--<button style="outline: none" title="添加图片">-->
<!--<label for="addImage" style="width: 100%; height: 100%; display: block; cursor: pointer"><i-->
<!--class="iconfont icon-tupian" style="font-size: 18px"></i></label>-->
<!--<input type="file" style="display: none" id="addImage" @change="addImage"-->
<!--accept="image/jpg,image/jpeg,image/png">-->
<!--</button>-->
<!--</span>-->
<!--</div>-->
<!--</quill-editor>-->
<!--</template>-->

<!--<script>
//  import Quill from 'quill';
import {showAlert} from '../../config/functions'

export default {
name: 'RichText',

props: {
content: {
type: String
},
},

computed: {
richContent() {
return this.content
}
},

data() {
return {
// 富文本
editorOption: {
modules: {
toolbar: '#toolbar',
history: {delay: 1000, maxStack: 50, userOnly: false},
}
},
img: null
}
},

mounted() {
// 修改默认的placeholder
this.$refs.myQuillEditor.quill.root.setAttribute('data-placeholder', "在此输入...")
},

methods: {
onEditorChange({editor, html, text}) {
this.$emit('editorChange', html)
},

addImage(evt) {
let positionIndex = this.$refs.myQuillEditor.quill.getSelection().index;
let files = evt.target.files
, img = files[files.length - 1];
this.$httpPost('admin/file/ajaxUploadImg.do', {file: img})
.then((data) => {
let quill = this.$refs.myQuillEditor.quill;
quill.insertEmbed(positionIndex, 'image', data.data);
evt.target.value = ''
})
.catch(() => {
showAlert('服务器异常！');
evt.target.value = ''
})
}
}
}
</script>-->

<template>
  <div class="rich-text clearfix">
    <div id="editorMenu" class="editor-toolbar"></div>
    <div id="editorText" @input="result" class="rich-text-box"></div>
  </div>
</template>

<script>
  import WangEditor from 'wangeditor';
  import {BASE_URL} from "../../config/const";
  import {showAlert} from "../../config/functions/index";

  export default {
    name: 'RichText',
    props: {
      content: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        editor: '',
        menuStyle: {},
      }
    },

    computed: {
      richContent () {
        return this.content
      }
    },

    watch: {
      'content'(val) {
        this.setContent(val);
      }
    },

    mounted() {
      let _this = this
        , editor = new WangEditor('#editorMenu', '#editorText')

      editor.config = {}
      editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'image',  // 插入图片
        'undo',  // 撤销
        'redo'  // 重复
      ]
      editor.customConfig.showLinkImg = false  // 禁用网络图片tab
      editor.customConfig.zIndex = 10          // 编辑区域的 z-index
      /**
       * 自定义图片上传到服务器
       * @param files input 中选中的文件列表
       * @param insert 获取图片 url 后，插入到编辑器的方法
       */
      editor.customConfig.customUploadImg = function (files, insert) {
        _this.$httpPost('admin/file/ajaxUploadImg.do', { file: files[0]})
          .then(({data}) => insert(data))
          .catch(() => showAlert('服务器异常！'))
      }
      editor.create()
      this.editor = editor
      this.setContent(this.content)
      $(window).on('scroll', this.setFixed)
    },

    beforeDestroy() {
      $(window).off('scroll', this.setFixed)
    },

    methods: {
      result() { this.$emit('editorChange', this.editor.txt.html()) },

      setFixed() {
        let $menu = $('.editor-toolbar')
          , $richText = $('.rich-text')
        if ($('#editorText').offset().top - $(window).scrollTop() <= 125) {
          $menu.css({
            'position': 'fixed',
            'top': '85px',
            'width': $richText.width() + 'px',
            'left': $richText.offset().left + 'px',
            'z-index': 12,
          })
        } else {
          $menu.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 0,
          })
        }
      },

      clear() {
        this.editor.txt.clear()
      },

      setContent(val) {
        this.editor.txt.html(val);
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .rich-text
    position relative
    margin-top 20px;
    .editor-toolbar
      width 100%;
      position absolute;
      top: 0;
      left 0;
      border 1px solid #ccc;
      background-color #fff;
    .rich-text-box
      margin-top 40px;
      min-height 300px;
      border 1px solid #ccc;
</style>
