import { SIGN_IN, SIGN_OUT } from '../../mutation_types'

const USER_INFO_PARAM        = 'userInfo'
    , USER_TOKEN_PARAM       = 'token'
    , DEFAULT_REMEMBER_STATE = false;

function storage(bool) {
  return bool ? window.localStorage : window.sessionStorage
}

function getStorageItem (item) {
  return window.localStorage.getItem(item) || window.sessionStorage.getItem(item)
}

export default {
  state: {
    rememberMe: DEFAULT_REMEMBER_STATE,
    userInfo: JSON.parse(getStorageItem(USER_INFO_PARAM)),
    token: getStorageItem(USER_TOKEN_PARAM)
  },
  getters: {
    rememberMe: state => state.rememberMe,
    userInfo: state => state.userInfo,
    token: state => state.token
  },
  mutations: {
    [SIGN_IN] (state, {userInfo: newState, rememberMe = state.rememberMe}) {
      state.rememberMe = rememberMe;
      state.userInfo = newState;
      state.token = newState.token;

      storage(state.rememberMe).setItem(USER_INFO_PARAM, JSON.stringify(state.userInfo));
      storage(state.rememberMe).setItem(USER_TOKEN_PARAM, state.token)
    },
    [SIGN_OUT] (state) {
      state.userInfo = null;
      state.token = null;

      window.sessionStorage.removeItem(USER_INFO_PARAM);
      window.sessionStorage.removeItem(USER_TOKEN_PARAM);
      window.localStorage.removeItem(USER_INFO_PARAM);
      window.localStorage.removeItem(USER_TOKEN_PARAM)
    }
  },
  actions: {
    signIn: ({commit}, params) => commit(SIGN_IN, params),
    signOut: ({commit}) => commit(SIGN_OUT),
    updateUserInfo: ({commit}, userInfo) => {
      commit(SIGN_IN, userInfo)
    }
  }
}
