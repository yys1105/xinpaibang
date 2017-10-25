<template>
  <div class="co-contract content-view" v-if="editMode">
    <i-form :label-width="100">
      <form-item label="企业地址">
        <i-input v-model="address"></i-input>
      </form-item>
      <form-item label="企业电话">
        <i-input v-model="telephone"></i-input>
      </form-item>
      <form-item label="企业邮箱">
        <i-input v-model="email"></i-input>
      </form-item>
      <form-item label="企业网站">
        <i-input type="textarea" v-model="website"></i-input>
      </form-item>
      <form-item>
        <i-button type="primary" @click="submitModify" style="width: 100px;">提交</i-button>
      </form-item>
    </i-form>
  </div>
  <div class="content-view" v-else>
    <contract-us :info="info"></contract-us>
    <p align="center">
      <i-button type="primary" @click="editMode = true" style="width: 100px;">修改</i-button>
    </p>
  </div>
</template>

<script>
  import IForm from 'iview/src/components/form/form.vue'
  import FormItem from 'iview/src/components/form/form-item.vue'
  import IInput from 'iview/src/components/input/input.vue'
  import IButton from 'iview/src/components/button/button.vue'
  import { showConfirm, showAlert } from '../../../config/functions'
  import ContractUs from '../../co-page/co-contact_us'

  export default {
    name: 'coContractUs',

    components: {
      IForm,
      FormItem,
      IInput,
      IButton,
      ContractUs
    },

    props: {
      info: {
        type: Object
      }
    },

    computed: {
      cid() {
        return this.$route.params.id
      }
    },

    methods: {
      submitModify() {
        if (!showConfirm('确认提交？'))
          return;
        this.$httpPost('home/user/contactUsInformEdit.do', {
          cid: this.cid,
          address: this.address,
          landlineTelephone: this.telephone,
          email: this.email,
          website: this.website,
        }).then(data => {
          showAlert('提交成功！');
          this.$emit('updateCoInfo');
          this.editMode = false
        }).catch(err => {
          if (err || err.message) {
            showAlert(err.mesaage);
            console.log(err, err.message);
          }
        })
      }
    },

    data () {
      return {
        address: '',
        telephone: '',
        email: '',
        website: '',
        editMode: false
      }
    },

    beforeMount() {
      this.address = this.info.address
      this.telephone = this.info.landlineTelephone
      this.email = this.info.email
      this.website = this.info.website
    }
  }
</script>

<style scoped lang="stylus">

.co-contract
  margin-top 20px

</style>
