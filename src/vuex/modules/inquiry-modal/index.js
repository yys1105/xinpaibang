import { SEND_MSG_MODAL_SHOW } from '../../mutation_types'
import http from '../../../config/http'
import {showAlert, isLogin} from "../../../config/functions/index";

export default {
  state: {
    isShow: false,
    coInfo: {},
    itemInfo: {}
  },
  getters: {
    isSendMsgBoxShow: state => state.isShow,
  },
  mutations: {
    [SEND_MSG_MODAL_SHOW] (state, {isShow, coInfo, itemInfo}) {
      state.isShow = isShow
      if (isShow) {
        state.coInfo = coInfo
        state.itemInfo = itemInfo
      } else {
        state.coInfo = {}
        state.itemInfo = {}
      }
    }
  },
  actions: {
    /**
     * inquiry 发送框
     * @param commit
     * @param show <boolean>
     * @param item <object> 商品对象
     */
    toggleSendMsgBoxShow: ({commit}, { show = false, item = {} } = {}) => {
      if (!isLogin()) return;
      if (item.cid) {
        http.httpGet('home/company/getCompanyInform.do', {
          cid: item.cid
        }).then(({ data }) => {
          commit(SEND_MSG_MODAL_SHOW, {isShow: show, coInfo: {name: data.name, cid: item.cid}, itemInfo: item})
        }).catch(err => {
          showAlert('请求异常，请稍后再试')
          commit(SEND_MSG_MODAL_SHOW, {isShow: false, coInfo: {}, itemInfo: {}})
        })
      }
      commit(SEND_MSG_MODAL_SHOW, {isShow: show, coInfo: {}, itemInfo: {}})
    },
  },
}
