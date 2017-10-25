/**
 * Created by bd-pc on 2017/6/22 0022.
 */
import {
  QUIZ_MODAL_SHOW
} from '../../mutation_types'

const DEFAULT_QUIZ_STATE = false;

export default {
  state: {
    isQuizShow: DEFAULT_QUIZ_STATE
  },
  getters: {
    isQuizShow: state => state.isQuizShow
  },
  mutations: {
    [QUIZ_MODAL_SHOW] (state, newState) {
      state.isQuizShow = newState
    }
  },
  actions: {
    updateQuizState: ({commit}, isShow) => {
      commit(QUIZ_MODAL_SHOW, isShow)
    }
  }
}
