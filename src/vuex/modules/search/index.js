import http from '../../../config/http'
import {
  UPDATE_SEARCH_TEXT,
  UPDATE_SEARCH_TYPE,
  UPDATE_LOADING_STATE,
  UPDATE_SEARCH_RESPONSE,
  CHANGE_CAN_SUBMIT_STATE
} from '../../mutation_types.js'

export default {
  state: {
    searchData : [],
    searchText : '',
    searchType : 'all',
    loading    : false,
    pageCount  : 1,
    pageCurrent: 1,
    canSubmit  : false,
    total      : 0
  },
  getters: {
    getSearchData        : state => state.searchData,
    getSearchText        : state => state.searchText,
    getSearchType        : state => state.searchType,
    getSearchLoadingState: state => state.loading,
    getSearchPageCount   : state => state.pageCount,
    getPageCurrent       : state => state.pageCurrent,
    getSearchTotal       : state => state.total
  },
  mutations: {
    [UPDATE_SEARCH_TEXT](state, val) {
      state.searchText = val
    },
    [UPDATE_SEARCH_TYPE](state, val) {
      state.searchType = val
    },
    [UPDATE_LOADING_STATE](state, val) {
      state.loading = val
    },
    [UPDATE_SEARCH_RESPONSE](state, obj) {
      state.searchData = obj.info;
      obj.isLoading && (state.loading = obj.isLoading);
      obj.pageCount && (state.pageCount = obj.pageCount);
      obj.pageCurrent && (state.pageCurrent = obj.pageCurrent);
      obj.total && (state.total = obj.total);
    }
  },
  actions: {
    search({ commit, getters }, { searchInfo, searchType }) {
      commit(UPDATE_SEARCH_RESPONSE, {
        info: [],
        isLoading: true
      });
      commit(UPDATE_SEARCH_TYPE, searchType);
      commit(UPDATE_SEARCH_TEXT, searchInfo.title);
      let url = {
        'all'    : 'home/home/search.do',
        'info'   : 'home/home/searchInform.do',
        'co'     : 'home/home/searchCompany.do',
        'product': 'home/home/searchProduct.do'
      };
      // search response
      let current = getters.getSearchType;
      http.httpGet(url[searchType], searchInfo)
        .then(data => {
          let info        = data.data.rows
            , pageCount   = data.data.pageCount
            , pageCurrent = data.data.pageCurrent
            , total       = data.data.total;

          commit(UPDATE_LOADING_STATE, false);
          if (current !== getters.getSearchType)
            return false;
          commit(UPDATE_SEARCH_RESPONSE, {
            pageCount  : pageCount,
            pageCurrent: pageCurrent,
            info       : info,
            total      : total
          })
        })
        .catch(err => {
          commit(UPDATE_LOADING_STATE, false)
        })
    }
  }
}
