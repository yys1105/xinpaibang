<template>
  <div class="login-guide">
    <app-header :show="true"></app-header>
    <div class="card-style" v-if="needBind">
      <div class="logo">
        <img src="../assets/images/logo_tiny.png" alt="">
      </div>
      <p align="center"><a class="title">绑定手机号码</a></p>
      <form class="form-area">
        <complex-input v-model="phone" type="text" placeholder="绑定手机号码"></complex-input>
        <br>
        <complex-input v-model="picCode" type="text" placeholder="图片验证码">
          <button
            type="button"
            slot="append"
            @click="getNewPicCode()">
            <img
              :src="picCodeSrc"
              alt="图片验证"
              title="点击更换图片"
              style="position: absolute; left: 0; top: 0;height: 46px">
          </button>
        </complex-input>
        <br>
        <complex-input v-model="code" placeholder="短信验证码">
          <button
            type="button"
            slot="append"
            @click="getMobileCode"
            :disabled="timeRemain !== 0">{{ timeRemain === 0 ? '获取验证码' : timeRemain }}
          </button>
        </complex-input>
        <br>
        <i-button type="primary" long style="height: 48px" @click="loginWidthBind">绑定并登录</i-button>

      </form>
    </div>
    <p v-else>{{showText || '正在跳转...'}}</p>
  </div>
</template>
<script>
  import complexInput from '../components/common/ComplexInput.vue'
  import AppHeader from '../components/layout/AppHeader.vue'
  import IButton from 'iview/src/components/button'
  import {BASE_URL} from '../config/const'
  import {getVerificationCode, showAlert} from '../config/functions'

  export default {
    name: 'guide',

    components: {
      complexInput,
      IButton,
      AppHeader
    },

    data() {
      return {
        phone: '',
        picCode: '',
        code: '',
        timeRemain: 0,
        picCodeTimeTag: '',
        picCodeSrc: '',
        timer: null,
        canSubmit: false,
        needBind: false,
        openId: '',
        qqNickName: '',
        showText: ''
      }
    },

    methods: {
      /**
       * 获取图片验证码
       */
      getNewPicCode() {
        this.picCodeTimeTag = +new Date();
        this.picCodeSrc = BASE_URL + 'home/public/getPicVerificationCode.do?timeTag=' + this.picCodeTimeTag
      },

      // 检查 url 是否要为登录或者绑定账号
      checkParam() {
        // 清除相关登陆数据
        this.$store.dispatch('signOut')
        let params = {}
        decodeURI(window.location.hash).split('?')[1].split('&').map((item) => {
          return Object.assign(params, {[item.split('=')[0]]: item.split('=')[1]})
        })

        console.log(params);
        let
          statusCode = params.statusCode,
          tag = params.tag,
          token = params.data,
          openId = params.openId,
          qqNickName = params.qqNickName
        // 如果已经绑定则登陆成功，跳转页面
        if (+statusCode === 200 && tag === 'loginSuccess') {
          this.$httpGet('home/user/getUserInform.do', {
            'token': token
          }).then((data) => {
            this.$store.dispatch('signIn', {
              userInfo: Object.assign(data.data, {'token': params.data}),
              rememberMe: true
            }).then(() => {
              let backPage = sessionStorage.getItem('BackWindowName')
              window.open(window.location.origin, backPage)
              window.close()
            })
          }).catch(err => {
            showAlert(err.message || err)
          })
        } else if (+statusCode === 200 && tag === 'bind') {
          console.log(params)
          this.needBind = true
          this.canSubmit = true
          this.openId = params.openId
          this.qqNickName = params.qqNickName
        } else if (+statusCode === 200 && tag === 'bindQq') {
          this.$httpPost('/home/user/BingQq.do', {
            'token': window.sessionStorage.getItem('bindToken'),
            'openId': openId,
            'qqNickName': qqNickName
          }).then(data => {
            console.log(data)
            let backPage = sessionStorage.getItem('BackWindowName')
            window.open(window.location.origin+'?key=1/#/user-center', backPage)
            window.close()
          }).catch(err => {
            showAlert(err.message || err)
            let backPage = sessionStorage.getItem('BackWindowName')
            window.open(window.location.origin+'?key=1/#/user-center', backPage)
            window.close()
          })
        } else if (+statusCode !== 200) {
          showAlert(params.message)
          let n = 5
          let timer = setInterval(() => {
            this.showText = params.message+`, ${n--}秒后关闭当前网页。`
            if (+n === 0) {
              clearInterval(timer)
              window.close()
            }
          }, 1000)
        }
      },

      // 获取手机 code
      getMobileCode() {
        if (!this.canSubmit) return;
        this.canSubmit = false;
        clearInterval(this.timer);
        getVerificationCode(this.phone, false, this.picCode, this.picCodeTimeTag)
          .then(() => {
            this.timeRemain = 60;
            this.timer = setInterval(() => {
              if (this.timeRemain > 0) {
                this.timeRemain -= 1
              } else {
                clearInterval(this.timer)
              }
            }, 1000);
            this.canSubmit = true;
          })
          .catch(() => {
            this.getNewPicCode();
            this.canSubmit = true;
          })
      },

      // 登录并且绑定qq信息
      loginWidthBind() {
        this.$httpPost('home/public/bindOrLoginQq.do', {
          openId: this.openId,
          qqNickName: this.qqNickName,
          mobile: this.phone,
          mobileCode: this.code
        }).then((data) => {
          this.$store.dispatch('signIn', {userInfo: data.data, rememberMe: true})
            .then(() => {
              let backPage = sessionStorage.getItem('BackWindowName')
              console.log(backPage)
              window.open(window.location.origin, backPage)
              window.close()
            })
        }).catch((err) => {
          showAlert(err.message || err)
        })
      }
    },

    created() {
      this.getNewPicCode()
      this.checkParam()
    },

    // beforeRouteEnter(to, from, next) {
    //   console.log(from)
    // }
  }
</script>

<style scoped lang="stylus">
  @import '../assets/style/variables.styl'

  .login-guide
    width 650px
    padding 10px 30px 50px
    .card-style
      padding 40px

  .logo
    width 225px
    margin 0 auto
    img
      width 100%
    & + p
      margin 20px 0
      .title
        color #333
        text-decoration none
        display inline-block
        font-size 20px
        padding 10px 0
        border-bottom 1px solid $sky
        &:hover
          color #57a3f3

  .form-area
    width 400px
    margin 20px auto
</style>
