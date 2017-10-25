/**
 * Created by bd-pc on 2017/6/22 0022.
 */
import {
  REPLY_MODAL_SHOW,
  REPLY_PARAMS
} from '../../mutation_types'

const DEFAULT_STATE = false;

export default {
  state: {
    isReplyShow: DEFAULT_STATE,
    replyParams: {}
  },
  getters: {
    isReplyShow: state => state.isReplyShow,
    replyParams: state => state.replyParams
  },
  mutations: {
    [REPLY_MODAL_SHOW] (state, newState) {
      state.isReplyShow = newState
    },
    [REPLY_PARAMS] (state, newParams) {
      state.replyParams = newParams
    }
  },
  actions: {
    updateReplyState: ({ commit }, isShow) => {
      commit(REPLY_MODAL_SHOW, isShow)
    },
    updateReplyParams: ({ commit }, dataObject) => {
      commit(REPLY_PARAMS, dataObject)
    }
  }
}
