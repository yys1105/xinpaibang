import {
  TOGGLE_REPLY_MSG_MODAL,
  UPDATE_REPLY_MSG_MODAL
} from '../../mutation_types'


export default {
  state: {
    isShow: false,
    info: {},
  },
  getters: {
    replyInquiryBoxShow: state => state.isShow,
    replyInquiryBoxInfo: state => state.info
  },
  mutations: {
    [TOGGLE_REPLY_MSG_MODAL]: (state, bool) => state.isShow = bool,
    [UPDATE_REPLY_MSG_MODAL]: (state, info) => state.info = info,
  },
  actions: {
    toggleReplyInquiryModal: ({commit}, params={show: false, info: {}}) => {
      params.show && commit(UPDATE_REPLY_MSG_MODAL, params.info);
      commit(TOGGLE_REPLY_MSG_MODAL, params.show);
    }
  },
}
