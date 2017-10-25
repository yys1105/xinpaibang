import CoItem from '../co-item/CoItem.vue'
import InfoList from '../../common/info-list'
import {
  Row as IRow,
  Col as ICol
} from 'iview/src/components/grid'
import { handleImgUpdate, showAlert } from '../../../config/functions'
import LinkListPanel from '../LinkListPanel.vue'

export default {
  name: 'coMain',

  components: {
    CoItem,
    InfoList,
    IRow,
    ICol,
    LinkListPanel
  },

  props: {
    info: {
      type: Object
    }
  },

  data() {
    return {
      coInfoList: [
        {label: '企业地址：', value: 'address'},
        {label: '联系电话：', value: 'landlineTelephone'},
        {label: '邮箱地址：', value: 'email'},
        {label: '企业网址：', value: 'website'},
      ],
      goodListPageCurrent: 1,
      coItemList: [],
      coItemTotal: 0,
      coBanner: '',
      dataList: [],
      listLoading: false,
      listComplete: false,
      listCurr: 1,
      hasBannerChanged: false,
      tempCoBanner: '',

      coBannerLink: '',
      linkListCurrent: '',
      linkListType: '',
      linkListShowPanel: false,
    }
  },

  computed: {
    cid() {
      return this.$route.params.id
    }
  },

  methods: {
    // 打开选择链接列表的弹出框
    showLinkListPanel(type, str) {
      this.linkListShowPanel = true;
      this.linkListCurrent = str;
      this.linkListType = type
    },

    // 关闭选择链接列表的弹出框
    closeLinkListPanel() {
      this.linkListShowPanel = false;
      this.linkListCurrent = '';
      this.linkListType = ''
    },

    // 保存 banner 的修改
    handleBannerSave() {
      this.$httpPost('home/user/changeCenterBanner.do', {
        cid: this.cid,
        val: this.tempCoBanner
      }).then(data => {
        showAlert(data.data);
        this.coBanner = this.tempCoBanner;
        this.hasBannerChanged = false
      }).catch(err => {
        console.log(err)
      })
    },

    // banner图片预上传
    handleImgChange(e) {
      let imgList = [...e.target.files];
      handleImgUpdate(imgList)
        .then(data => {
          this.tempCoBanner = data[0];
          this.hasBannerChanged = true;
          e.target.value = '';
        })
        .catch(err => {
          console.log(err);
          e.target.value = ''
        })
    },

    // 获取公司产品
    getCoGoods() {
      this.$httpGet('home/user/getGoodPageOfCompany.do', {
        cid: this.$route.params.id,
        pageCurrent: this.goodListPageCurrent,
        pageSize: 6
      }).then(data => {
        this.coItemList = data.data.rows;
        this.coItemTotal = data.data.total
      })
    },

    // 获取banner
    getBanner() {
      this.$httpGet('home/company/getCompanyHomeTopCenter.do', {
        cid: this.$route.params.id
      }).then(data => {
        this.coBanner = data.data.val;
        let val = JSON.parse(data.data.otherVal);
        if (val !== '' || val !== '')
          this.coBannerLink = (val.type === 'company' ? '公司: ' : '产品: ') + ' ' + val.name
      }).catch(err => console.log(err))
    },

    // 获取公司文章
    getArticleList() {
      let url = 'home/company/getArticlePageOfCompany.do'
        , param = {
            cid: this.$route.params.id,
            pageCurrent: this.listCurr,
            pageSize: 10
          };
      this.listLoading = true;
      return this.$httpGet(url, param).then(
        data => {
          let list = [...data.data.rows];
          list.forEach(item => item.source && item.source.substring(0,3) === '转自：' && (item.source = item.source.substring(3)));
          this.dataList = [...list];
          this.listLoading = false;
          data.data.pageCurrent === data.data.pageCount && (this.listComplete = true);
          this.listCurr = data.data.pageCurrent
        }
      ).catch(err => {
        this.listLoading = false;
        console.log(err)
      })
    },

    requireMore() {
      this.getArticleList();
    }
  },

  created() {
    this.getBanner();
    this.getCoGoods();
    this.getArticleList();
    console.log('123', this.coBanner)
  }
}
