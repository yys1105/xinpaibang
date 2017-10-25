<script>
  import {BASE_URL} from '../config/const';
  import {showAlert, isLogin} from '../config/functions';
  import Comment from '../components/common/Comment';
  import Gear from '../components/common/loading/Gear.vue';
  import LinkLabel from "../components/common/LinkLabel.vue";

  export default {
    name: 'article-detail',

    data() {
      return {
        articleInfo: {},
        labelList: [],
        goodUserTag: false,
        isLock: false,
        articleLoading: false,
        collectUserTag: false,
      }
    },

    methods: {
      /**
       * 请求文章详情
       * @param id 文章id
       */
      getArticleDetail(id) {
        this.$httpGet('/home/public/getArticleInformDetail.do', {
          id: id
        }).then(data => {
          let currDetail = data.data
            , list = [];
          this.articleInfo = currDetail;
          currDetail.labelList.forEach((value, index) => {
            list.push({ label: value, key: index })
          });
          this.labelList = list;
          this.isLock = false;
          this.articleLoading = false;
        }).catch(err => {
          if (err && err.message)
            showAlert(err.message);
          else
            showAlert('获取文章失败！');
          this.$router.push({name: 'home'});
          this.isLock = false;
          this.articleLoading = false;
        })
      },

      /**
       * 收藏文章
       * @param {Number} id 文章id
       */
      collect(id) {
        if (!isLogin()) return;
        if (this.articleInfo.collectUserTag) return showAlert('该文章已经收藏！');

        this.isLock = true;
        this.$httpPost('home/inform/collectArticle.do', { iid: id })
          .then((data) => {
            this.articleInfo.collectUserTag = true
            showAlert(data.data);
            this.isLock = false;
          })
          .catch((err) => {
            err && err.message && showAlert(err.message)
            this.isLock = false;
          })
      },

      /**
       * 赞某一文章
       * @param {Number} id 文章id
       */
      agree(id) {
        if (!isLogin() || this.isLock) return;
        this.isLock = true;
        this.$httpPost('home/inform/goodArticle.do', { iid: id })
          .then((data) => {
            this.articleInfo.goodUserTag = !this.articleInfo.goodUserTag;
            if (this.articleInfo.goodUserTag) {
              this.articleInfo.goodNum ++;
              showAlert('点赞成功！');
            } else {
              this.articleInfo.goodNum --;
            }
            this.isLock = false;
          })
          .catch((err) => {
            if (err && err.mssage) { showAlert(err.message); }
            this.isLock = false;
          })
      },

      /**
       * 删除自己的文章
       */
      deleteArticle() {
        if (!isLogin() || this.isLock) return;
        this.isLock = true;
        this.$httpPost('home/inform/deleteInformOfUser.do', {
          id: this.articleId
        }).then(
          data => {
            this.isLock = false;
            showAlert(data.data);
            this.$router.push({name: 'home'});
          }
        ).catch(
          err => {
            this.isLock = false;
            window.console.log(err.message || err);
            showAlert(err.message || err);
          }
        )
      },
    },

    computed: {
      articleId() {
        return this.$route.params.id;
      }
    },

    components: {
      LinkLabel,
      'comment': Comment,
      'gear': Gear,
    },

    created() {
      this.articleLoading = true;
      this.getArticleDetail(this.articleId);
    }
  }
</script>

<template>
  <div class="article-page img-max">
    <template v-if="!articleLoading && (articleInfo !== {})">
      <!-- article-detail -->
      <div class="article-detail">
        <div class="label-list">
          <link-label v-for="(item, index) in labelList" :label="item.label" :key="index"></link-label>
        </div>
        <h2 class="article-title">{{ articleInfo.title }}</h2>
        <div class="article-info">
          <span><i class="iconfont icon-person"></i>&nbsp;作者: &nbsp;{{ articleInfo.nickname }}</span>
          <span><i class="iconfont icon-time"></i>{{ articleInfo.createTime | dateFormat }}</span>
          <span><i class="iconfont icon-ResourceType"></i>&nbsp;来源：&nbsp;{{ articleInfo.source | sourceFilter }}</span>
        </div>
        <div class="ql-snow">
          <div class="article-content ql-editor" v-html="articleInfo.content" style="line-height: 30px;"></div>
        </div>
        <div class="meta-panel clearfix">
          <span class="btn" :class="{'btn-primary': articleInfo.goodUserTag, 'btn-ghost': !articleInfo.goodUserTag}"
                @click="agree(articleId)">{{ articleInfo.goodUserTag ? '已赞' : '赞'}} {{ articleInfo.goodNum }}</span>
            <a class="meta-item" @click="collect(articleId)">{{ articleInfo.collectUserTag ? '已收藏': '收藏' }}</a>
            <a class="meta-item">分享</a>
            <a class="meta-item">举报</a>
            <span class="meta-item clearfix float-right"
                  v-if="!!$store.state.userInfo.token && (articleInfo.uid == $store.state.userInfo.userInfo.id) ">
            <router-link :to="{ name: 'edit', params: { id: $route.params.id } }" class="item-right">编辑</router-link>
            <a class="item-right" @click="deleteArticle">删除</a>
          </span>
        </div>
      </div>
      <!-- article-detail -->
      <!-- comment-area -->
      <comment :id="articleId" :type="'article'"></comment>
    </template>
    <gear v-else-if="articleLoading"></gear>
  </div>
</template>

<style scoped lang="stylus">

  @import '../assets/style/variables.styl'

  .article-page
    .article-detail
      padding-top 30px
      padding-bottom 20px
      border-bottom 1px solid #ebebeb

    .meta-panel
      margin-top 20px

      .meta-item
        margin-left 20px
        .item-right
          padding 0 5px
          float left
          & + .item-right
            border-left 1px solid #ccc

    .article-title
      color $sky
      font-weight bold
      margin 30px 0 34px

    .article-info
      color #999
      margin-bottom 24px
      span
        .iconfont
          font-size 19px
        & + span
          margin-left 24px

</style>
