//register.js
const util = require('../../utils/util.js')
//获取应用实例

const app = getApp()
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    auth_code: null,
    pwd: null,
    hint: '发送验证码',
    currentTime: 60
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        hint: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          hint: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  onTap: function () {
    //返回上一页面或者多级页面
    wx.navigateBack({
      delta: 1
    });
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
    that.getCode();
    that.setData({
      disabled: true
    })
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