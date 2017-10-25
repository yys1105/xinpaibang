import {
  CHANGE_PHONE_SHOW,
  BIND_BOX_TYPE
} from '../../mutation_types'

export default {
  state: {
    isShow: false,
    boxType: '1',
    currPhoneNum: ''
  },
  getters: {
    isChangePhoneShow: state => state.isShow,
    boxType: state => state.boxType,
    currPhoneNum: state => state.currPhoneNum,
  },
  mutations: {
    [CHANGE_PHONE_SHOW](state, val) {
      state.isShow = val
    },
    [BIND_BOX_TYPE](state, {boxType, currPhoneNum}) {
      state.boxType = boxType
      state.currPhoneNum = currPhoneNum
    }
  },
  actions: {
    showChangePhoneModal: ({ commit }, obj) => {
      commit(BIND_BOX_TYPE, obj)
      commit(CHANGE_PHONE_SHOW, true)
    },
    closeChangePhoneModal: ({ commit }) => {
      commit(CHANGE_PHONE_SHOW, false)
    }
  }
}
