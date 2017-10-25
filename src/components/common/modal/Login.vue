<template>
  <div class="login-box modal" @mousewheel.prevent.stop="handleMouseWheel">
    <div class="login-content" :style="marginTopToZero && { 'margin-top': 0 }" v-if="!findBack">
      <p class="text-right">
        <Icon type="close-round" class="icon-close" @click.native="closeModal"></Icon>
      </p>
      <div class="logo">
        <img src="../../../assets/images/logo.png" alt="">
      </div>
      <div class="tab-list" @click="changePanel">
        <span class="tab">登录</span>
        <span class="tab">注册</span>
        <span class="tab-underline" :style="underlineStyle"></span>
      </div>

      <div class="tab-content-list">

        <!-- 登录 -->
        <div class="tab-content-item" v-if="panelShow === 'login'" @keyup.enter="login">
          <complex-input v-model="loginInfo.phoneNum" type="text" placeholder="手机号码"></complex-input>
          <br>
          <complex-input v-model="loginInfo.password" type="password" placeholder="密码"></complex-input>
          <div class="login-meta clearfix">
            <Checkbox v-model="loginInfo.remember" class="remember-me">&emsp;记住我</Checkbox>
            <a class="forget" @click="findBack = !findBack">忘记密码？</a>
          </div>
          <IButton type="primary" long style="height: 48px;margin: 12px 0;" @click="login">确认提交</IButton>
          <div class="other-way">
            <span>社交账号登录</span>
            <!--<span class="other-way-item">-->
            <!--<i class="iconfont icon-wechat"></i>-->
            <!--</span>-->
            <span class="other-way-item">
              <a @click="qqLogin" class="iconfont icon-qq"></a>
            </span>
          </div>
        </div>

        <!-- 注册 -->
        <form id="registerForm" class="tab-content-item" v-if="panelShow === 'register'" @keyup.enter="signUp">
          <complex-input v-model="registerInfo.phoneNum" type="text" placeholder="手机号码"></complex-input>
          <br>
          <complex-input v-model="registerInfo.picCode" type="text" placeholder="图片验证码">
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
          <complex-input v-model="registerInfo.code" placeholder="短信验证码">
            <button
              type="button"
              slot="append"
              @click="getMobileCode(registerInfo)"
              :disabled="timeRemain !== 0">{{ timeRemain === 0 ? '获取验证码' : timeRemain }}
            </button>
          </complex-input>
          <br>
          <complex-input v-model="registerInfo.password" type="password" placeholder="密码"></complex-input>
          <br>
          <Checkbox v-model="isAgree">&emsp;阅读并同意<a style="font-size: 12px;">《新牌榜服务协议》</a></Checkbox>
          <IButton type="primary" :disabled="!isAgree" long style="height: 48px;margin: 12px 0;" @click="signUp">注册
          </IButton>
        </form>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="login-content" :style="marginTopToZero && { 'margin-top': 0 }" v-if="findBack" @keyup.enter="retrieve">
      <p class="text-right">
        <Icon type="close-round" class="icon-close" @click.native="closeModal"></Icon>
      </p>
      <div class="logo">
        <img src="../../../assets/images/logo.png" alt="">
      </div>
      <div class="tab-list">
        <span class="tab">忘记密码</span>
      </div>
      <div class="tab-content-list">
        <div class="tab-content-item">
          <complex-input v-model="retrieveInfo.phoneNum" type="text" placeholder="手机号码"></complex-input>
          <br>
          <complex-input v-model="retrieveInfo.picCode" placeholder="图片验证码">
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
          <complex-input v-model="retrieveInfo.code" placeholder="短信验证码">
            <button
              type="button"
              slot="append"
              @click="getMobileCode(retrieveInfo)"
              :disabled="timeRemain !== 0">{{ timeRemain === 0 ? '获取验证码' : timeRemain }}
            </button>
          </complex-input>
          <br>
          <complex-input v-model="retrieveInfo.newPwd" type="password" placeholder="输入新密码"></complex-input>
          <br>
          <complex-input v-model="retrieveInfo.newPwdAgain" type="password" placeholder="再次输入新密码"></complex-input>
          <br>
          <i-button type="primary" :disabled="!canRetrieve" long style="height: 48px;margin: 12px 0;" @click="retrieve">
            确认提交
          </i-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ComplexInput from '../ComplexInput.vue'
  import IButton from 'iview/src/components/button';
  import Checkbox from 'iview/src/components/checkbox';
  import Icon from 'iview/src/components/icon';
  import {showAlert, getVerificationCode} from '../../../config/functions/index'
  import {BASE_URL} from '../../../config/const'

  export default {
    name: 'login-box',

    data() {
      return {
        isAgree: true,
        findBack: false,

        loginInfo: {
          phoneNum: '',
          password: '',
          remember: false
        },

        registerInfo: {
          phoneNum: '',
          code: '',
          picCode: '',
          password: ''
        },

        retrieveInfo: {
          phoneNum: '',
          picCode: '',
          code: '',
          newPwd: '',
          newPwdAgain: ''
        },
        canSubmit: true,
        timeRemain: 0,
        picCodeSrc: '',
        picCodeTimeTag: '',
        marginTopToZero: false
      }
    },

    computed: {
      requireQQ() {
        return BASE_URL + 'home/public/qqLogin.do'
      },
      panelShow() {
        return this.$store.state.loginModal.currentShow
      },

      underlineTrans() {
        return this.panelShow === 'login' ? 0 : 114
      },

      underlineStyle() {
        return {
          display: 'block',
          transform: 'translate3d(' + this.underlineTrans + 'px, 0px, 0px)',
          width: '27px'
        }
      },

      canRetrieve() {
        let {
          phoneNum,
          code,
          newPwd,
          newPwdAgain
        } = this.retrieveInfo;
        return !!(phoneNum && code && newPwd && newPwdAgain)
      }
    },

    created() {
      this.getNewPicCode();

      $(window).resize(() => {
        let windowHeight = $(window).height();
        windowHeight < 585 ? (this.marginTopToZero = true) : (this.marginTopToZero = false)
      })
    },

    methods: {
      handleMouseWheel() {},

      qqLogin() {
        window.name = 'XPB_PageComeFrom' + +new Date();
        sessionStorage.setItem('BackWindowName', window.name);
        window.open(this.requireQQ);
      },

      closeModal() {
        console.log(this.$route);
        this.$route.meta.auth && this.$router.push({name: 'home'}); // 如果在 写作或者 用户中心，用户关闭了登陆，则跳转到首页
        this.$store.dispatch('updateLoginState', false);
        this.$store.dispatch('changeLoginShow', 'login');          // 将 登录框默认的 panel 调整到 login
      },

      /**
       * 切换 登录/注册
       * @param event
       */
      changePanel(event) {
        let target = event.target;
        if (target.nodeName === 'DIV' || target.className.indexOf('tab') === '-1') {
          return
        }
        if (target.textContent === '登录') {
          this.$store.dispatch('changeLoginShow', 'login')
        } else if (target.textContent === '注册') {
          this.$store.dispatch('changeLoginShow', 'register')
        }
      },

      /**
       * LoginModal框-登录
       */
      login() {
        if (!this.canSubmit) return;
        this.canSubmit = false;

        if (!this.loginInfo.phoneNum) {
          showAlert('请填写手机号码！');
          this.canSubmit = true;
          return
        } else if (!this.loginInfo.password) {
          showAlert('请填写密码！');
          this.canSubmit = true;
          return
        }

        this.$httpPost('home/public/login.do', {
          mobile: this.loginInfo.phoneNum,
          pwd: this.loginInfo.password
        }).then(
          (data) => {
            this.$store.dispatch('signIn', {userInfo: data.data, rememberMe: this.loginInfo.remember});
            showAlert("登录成功！");
            this.$store.dispatch('updateLoginState', false);
            this.canSubmit = true;
            window.location.reload()
          },
          (err) => {
            showAlert(err.message);
            this.canSubmit = true;
          }
        )
      },

      /**
       * LoginModal框-注册
       */
      signUp() {
        if (!this.isAgree) return;
        if (!this.canSubmit) return;
        let {
          phoneNum: mobile,
          code: mobileCode,
          password: password,
        } = this.registerInfo;
        if (!mobile || !mobileCode || !password) {
          showAlert('请完整填写注册信息');
          return
        }
        this.canSubmit = false;
        this.$httpPost('home/public/regist.do', {
          mobile: mobile,
          mobileCode: mobileCode,
          pwd: password
        }).then((data) => {
          showAlert(data.data);
//          this.panelShow = 'login'
          this.loginInfo.phoneNum = mobile;
          this.$store.dispatch('changeLoginShow', 'login');
          this.registerInfo = {
            phoneNum: '',
            code: '',
            picCode: '',
            password: ''
          };
          this.canSubmit = true;
          this.$httpPost('home/public/login.do', {
            mobile: mobile,
            pwd: password
          }).then((data) => {
            this.$store.dispatch('signIn', {userInfo: data.data, rememberMe: this.loginInfo.remember});
//            showAlert("登录成功！");
            this.$store.dispatch('updateLoginState', false);
            window.location.reload();
          })
        }).catch((err) => {
          showAlert(err.message);
          this.canSubmit = true;
        })
      },

      /**
       * 登录获取验证码部分
       * @param { Object } data: 获取注册或是忘记密码 'register' or 'retrieve'的手机号码
       */

      getMobileCode(data) {
        if (!this.canSubmit) return;
        this.canSubmit = false;
        clearInterval(this.timer);
        getVerificationCode(data.phoneNum, this.panelShow === 'register', data.picCode, this.picCodeTimeTag)
          .then(
            () => {
              this.timeRemain = 60;
              this.timer = setInterval(() => {
                if (this.timeRemain > 0) {
                  this.timeRemain -= 1
                } else {
                  clearInterval(this.timer)
                }
              }, 1000);
              this.canSubmit = true;
            },
            () => {
              this.getNewPicCode();
              this.canSubmit = true;
            }
          )
      },

      /**
       * 找回密码
       * home/public/changePassword.do
       */
      retrieve() {
        if (!this.canRetrieve) return;
        if (!this.canSubmit) return;
        this.canSubmit = false;

        if (this.canRetrieve) {
          let {
            phoneNum: mobile,
            code: mobileCode,
            newPwd: pwd
          } = this.retrieveInfo;

          this.$httpPost('home/public/changePassword.do', {
            mobile: mobile,
            mobileCode: mobileCode,
            pwd: pwd
          }).then(
            (data) => {
              this.loginInfo.phoneNum = mobile
              showAlert(data.data);
              this.findBack = !this.findBack;
              this.canSubmit = true
            },
            (err) => {
              showAlert(err.message);
              this.canSubmit = true
            }
          )
        } else {
          showAlert('请填写完整重置密码信息！');
          this.canSubmit = true
        }
      },

      getNewPicCode() {
        this.picCodeTimeTag = +new Date();
        this.picCodeSrc = BASE_URL + 'home/public/getPicVerificationCode.do?timeTag=' + this.picCodeTimeTag
      }

    },


    components: {
      ComplexInput,
      IButton,
      Icon,
      Checkbox
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../../../assets/style/variables.styl'

  .login-box
    .login-content
      width 628px
      min-height 550px
      max-height 100%
      overflow auto
      background #fff url("../../../assets/images/login_background.png") no-repeat bottom
      margin 5% auto 0
      padding 25px
      position relative
      .icon-close
        cursor pointer
      .logo
        width 220px
        overflow hidden
        margin 15px auto 0
        img
          width 100%
      .tab-list
        margin 25px auto 0
        text-align center
        position relative
        width 150px
        overflow hidden
        .tab:only-child
          float none
          display inline-block
          border-bottom 2px solid $sky
          height 32px
        .tab
          float left
          line-height 2
          cursor pointer
          .active
            color $sky
        .tab + .tab
          margin-left 86px
        .tab-underline
          position absolute
          bottom 0
          left 0
          border 1px solid $sky
          z-index 1
          transition transform .3s
      .tab-content-list
        margin 18px auto 0
        width 354px
        .tab-content-item
          display block
          width 354px
      .login-meta
        margin-top 38px
        .remember-me
          float left
        .forget
          font-size 12px
          float right
          color #999
          &:hover
            color $sky
      .other-way
        font-size 14px
        color #999
        .iconfont
          font-size 20px
          margin-left 10px
          text-decoration none
          color #999
          &:hover
            color #57a3f3

        .other-way-item
          cursor pointer


</style>
