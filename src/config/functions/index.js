/**
 * Created by Z4x on 2017/6/21 0021.
 */
import store from '../../vuex'
import http from '../../config/http'

/**
 * 代替系统 alert, 方便自定义
 * @param {String} msg
 */
export function showAlert(msg) {
  window.alert(msg)
}

export function showConfirm(msg) {
  return window.confirm(msg)
}

/**
 * 当前是否登陆
 * @returns {boolean}
 */
export function isLogin() {
  let token = store.getters.token;
  if (!token) {
    showAlert('登录之后才能继续操作哦！');
    store.dispatch('updateLoginState', true);
    return false
  }
  return true
}

/**
 * 获取验证码
 * @param {String, Number} phoneNum 手机号码
 * @param {Boolean} check 是否检查手机号码的唯一
 * @param {String} picCode 图片验证码
 * @param {String, Number} timeTag 图片验证码的时间戳
 * @returns {Promise}
 */
export function getVerificationCode(phoneNum, check = false, picCode, timeTag) {
  let phoneTest = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/
    , receiveCode = ''
    , errMessage = ''
  if (!phoneNum) {
    errMessage = '请输入手机号码！'
  } else if (!phoneTest.test(phoneNum)) {
    errMessage = '手机号码格式不正确，请填写正确的手机号码！'
  } else if (!picCode) {
    errMessage = '请填写图形验证码！'
  }
  if (errMessage) {
    return Promise.reject(showAlert(errMessage))
  }

  return new Promise(function (resolve, reject) {
    http.httpPost('home/public/getMobileCode.do', {
      mobile: phoneNum,
      check: check,
      picCode: picCode,
      timeTag: timeTag
    })
      .then((data) => {
        showAlert("发送成功！");
        receiveCode = data.data;
        process.env.NODE_ENV !== 'production' && console.log(receiveCode)
        resolve(receiveCode)
      })
      .catch(err => {

        showAlert(err.message);
        reject()
      })
  })
}

/**
 * 获取页面可视高度
 * @returns {[*,*]}
 */
export function getWinSize() {
  if (window.innerWidth !== undefined) {
    return [window.innerWidth, window.innerHeight];
  }
  else {
    let B = document.body,
      D = document.documentElement;
    return [Math.max(D.clientWidth, B.clientWidth),
      Math.max(D.clientHeight, B.clientHeight)];
  }
}

/**
 * 文件上传
 * @param {Array} imgList
 * @returns {Promise}
 */
export function handleImgUpdate(imgList) {
  return Promise.all(imgList.map(img => {
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(img.type) === -1)
      return Promise.reject(showAlert('图片类型不符合，请上传 jpeg、 jpg 或者 png 格式的图片！'))
    if (img.size > 1024*1024*10)
      return Promise.reject(showAlert('上传图片大小超出了10MB的限制！'))
    return http.httpPost('admin/file/ajaxUploadImg.do', {
      file: img
    }).then(data => data.data)
      .catch(err => err)
  }))
}
