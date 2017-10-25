import Vue from 'vue'
import store from '../vuex'
import Router from 'vue-router'
import { showAlert }from '../config/functions'

Vue.use(Router);

const Content       = () => import('../components/layout/ContentLayout.vue');
const Article       = () => import('../pages/Article.vue');
const Question      = () => import('../pages/Question.vue');// router-view
const AnswerList    = () => import('../components/question/AnswerList.vue');
const Answer        = () => import('../components/question/Answer.vue');
const Write         = () => import(/* webpackChunkName: "write" */'../pages/Write.vue');
const Edit          = () => import(/* webpackChunkName: "write" */'../pages/Write.vue');
const UserCenter    = () => import('../pages/user-center');
const Me            = () => import(/* webpackChunkName: "me" */'../pages/user-center/me/Me.vue');// router-view
const MyCollect     = () => import(/* webpackChunkName: "me" */'../pages/user-center/me/Collection.vue');
const MyPost        = () => import(/* webpackChunkName: "me" */'../pages/user-center/me/Post.vue');
const MyCo          = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co');// router-view
const MyCoIndex     = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co/my-co-index/MyCo.vue');
const ModifyCoName  = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co/modify-co-name/ModifyCoName.vue');
const ModifyCoItem  = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co/item-edit-page/CoItemEdit.vue');
const AddCoItem     = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co/item-edit-page/AddItem.vue');
const AddCoCase     = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co/item-edit-page/AddCase.vue');
const CoItemPreview = () => import(/* webpackChunkName: "my-co" */'../pages/user-center/my-co/item-edit-page/CoItemPreview.vue');
const Setting       = () => import('../pages/user-center/setting/Setting.vue');
const CompanyIndex  = () => import('../pages/co-page/CoPage.vue');
const CoPageIndex   = () => import('../pages/co-page/Index.vue');
const ItemPage      = () => import('../pages/co-page/item-page/ItemPage.vue');
const Search        = () => import('../pages/SearchPage.vue');
const Guide         = () => import('../pages/Guide.vue');
const MyCos         = () => import('../pages/user-center/my-co/my-co-list/Index.vue');
const ClaimList     = () => import('../pages/user-center/my-co/my-co-list/ClaimList.vue');
const MyCoList      = () => import('../pages/user-center/my-co/my-co-list/MyList.vue');
const Claim         = () => import('../pages/user-center/my-co/claim/Claim.vue');
const SiteAbout     = () => import('../pages/SiteAbout.vue');
const MessageCenter = () => import('../pages/message/MessageCenter.vue');
const Message       = () => import('../pages/message/MessageIndex.vue');
const Conversation  = () => import('../pages/message/Conversation.vue');


let router = new Router({
  routes: [
    { name: 'home', path: '/', component: require('../pages/home/Home.vue') },
    { path: '/content', component: Content, children: [
      { name: 'article', path: '/article/:id', component: Article },
      { path: '/question/:id', component: Question, children: [
        { name: 'question', path: '', component: AnswerList },
        { name: 'answer', path: 'answer/:aid', component: Answer },
        { path: '*', redirect: { name: 'question' } },
      ] }
    ] },
    { name: 'write', path: '/write', component: Write, meta: { auth: true } },
    { name: 'edit', path: '/edit/:id', component: Edit, meta: { auth: true } },
    { path: '/user-center', component: UserCenter, meta: { auth: true }, children: [
      { path: '', redirect: { name: 'setting' } },
      { name: 'setting', path: 'setting', component: Setting, meta: { auth: true } },
      { path: 'me', component: Me, children: [
        { name: 'collection', path: 'collection', component: MyCollect, meta: { auth: true } },
        { name: 'post', path: 'post', component: MyPost, meta: { auth: true } },
        { path: '*', redirect: { name: 'collection' } },
      ] },
      { path: 'my-companies', component: MyCos, children: [
        { name: 'myCompanies', path: 'list', component: MyCoList, meta: { auth: true, breadcrumbInfo: '首页>我的企业' } },
        { name: 'claimList', path: 'claim-list', component: ClaimList, meta: { auth: true, breadcrumbInfo: '首页>认领企业' } },
        { path: '*', redirect: { name: 'myCompanies' } },
      ] },
      { name: 'claim', path: 'claim/:id', component: Claim, meta: { auth: true, breadcrumbInfo: '首页>认领企业' } },
      { path: 'my-company/:id', component: MyCo, children: [
        { name: 'myCompanyIndex', path: '', component: MyCoIndex, meta: { auth: true, breadcrumbInfo: '首页>我的企业>企业管理 - 首页' } },
        { name: 'modifyCoName', path: 'modify-name', component: ModifyCoName, meta: { auth: true, breadcrumbInfo: '首页>我的企业>企业管理>修改企业名称' } },
        { name: 'addItem', path: 'add-item', component: AddCoItem, meta: { auth: true } },
        { name: 'addCase', path: 'add-case', component: AddCoCase, meta: { auth: true } },
        { name: 'editItem', path: 'item/:itemId', component: ModifyCoItem, meta: { auth: true } },
        { name: 'itemPreview', path: 'item-preview/:itemId/', component: CoItemPreview, meta: { auth: true } },
        { path: '*', redirect: { name: 'myCompanyIndex' } },
      ] },
      { path: '*', redirect: { name: 'setting' } },
    ] },
    { path: '/co-page/:id', component: CoPageIndex, children:[
      { name: 'companyIndex', path: '', component: CompanyIndex },
      { name: 'companyItemShop', path: 'item/:itemId', component: ItemPage },
      { path: '*', redirect: { name: 'companyIndex' } }
    ] },
    { name: 'guide', path: '/guide', component: Guide },
    { name: 'search', path: '/search', component: Search },
    { name: 'aboutUs', path: '/about-us', component: SiteAbout },
    { name: 'contactUs', path: '/contact', component: SiteAbout },
    { name: 'joinUs', path: '/join-us', component: SiteAbout },
    { path: '/message', component: Message, children: [
      { name: 'message', path: '', component: MessageCenter, meta: {auth: true, breadcrumbInfo: '首页>站内信', } },
      { name: 'conversation', path: 'conversation/:groupNo', component: Conversation, meta: { auth: true,breadcrumbInfo: '首页>站内信>来往私信'} },
    ] },
    { path: '/*', redirect: { name: 'home' } },
  ]
});

router.beforeEach(({ meta }, from, next) => {
  document.body.scrollTop = 0;
  let {auth = false} = meta;
  if(auth && !Boolean(store.getters.userInfo)){
    // showAlert('登录之后才能继续操作！');
    // store.dispatch('updateLoginState', true);
    router.replace({ name: 'home' });
  } else {
    next()
  }
});

export default router
