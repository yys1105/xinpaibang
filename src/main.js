// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import http from './config/http'
import VueLazyLoad from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'iview/dist/styles/iview.css'
import 'swiper/dist/css/swiper.css'

import filters from './config/filters'
import { DEFAULT_IMG as default_img } from './config/const'

// plugin use
Vue.use(http);
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: default_img,
  loading: default_img,
});
Vue.use(VueAwesomeSwiper);

// filters
Object.keys(filters).forEach(function(key) {
  Vue.filter(key, filters[key])
});

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  watch: {
    '$route'() {
      if (process.env.NODE_ENV === 'production' && _czc) {
        // CNZZ 的统计
        let location = window.location
          , content_url = location.pathname + location.hash
          , referer_url = '/'
        _czc.push(['_trackPageview', content_url, referer_url])
      }
    },
  },
});
