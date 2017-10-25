<template>
  <div class="content-view" style="margin-bottom: 20px;">
    <table border="0" cellspacing="0" class="co-docs-table ">
      <template v-if="editMode">
        <tbody>
        <tr v-for="no in Math.ceil(table.length/2)">
          <th>{{ table[(no-1)*2]['th'] }}</th>
          <td :colspan="((no-1)*2 + 1) === table.length && 3">
            <input v-if="((no-1)*2 + 1) !== table.length" class="modify-input" v-model="tableInfo[table[(no-1)*2]['td']]" title="th">
            <textarea v-else class="modify-input" v-model="tableInfo[table[(no-1)*2]['td']]" rows="5" title="th"></textarea>
          </td>
          <th v-if="table[(no-1)*2+1]">{{ table[(no-1)*2+1]['th'] }}</th>
          <td v-if="table[(no-1)*2+1]"><input class="modify-input" v-model="tableInfo[table[(no-1)*2+1]['td']]" title="th"></td>
        </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
        <tr v-for="no in Math.ceil(table.length/2)">
          <th>{{ table[(no-1)*2]['th'] }}</th>
          <td :colspan="((no-1)*2 + 1) === table.length && 3"> {{ tableInfo[table[(no-1)*2]['td']] }} </td>
          <th v-if="table[(no-1)*2+1]">{{ table[(no-1)*2+1]['th'] }}</th>
          <td v-if="table[(no-1)*2+1]">{{ tableInfo[table[(no-1)*2+1]['td']] }}</td>
        </tr>
        </tbody>
      </template>
    </table>

    <div style="text-align: center">
      <template v-if="editMode">
        <i-button class="submit" type="primary" @click="handleSubmit">提交</i-button>
      </template>
      <template v-else>
        <i-button class="submit" type="primary" @click="editMode = true">修改</i-button>
      </template>
    </div>
  </div>
</template>

<script>
  import IButton from 'iview/src/components/button'
  import { showAlert, showConfirm } from '../../../config/functions'

  export default {
    name: 'coDocs',

    components: {
      IButton
    },

    props: {
      info: {
        type: Object
      }
    },

    data () {
      return {
        table: [
          { th: '统一社会信用编码', td: 'creditCode' },
          { th: '纳税人识别号', td: 'taxpayerIdentificationNumber' },
          { th: '注册号', td: 'registrationNumber' },
          { th: '组织机构代码', td: 'organizationalStructureCode' },
          { th: '法定代表人', td: 'legalRepresentative' },
          { th: '注册资本', td: 'registeredCapital' },
          { th: '经营状态', td: 'managementStatus' },
          { th: '成立日期', td: 'createTime' },
          { th: '公司类型', td: 'companyType' },
          { th: '人员规模', td: 'personnelScale' },
          { th: '营业期限', td: 'businessTerm' },
          { th: '登记机关', td: 'registrationAuthority' },
          { th: '核准日期', td: 'dateOfIssue' },
          { th: '所属地区', td: 'subordinateArea' },
          { th: '经营范围', td: 'scopeOfBusiness' },
        ],
        tableInfo: {
          creditCode: '',
          taxpayerIdentificationNumber: '',
          registrationNumber: '',
          organizationalStructureCode: '',
          legalRepresentative: '',
          registeredCapital: '',
          managementStatus: '',
          createTime: '',
          companyType: '',
          personnelScale: '',
          businessTerm: '',
          registrationAuthority: '',
          dateOfIssue: '',
          subordinateArea: '',
          scopeOfBusiness: ''
        },
        editMode: false
      }
    },

    methods: {
      handleSubmit() {
        if (!showConfirm('确认提交'))
          return;
        this.$httpPost('home/user/informOfCompanyEdit.do', {
          cid: this.$route.params.id,
          ...this.tableInfo
        }).then(data => {
          showAlert(data.data);
          this.$emit('needUpdate');
          this.editMode = false
        }).catch(err => {
          console.log(err.message || err);
          if (err || err.message) {
            showAlert(err.message);
          }
        })
      }
    },

    created() {
      for (let key of Object.keys(this.tableInfo)) {
        this.tableInfo[key] = this.info[key]
      }
    }
  }
</script>

<style scoped lang="stylus">

  tableBorder = 1px solid #F1F4F5
  thWidth = 164px
  tdWidth = 290px
  thWidthEven = 160px

  .co-docs-table
    text-align left;
    border-left  tableBorder;
    border-top tableBorder;
    margin-top 20px;
    color #6d7380;
    tr
      width 100%
      th, td
        padding 15px
        border-right tableBorder
        border-bottom tableBorder
        height 50px
      th
        width thWidth
        background-color #F1F9FC
      td
        width tdWidth
  .modify-input
    border 0
    width 100%
    height 100%
    resize vertical
  .submit
    margin-top 30px
    width 100px
</style>
