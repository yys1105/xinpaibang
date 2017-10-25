<template>
  <table border="0" cellspacing="0" class="co-docs-table content-view">
    <tbody>
    <tr v-for="no in Math.ceil(table.length/2)">
      <th>{{ table[(no-1)*2]['th'] }}</th>
      <td :colspan="((no-1)*2 + 1) === table.length && 3">{{ info[table[(no-1)*2]['td']] || '-' }}</td>
      <th v-if="table[(no-1)*2+1]">{{ table[(no-1)*2+1]['th'] }}</th>
      <td v-if="table[(no-1)*2+1]">{{ info[table[(no-1)*2+1]['td']] || '-' }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: 'coDocs',

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
          { th: '所属地区', td: 'address' },
          { th: '经营范围', td: 'scopeOfBusiness' },
        ]
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
    text-align left
    border-left  tableBorder
    border-top tableBorder
    margin-top 20px
    color #6d7380
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

</style>
