<script>
  import {showAlert, isLogin, showConfirm} from '../../../config/functions';
  import LinkLabel from "../LinkLabel.vue";

  export default {
    name: 'InfoItem',

    props: {
      item: {
        type: Object,
        require: true
      },

      hasExtraBar: {
        type: Boolean,
        default: false
      }
    },

    components: {
      'link-label': LinkLabel,
    },

    methods: {
      modifyCollectTag() {
        this.item.collectTag = true;
      },

      // 收藏
      pick(item) {
        if (isLogin()) {
          let icid = item.icid
            , id = item.id
            , type = item.informType;

          if (type === 'article') { // 文章
            this.$httpPost('home/inform/collectArticle.do', {iid: id})
              .then(() => {
                this.modifyCollectTag();
                showAlert('收藏成功');
              })
              .catch(err => showAlert(err.message))
          } else {  // 问题详情
            if (!icid) {
              this.$httpPost('home/inform/followQuestion.do', {iid: id})
                .then(() => {
                  this.modifyCollectTag();
                  showAlert('收藏成功');
                })
                .catch(err => showAlert(err.message))
            } else { // 问题回答
              this.$httpPost('home/inform/collectCommentOfProblem.do', {icrid: icid})
                .then(() => {
                  this.modifyCollectTag();
                  showAlert('收藏成功');
                })
                .catch(err => showAlert(err.message))
            }
          }
        }
      },

      // 操作置顶
      handleMoveToTop(item) {
        let tips = item.top ? '取消置顶' : '置顶';
        if (!showConfirm(`确定要${tips}该案例？`)) return;
        this.$httpPost('home/user/informOfCompanyTop.do', {iid: item.id})
          .then(data => {
            showAlert(data.data);
            this.$emit('needUpdate');
          })
      },

      // 操作删除
      handleDelete(item) {
        if (!showConfirm('确认删除此条咨询？')) return;
        this.$httpPost('home/user/deleteCollectInformOfUser.do', {iid: item.id})
          .then(data => {
            showAlert(data.data);
            this.$emit('needUpdate');
          })
          .catch(err => showAlert('删除失败！'))
      }
    },
  }

</script>

<template>
  <div class="info-item clearfix">
    <!-- 如果有左侧的图片 -->
    <router-link
      class="info-item-img"
      v-if="item.imageUrl"
      :to="item.informType === 'article'
            ? {name: 'article', params: { id: item.id } }
            : (item.icid
              ? { name: 'answer', params: { id: item.id, aid: item.icid } }
              : { name: 'question', params: { id: item.id } })"
      target="_blank">
      <div class="img-control"><img v-lazy="item.imageUrl" alt="imgPreview" src=""></div>
    </router-link>
    <!-- 主要的信息 -->
    <div class="info-item-main" :style="item.imageUrl ? {'margin-left': '328px', 'width': '582px'} : {'width': '910px', 'min-height': '100px'}">
      <div class="info-content">
        <!-- 标题 -->
        <router-link
          class="content-title"
          :to="item.informType === 'article'
                ? {name: 'article', params: { id: item.id } }
                : (item.icid
                  ? { name: 'answer', params: { id: item.id, aid: item.icid } }
                  : { name: 'question', params: { id: item.id } })"
          target="_blank">
          {{ item.title }}
        </router-link>
        <!-- 描述 -->
        <p class="content-info">{{ item.describe }}</p>
      </div>
      <!-- 信息状态，操作按钮链接等 -->
      <div class="main-meta clearfix">
        <div class="meta-item clearfix" v-if="!item.source || item.source === '原创'"><i class="iconfont icon-person"></i> 作者：<span class="writer">{{ item.author }}</span></div>
        <div class="meta-item clearfix" v-if="item.source && item.source !== '原创'"><i class="iconfont icon-ResourceType"></i> 来源：<span class="writer">{{ item.source | sourceFilter }}</span></div>
        <div class="meta-item clearfix"><i class="iconfont icon-time"></i>{{ item.createTime | dateFormat }}</div>
        <div class="meta-item meta-label clearfix" :style="item.imageUrl ? {'width': '200px'} : {'width': '420px'}">
          <link-label v-for="(label, index) in item.labelList" font-size="12" :label="label" :key="index"></link-label>
        </div>
        <div class="meta-item float-right" v-if="$route.name !== 'collection'">
          <!-- 我的公司管理界面显示 -->
          <template v-if="hasExtraBar">
            <a class="meta-o" @click="handleMoveToTop(item)">{{ item.top ? '取消置顶' : '置顶' }}</a>
            <a class="meta-o" @click="handleDelete(item)">删除</a>
          </template>
          <!--{{ item }}-->
          <a v-if="!(item.informType === 'question' && item.icid) " class="meta-o" @click="pick(item)">{{ item.collectTag ? '已收藏' : '收藏' }}</a>
        </div>
        <div class="meta-item float-right" v-else><a class="meta-o" @click="handleDelete(item)">删除收藏</a></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  @import './InfoItem.styl'
</style>
