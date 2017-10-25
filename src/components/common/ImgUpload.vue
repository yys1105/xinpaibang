<template>
  <div>
    <img src="/static/images/img_placeholder.jpg" alt="tmp-img">
    <label class="cover">
      <span class="text">
        点击上传图片
        <input type="file" hidden accept="image/jpeg,image/jpg,image/png" @change="handleFileChange">
      </span>
    </label>
  </div>
</template>

<script>
  import { showAlert } from '../../config/functions'
  export default {
    name: 'imgUpload',

    data () {
      return {
        imgTemp: '',
      }
    },

    methods: {
      handleFileChange(e) {
        console.log(e.target.files)
        let
          files = e.target.files,
          img = files[files.length - 1];
        if (!/^image\//.test(img.type))
          return showAlert('请上传图片类型的文件')
        this.$httpPost('admin/file/ajaxUploadImg.do', {
          file: img
        })
          .then(data => {
            this.$emit('uploadDone', data.data)
          })
          .catch(err => console.log('图片错误！'))
      }
    }
  }
</script>

<style scoped lang="stylus">

  .cover
    cursor pointer

</style>
