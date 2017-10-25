<script>
  import { showAlert } from '../../../config/functions/'
  /*eslint-disable*/
  const validators = {
    email : new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url : new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text : new RegExp(/^[a-zA-Z]+$/),
    digits : new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate : new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
  }
  /*eslint-enable*/
  export default {
    name: 'InputTag',

    props: {
      initLabelNames: {
        type: Array,
        default: () => [],
      },
      onChange: {
        type: Function,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      validate: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        newTag: '',
        placeholder: '输入内容，回车以添加标签',
        timer: null,
        loading: false,
        inputFocus: false,
        remoteList: [],
        tags: [],
      };
    },

    created() {
      this.tags = this.initLabelNames
    },

    watch: {
      newTag: function (val) {
        if (val !== '')
          this.remoteList = []
      }
    },

    methods: {
      focusNewTag() {
        if (this.readOnly) { return; }
        this.$el.querySelector('.new-tag').focus();
      },
      addNew(tag) {
        if (this.tags.length >= 5) {
          showAlert('最多五条标签哦！')
          return;
        }
        if (tag && !this.tags.includes(tag) && this.validateIfNeeded(tag)) {
          this.tags.push(tag);
          this.tagChange();
        }
        this.newTag = '';
      },
      validateIfNeeded(tagValue) {
        if (this.validate === '' || this.validate === undefined) {
          return true;
        } else if (Object.keys(validators).indexOf(this.validate) > -1) {
          return validators[this.validate].test(tagValue);
        }
        return true;
      },
      remove(index) {
        this.tags.splice(index, 1);
        this.tagChange();
      },
      removeLastTag() {
        if (this.newTag) { return; }
        this.tags.pop();
        this.tagChange();
      },
      tagChange() {
        if (this.onChange) {
          // avoid passing the observer
          this.onChange(JSON.parse(JSON.stringify(this.tags)));
        }
      },
      getRemote(inputVal) {
        this.loading = true
        clearTimeout(this.timer)
        this.getRemoteList = []
        if (inputVal === '') {
          return this.getHotTabs()
        }
        this.timer = setTimeout(() => {
          this.$httpGet('home/public/getLableList.do', {})
            .then(data => {
              let list = data.data.map(item => { return {
                value: item.id,
                label: item.name
              }})
              this.remoteList = list.filter(item => item.label.toLowerCase().indexOf(inputVal.toLowerCase()) > -1)
              clearTimeout(this.timer)
              this.loading = false
            })
        }, 1000)
      },
      selectRemoteTag(tagName) {
        if (this.loading) {
          return
        }
        this.addNew(tagName)
        this.remoteList = []
      },
      handleInputFocus() {
        this.inputFocus = true
        this.loading = true
        this.getHotTabs()
      },
      handleInputBlur() {
        this.$emit('tagsChanged', this.tags)
        this.newTag = ''
      },
      getHotTabs() {
        this.$httpGet('home/home/getHotTopLabel.do', {})
          .then((data) => {
            let list = []
            data.data.forEach((item) => {list.push({
              value: item.id,
              label: item.name
            })})
            this.remoteList = list
            this.loading = false
          })
          .catch(() => {
            window.console.log('--热门标签--请求异常！')
            this.loading = false
          })
      }
    }
  }
</script>

<template>

  <div class="vue-input-tag">
    <div @click="focusNewTag()" v-bind:class="{'read-only': readOnly}" class="vue-input-tag-wrapper">
      <span v-for="(tag, index) in tags" v-bind:key="index" class="input-tag">
        <span>{{ tag }}</span>
        <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
      </span>
      <input
        title="tagInput"
        class="new-tag"
        v-if="!readOnly"
        v-model="newTag"
        :placeholder="placeholder"
        maxlength="10"
        @input="getRemote(newTag)"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown.delete.stop="removeLastTag()"
        @keydown.enter.188.prevent.stop="addNew(newTag)"/>
    </div>
    <div class="vue-input-tag-remote-list" v-if="inputFocus">
      <div v-if="loading" class="vue-input-tag-loading">加载数据...</div>
      <ul v-if="remoteList.length !== 0">
        <li
          class="remote-tag-item"
          v-for="item in remoteList"
          :class="{'remote-tag-item-selected': tags.indexOf(item.label) !== -1}"
          @click="selectRemoteTag(item.label)">{{ item.label }}</li>
      </ul>
    </div>
    <div v-if="inputFocus" style="position:fixed; left: 0;right:0;top:0;bottom:0;z-index:20" @click.self="(remoteList=[])&&(inputFocus=false)"></div>
  </div>
</template>

<style scoped>

  .vue-input-tag {
    position: relative;
  }

  .vue-input-tag-wrapper {
    background-color: #fff;
    overflow: hidden;
    min-height: 40px;
    padding-left: 4px;
    padding-top: 4px;
    cursor: text;
    text-align: left;
    -webkit-appearance: textfield;
  }

  .vue-input-tag-wrapper .input-tag {
    background-color: #b3c5e6;
    border-radius: 2px;
    border: 1px solid #a29fd2;
    color: #213184;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 4px;
    margin-right: 4px;
    padding: 3px;
  }

  .vue-input-tag-wrapper .input-tag .remove {
    cursor: pointer;
    font-weight: bold;
    color: #213184;
  }

  .vue-input-tag-wrapper .input-tag .remove:hover {
    text-decoration: none;
  }

  .vue-input-tag-wrapper .input-tag .remove::before {
    content: " x";
  }

  .vue-input-tag-wrapper .new-tag {
    background: transparent;
    border: 0;
    color: #777;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 6px;
    margin-top: 2px;
    outline: none;
    padding: 4px 4px 4px 0;
    width: 180px;
  }

  .vue-input-tag-wrapper.read-only {
    cursor: default;
  }

  .vue-input-tag-remote-list {
    user-select: none;
    width: 200px;
    position: absolute;
    background-color: #fff;
    z-index: 22;
    /*opacity: 0;*/
  }

  .vue-input-tag-remote-list > ul {
    max-height: 300px;
    overflow: auto;
    border: 1px solid #ddd;
  }

  .remote-tag-item {
    cursor: pointer;
    line-height: 30px;
    padding: 3px 15px;
  }

  .remote-tag-item:hover {
    background-color: #eee;
  }

  .remote-tag-item-selected {
    background-color: #d5e8fc;
  }
  .vue-input-tag-loading {
    line-height: 40px;
    border: 1px solid #ddd;
    text-align: center
  }
  .vue-input-tag-loading + ul {
    border-top: 0;
  }

</style>
