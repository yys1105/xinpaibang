import axios from 'axios'
import store from '../../vuex'
import {BASE_URL} from '../const'

const instance = axios.create({
  baseURL: BASE_URL
});
const TOKEN = 'token';

function handleResponse(data) {
  switch (data.statusCode) {
    case 301:
      return store.dispatch('userSignOut');
    case 200:
      return Promise.resolve(data);
    default:
      return Promise.reject(data);
  }
}
function handleErr(data) {
  console.log(data.statusCode)
}

export default class HttpResource {
  static install(Vue) {
    Vue.prototype.$httpGet = this.httpGet.bind(this);
    Vue.prototype.$httpPost = this.httpPost.bind(this);
  }

  static httpGet(url, params) {
    let token = store.getters.token;
    !params[TOKEN] && token && Object.assign(params, {[TOKEN]: token});
    return instance.get(url,{params: params}).then(({data}) => {
      return handleResponse(data);
    }, err => {
      return handleErr(err);
    })
  }

  static httpPost(url, params) {
    let token = store.getters.token;
    let formData = params;
    if (!(params instanceof FormData)) {
      formData = new FormData();
      for (let key of Object.keys(params)) {
        formData.append(key, params[key] !== null ? params[key] : '')
      }
    }
    !formData[TOKEN] && token && formData.append(TOKEN, token);
    return instance.post(url, formData).then(({data}) => {
      return handleResponse(data)
    }, err => {
      return handleErr(err)
    })
  }
}
