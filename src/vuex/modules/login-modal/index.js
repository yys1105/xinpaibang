import {
  LOGIN_MODAL_SHOW,
  LOGIN_CURRENT_PAGE
} from '../../mutation_types'

const DEFAULT_LOGIN_STATE = false;
const DEFAULT_LOGIN_PAGE = 'login';

export default {
  state: {
    isLoginShow: DEFAULT_LOGIN_STATE,
    currentShow: DEFAULT_LOGIN_PAGE
  },
  getters: {
    isLoginShow: state => state.isLoginShow
  },
  mutations: {
    [LOGIN_MODAL_SHOW] (state, val) {
      state.isLoginShow = val
    },
    [LOGIN_CURRENT_PAGE] (state, val) {
      state.currentShow = val
    }

  },
  actions: {
    updateLoginState: ({ commit }, isShow) => {
      commit(LOGIN_MODAL_SHOW, isShow)
    },
    changeLoginShow: ({ commit }, typeName) => {
      commit(LOGIN_CURRENT_PAGE, typeName)
    }
  }
}
