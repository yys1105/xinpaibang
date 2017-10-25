import CoItem from '../co-item/CoItem.vue'
import InfoList from '../../common/info-list'
import Gear from '../../common/loading/Gear.vue'


export default {
  name: 'coMain',

  components: {
    CoItem,
    InfoList,
    Gear,
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
      coBanner: '',
      noBannerPlaceHolder: '',
      dataList: [],
      listLoading: false,
      listComplete: false,
      listCurr: 1,
      coBannerLinkItem: '{}',
    }
  },

  methods: {
    // 获取公司产品
    getCoGoods() {
      this.$httpGet('home/company/getGoodPageOfCompany.do', {
        cid: this.$route.params.id,
        pageCurrent: this.goodListPageCurrent,
        pageSize: 6,
      }).then(data => {
        this.coItemList = data.data.rows
      })
    },

    // 获取公司 banner
    getBanner() {
      this.noBannerPlaceHolder = '加载中';
      this.$httpGet('home/company/getCompanyHomeTopCenter.do', {
        cid: this.$route.params.id
      }).then(data => {
        this.coBanner = data.data.val;
        if (data.data.otherVal !== '-')
          this.coBannerLinkItem = JSON.parse(data.data.otherVal);
        this.noBannerPlaceHolder =''
      }).catch(err => {
        if (err.message) {
          this.coBanner = '';
          this.noBannerPlaceHolder = err.message
        } else {
          this.noBannerPlaceHolder = '加载图片出错'
        }
      })
    },

    //公司的文章问答列表 || 所有的文章问答立标
    getArticleList() {
      let
        url = 'home/company/getArticlePageOfCompany.do',
        param = {
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
          this.listCurr = data.data.pageCurrent + 1
        }
      ).catch(_ => {
        this.listLoading = false;
        window.console.log('--精选列表--请求异常！')
      })
    }
  },

  created() {
    // this.getCoInfo()
    this.getBanner();
    this.getCoGoods();
    this.getArticleList()
  }
}
