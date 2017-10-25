import Vue from 'vue'
import Vuex from 'vuex'

import loginModal from './modules/login-modal'
import userInfo from './modules/user-info'
import quiz from './modules/quiz-modal'
import reply from './modules/reply-modal'
import search from './modules/search'
import changePhone from './modules/change-phone'
import inquiry from './modules/inquiry-modal'
import inquiryReply from './modules/inquiry-reply-modal'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    loginModal,
    userInfo,
    quiz,
    reply,
    search,
    changePhone,
    inquiry,
    inquiryReply
  },
  strict: debug
})
