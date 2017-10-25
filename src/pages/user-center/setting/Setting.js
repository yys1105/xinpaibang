import ComplexInput from '../../../components/common/ComplexInput.vue'
import Collapse from 'iview/src/components/collapse'
import Panel from 'iview/src/components/collapse/panel.vue'
import IForm from 'iview/src/components/form'
import FormItem from 'iview/src/components/form/form-item.vue'
import IInput from 'iview/src/components/input'
import RadioGroup from 'iview/src/components/radio/radio-group.vue'
import Radio from 'iview/src/components/radio'
import Cascader from 'iview/src/components/cascader'
import IButton from 'iview/src/components/button'
import {
  Row,
  Col as ICol
} from 'iview/src/components/grid'
import {showAlert, getVerificationCode} from '../../../config/functions/'
import {BASE_URL} from '../../../config/const'

let panelState = {
  template: `
    <p class="clearfix setting-head">
      <slot></slot>
      <span class="panel-state">
        {{ currShow[0] === curr ? '收起' : '展开' }}
        <i class="iconfont icon-arrow" :class="{ 'rotate': currShow[0] === curr }"></i>
      </span>
    </p>
    `,

  props: {
    currShow: {
      type: [Array, String]
    },
    curr: {
      type: [String]
    }
  },

  name: 'panelState'
};

let associate = {
  template: `
      <Row>
        <i-col span="8">
          <span><i :class="associatedState"></i>&nbsp;绑定{{ associateData.label }}</span>
        </i-col>
        <i-col span="8">
          <span class="color-gray" v-if="!associateData.value">{{ '未绑定'+associateData.label }}</span>
          <span class="color-gray" v-else-if="associateData.label === '手机'">{{ associateData.value | encode }}</span>
          <span class="color-gray" v-else-if="associateData.label === 'QQ账号'">{{ associateData.value }}</span>
        </i-col>
        <i-col span="8">
          <a @click="associateData.func(hasAssociated)">{{ operateText }}</a>
        </i-col>
      </Row>
    `,
  props: {
    associateData: {
      type: Object
    }
  },

  components: {
    Row,
    ICol
  },

  computed: {
    hasAssociated () {
      return this.associateData.value
    },
    // classes
    associatedState () {
      return [
        'color-blue',
        'iconfont',
        {
          ['icon-gou']: this.associateData.value !== ''
        },
        {
          ['icon-gantanhaotishi']: this.associateData.value === ''
        }
      ]
    },
    operateText () {
      return !this.associateData.value ? `绑定${this.associateData.label}` : this.associateData.operateText
    }
  },

  name: 'associate'
};

export default {
  name: 'setting',

  components: {
    panelState,
    associate,
    ComplexInput,
    Collapse,
    Panel,
    IForm,
    FormItem,
    IInput,
    RadioGroup,
    Radio,
    Cascader,
    IButton,
  },

  data () {
    return {
      loadingAvatar: false,
      currShow: ['1'],
      casData: [],
      location: [],
      locationPlaceholder: '',
      confirmUnbind: false,
      pwd: '',
      loaded: false,
      // 1. 基础信息
      basic: {
        username: '',
        bio: '',
        gender: 'secrecy',
        intro: '',
        cityCode: '',
        districtCode: '',
        location: []
      },
      basicRuleInline: {
        username: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        bio: [
          { required: true, message: '请填写个性签名', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请填写个人简介', trigger: 'blur' }
        ],
        location: [
          { required: true, type: 'array', min: 2, message: '请选择地区', trigger: 'blur' },
        ]
      },
      // 2. 设置头像
      avatar: '',
      // 3. 修改密码
      modifyPwd: {
        currPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      modifyPwdRuleInline: {
        currPwd: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        newPwd: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.modifyPwd.confirmPwd !== '') {
              // 对第二个密码框单独验证
              this.$refs.modifyPwd.validateField('confirmPwd');
            }
            callback();
          }
        },
        confirmPwd: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.modifyPwd.newPwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        }
      },

      phoneNum: '',
      userInfo: {},
      // 修改电话号码弹出框
      isModalShow: false,
      boxType: '1',

      bindPhoneData: {
        phoneNum: '',
        picCode: '',
        code: ''
      },
      newPhoneData: {
        phoneNum: '',
        picCode: '',
        code: ''
      },
      changePhoneData: {
        phoneNum: '',
        picCode: '',
        code: ''
      },
      // counting down
      timeRemain: 0,
      timer: null,

      // 提交锁
      canSubmit: true,
      picCodeSrc: '',
      picCodeTimeTag: ''
    }
  },

  computed: {
    // 4. 账号关联
    associateList () {
      return [
        {label: '手机', value: this.$store.getters.userInfo.mobile, func: this.showBindPhoneModal, operateText: '更换手机'},
        {label: 'QQ账号', value: this.$store.getters.userInfo.qqNickname, func: this.bindQHandle, operateText: '解除QQ账号'}
      ]
    },

    requireQQ () {
      return BASE_URL + 'home/public/qqLogin.do'
    }
  },

  watch: {
    'basic.location' (val) {
      this.basic.provinceCode = val[0];
      this.basic.cityCode = val[1];
    },
    isModalShow (val) {
      val && this.getNewPicCode()
    }
  },

  created () {
    if (location.search) {
      location.href = location.origin+'/#/user-center/setting'
    } else {
      this.getUserInfo()
      this.getProvince()
      this.loaded = true
    }
  },

  methods: {
    // 获取用户完整信息
    getUserInfo () {
      this.$httpGet('home/user/getUserInform.do', {})
        .then(
          (data) => {
            ({
              head: this.avatar,
              mobile: this.phoneNum,
              nickname: this.basic.username,
              sex: this.basic.gender,
              signature: this.basic.bio,
              profile: this.basic.intro,
              provinceCode: this.basic.provinceCode,
              cityCode: this.basic.cityCode
            } = data.data);

            this.basic.location[0] = data.data.provinceCode;
            this.basic.location[1] = data.data.cityCode;

            this.userInfo = data.data;
            this.locationPlaceholder = data.data.address;
            this.changePhoneData.phoneNum = data.data.mobile;
            let params = {};
            for (let key of Object.keys(data.data)) {
              params[key] = data.data[key]
            }
            params.token = this.$store.getters.token;
            this.$store.dispatch('updateUserInfo', {userInfo: params})
          },
          (err) => {
            showAlert(err.message)
          }
        )
    },

    // 获取省 信息
    getProvince () {
      this.$httpGet('home/public/getProvince.do', {})
        .then(
          (data) => {
            let
              dataList = data.data,
              tempList = [];
            dataList.forEach((item) => {
              tempList.push({
                value: item.adcode,
                label: item.name,
                children: [],
                loading: false
              })
            });
            this.casData = tempList;
          },
          (err) => {
            showAlert(err.message)
          }
        )
    },

    /**
     *  获取市信息
     *  @params {Object} item, {Function} callback
     *  调用 callback 会自动展开二级菜单
     */
    getCity (item, callback) {
      item.loading = true;
      this.$httpGet('home/public/getCity.do', {
        parentAdcode: item.value
      }).then(
        (data) => {
          if (data.data.length === 0) {

            return
          }
          let
            dataList = data.data,
            tmpList = [];
          dataList.forEach((item) => {
            tmpList.push({
              value: item.adcode,
              label: item.name,
            })
          });
          item.loading = false;
          item.children = tmpList;
          callback();
        },
        (err) => {
          showAlert(err)
        }
      );
    },

    // 保存基本信息
    saveBasic (name) {
      if (!this.canSubmit) return;
      this.canSubmit = false;
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$httpPost('home/user/updateBaseInform.do', {
            nickName: this.basic.username,
            name: this.basic.username,
            sex: this.basic.gender,
            signature: this.basic.bio,
            profile: this.basic.intro,
            provinceCode: this.basic.provinceCode,
            cityCode: this.basic.cityCode
          }).then((data) => {
            showAlert(data.data);
            this.location = [];
            this.getUserInfo();
            this.canSubmit = true;
          }).catch(err => {
            showAlert(err.message);
            this.canSubmit = true;
          })
        } else {
          showAlert('表单不完整！')
          this.canSubmit = true;
        }
      })
    },

    // 当图片加载完成后取消 loading 效果
    imgLoaded () {
      this.loadingAvatar = false
    },

    /**
     * input file 内容改变了以后，将图片上传至库，并且分会图片 服务器路径
     * @param {Event} el
     */
    imgChange (el) {
      this.loadingAvatar = true;
      let
        files = el.target.files,
        img = files[files.length - 1];
      this.$httpPost('admin/file/ajaxUploadImg.do', {
        file: img
      }).then(data => {
          // 这里不需要设置 this.loadingAvatar = false; 因为如果设置了会有图片闪动，在 img 监听 load 去处理 this.loadingAvatar
          this.avatar = data.data;
        })
        .catch(err => {
          this.loadingAvatar = false;
          showAlert(err.message);
          this.getUserInfo();
        })
    },

    // 上传头像
    saveAvatar () {
      if (!this.canSubmit) return;
      this.canSubmit = false;
      this.$httpPost('home/user/updateHead.do', {
        headUrl: this.avatar
      })
        .then(data => {
          showAlert(data.data);
          this.getUserInfo();
          this.canSubmit = true;
        })
        .catch(err => {
          showAlert(err.message);
          this.getUserInfo();
          this.canSubmit = true;
        })
    },

    // 修改密码
    saveNewPwd () {
      if (!this.canSubmit) return;
      this.canSubmit = false;
      if (this.modifyPwd.newPwd !== this.modifyPwd.confirmPwd) {
        showAlert('两次密码不一样！');
        return
      }
      this.$httpPost('home/user/updatePassword.do', {
        pwd: this.modifyPwd.currPwd,
        newPwd: this.modifyPwd.newPwd
      }).then(
        (data) => {
          showAlert(data.data);
          this.getUserInfo();
          this.modifyPwd = {
            currPwd: '',
            newPwd: '',
            confirmPwd: ''
          };
          this.canSubmit = true;
        }).catch(err => {
          showAlert(err.message);
          this.getUserInfo();
          this.canSubmit = true;
        })
    },

    // 获取图片验证码
    getNewPicCode () {
      this.picCodeTimeTag = +new Date();
      this.picCodeSrc = BASE_URL + 'home/public/getPicVerificationCode.do?timeTag=' + this.picCodeTimeTag
    },

    // 获取验证码
    getCode(data) {
      if (!this.canSubmit) return;
      if (this.boxType === '2-2' && this.phoneNum === data.phoneNum) {
        showAlert("手机号不能相同！");
        return;
      }
      this.canSubmit = false;

      clearInterval(this.timer);
      getVerificationCode(data.phoneNum, false, data.picCode, this.picCodeTimeTag)
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
          this.canSubmit = true
        })
    },

    // 关闭弹出层
    closeBindPhoneModal() {
      this.isModalShow = false;
      // 清楚已有的数据
      this.bindPhoneData.code = '';
      this.bindPhoneData.phoneNum = '';
      this.newPhoneData.code = '';
      this.newPhoneData.phoneNum = '';

      this.picCodeSrc = '';
      this.picCodeTimeTag = ''
    },

    // 显示绑定手机弹出层
    showBindPhoneModal (val) {
      this.isModalShow = true;
      val === '' ? this.boxType = '1' : this.boxType = '2-1';
    },

    // 验证旧的手机号码
    verifyOldPhoneCode (param) {
      if (!this.canSubmit) return;
      this.canSubmit = false;
      if (param.code && param.phoneNum) {
        this.$httpPost('home/public/checkMobileCode.do', {
          mobile: param.phoneNum,
          mobileCode: param.code
        })
          .then(() => {
            this.boxType = '2-2';
            param.code = '';
            clearInterval(this.timer);
            this.timeRemain = 0;
            this.getNewPicCode();
            this.canSubmit = true;
          })
          .catch((err) => {
            showAlert(err.message);
            this.getNewPicCode();
            this.canSubmit = true;
          })
      }
    },

    // 绑定手机号码
    bindPhoneNum (param) {
      if (!this.canSubmit) return;
      this.canSubmit = false;
      if (param.code && param.phoneNum) {
        this.$httpPost('home/user/updateMobile.do', {
          mobile: param.phoneNum,
          mobileCode: param.code
        }).then(
          () => {
            this.isModalShow = false;
            param.code = '';
            param.phoneNum = '';
            this.getUserInfo();
            clearInterval(this.timer);
            this.timeRemain = 0;
            this.timer = null;
            this.getNewPicCode();
            this.canSubmit = true;
          }).catch((err) => {
            showAlert(err.message);
            this.getNewPicCode();
            this.canSubmit = true;
          })
      }
    },

    // 绑定qq 解绑 qq
    bindQHandle (param) {
      if (param) {
        // 解绑 qq
        this.confirmUnbind = true
      } else {
        // 绑定qq
        window.name = 'XPB_PageComeFrom' + +new Date()
        sessionStorage.setItem('BackWindowName', window.name)
        let token = this.$store.getters.token
        sessionStorage.setItem('bindToken', token)
        window.open(this.requireQQ+'?page=bind')
      }
    },

    unbindQ () {
      this.$httpPost('home/user/relieveBingQq.do', {
        token: this.$store.getters.token,
        pwd: this.pwd
      }).then(data => {
        this.getUserInfo()
        this.pwd = ''
        this.confirmUnbind = false
        showAlert(data.data)
      }).catch(err => {
        !!err.message && showAlert(err.message)
        window.console.log(err || err.message)
      })
    }
  }
}
