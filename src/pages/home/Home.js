import InfoList from '../../components/common/info-list';
import Carousel from 'iview/src/components/carousel';
import CarouselItem from 'iview/src/components/carousel/carousel-item.vue';
import Gear from '../../components/common/loading/Gear.vue';
import HomeAside from './HomeAside.vue'

export default {
  name: 'MainLayout',

  components: {
    InfoList,
    Gear,
    Carousel,
    CarouselItem,
    HomeAside
  },

  data() {
    return {
      isLoading: false,
      carouselValue: 0,
      carouseDataList: [],
      // 标签列表
      tabOfList: [
        {name: '精选', column: '', index: 1},
        {name: '物联百科', column: 'wlbk', index: 2},
        {name: '用户专区', column: 'yhzq', index: 3},
        {name: '名家&专栏', column: 'mjzl', index: 4},
        {name: '展会活动', column: 'zhhd', index: 5},
      ],
      activeItemIndex: 1,
      activeItemName: '精选',

      // 首页列表
      mainListPageCurrent: 1,
      mainList: [],
      mainListComplete: false,
      mainListLoading: false
    }
  },

  methods: {
    // 首页精选列表
    getMainDataList(cleanList = false) {
      //公司的文章问答列表 || 所有的文章问答立标
      let url = 'home/home/getGoodSelectedPage.do'
        , param = {};

      param = this.activeItemName === '精选' ? {
        pageCurrent: this.mainListPageCurrent,
        pageSize: 10
      } : {
        column: this.tabOfList[this.activeItemIndex-1].column,
        pageCurrent: this.mainListPageCurrent,
        pageSize: 10
      };

      this.mainListLoading = true;
      return this.$httpGet(url, param)
        .then(data => {
          let list = [...data.data.rows];
          list.forEach(item => item.source && item.source.substring(0,3) === '转自：' && (item.source = item.source.substring(3)));
          cleanList ? this.mainList = list : this.mainList.push(...list);
          this.mainListLoading = false;
          (data.data.pageCurrent === data.data.pageCount) && (this.mainListComplete = true);
          this.mainListPageCurrent = data.data.pageCurrent + 1;
        }).catch(e => {
          console.log(e);
          this.mainListLoading = false;
          console.log('请求异常！')
        })
    },

    // 更换首页显示列表的类型
    tabClick({name, index}) {
      this.activeItemIndex = index;
      this.activeItemName = name;
      this.mainList = [];
      this.mainListComplete = false;
      this.mainListPageCurrent = 1;
      this.mainListLoading = true;
      this.getMainDataList()
    },

    // 获取轮播图
    getCarousel() {
      this.$httpGet('home/home/getCarouselFigure.do', {})
        .then(data => {
          data.data.forEach((item) => {
            this.carouseDataList.push({
              img: item.val,
              info: item.name,
              otherVal: item.otherVal,
            })
          })
        })
        .catch(() => {
          window.console.log('--轮播数据--请求异常！')
        })
    },
  },

  created() {
    this.isLoading = true;
    this.getMainDataList();
    this.getCarousel();
  },
}
