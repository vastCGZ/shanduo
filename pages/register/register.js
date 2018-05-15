//register.js
const util = require('../../utils/util.js')
//获取应用实例

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus_1: true,
    focus_2: true,
    focus_3: true,
    focus_4: true,
    phone: null,
    auth_code: null,
    pwd: null,
    hint: '发送验证码'
  },
  onTap: function () {
    //返回上一页面或者多级页面
    wx.navigateBack({
      delta: 1
    });
  },
  focusInputEvent1: function () {
    this.setData({
      focus_1: false
    })
  },
  blurInputEvent1: function () {
    this.setData({
      focus_1: true
    })
  },
  focusInputEvent2: function () {
    this.setData({
      focus_2: false
    })
  },
  blurInputEvent2: function () {
    this.setData({
      focus_2: true
    })
  },
  focusInputEvent3: function () {
    this.setData({
      focus_3: false
    })
  },
  blurInputEvent3: function () {
    this.setData({
      focus_3: true
    })
  },
  tapfocus: function (e) {
    this.setData({
      focus_4: !this.data.focus_4
    })
  },
  inputPhone: function (env) {
    this.setData({ phone: env.detail.value });
  },
  inputAuthCode: function (env) {
    this.setData({ auth_code: env.detail.value });
  },
  inputPwd: function (env) {
    this.setData({ pwd: env.detail.value });
  },
  sendMSM: function () {
    var that = this;
    if (this.data.phone) {
      wx.request({
        url: app.host + '/sms/envoyer',
        data: { phone: that.data.phone, typeId: 1 },
        dataType: 'json',
        success: function (res) {
          if (res.success) {
            wx.showToast({
              title: res.result,
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  register: function () {
    var phone = this.data.phone;
    var code = this.data.auth_code;
    var pwd = this.data.pwd;
    if (!phone || !code || !pwd) {
      wx.showToast({
        title: '请输入注册信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.request({
      url: app.host + '/juser/saveuser',
      data: {
        phone: phone,
        code: code,
        password: pwd
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data);
        if (res.data.success) {
          app.globalData.userInfo = res.data.result;
          wx.setStorage({
            key: 'localUser',
            data: res.data.result
          });
          wx.showToast({
            title: '注册成功',
            icon: 'none',
            duration: 2000
          });
          wx.switchTab({ url: '/pages/index/index' });
        } else {
          wx.showToast({
            title: res.data.errorCode,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  }
})