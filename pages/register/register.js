//register.js
const util = require('../../utils/util.js')
//获取应用实例

const app = getApp()
var interval = null //倒计时函数
var phone = null,
  auth_code = null,
  pwd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hint: '发送验证码',
    currentTime: 60
  },
  countDown: function (options) {
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
    phone = env.detail.value;
  },
  inputAuthCode: function (env) {
    auth_code = env.detail.value;
  },
  inputPwd: function (env) {
    pwd = env.detail.value;
  },
  sendMSM: function () {
    var that = this;
    if (phone && util.checkPhone(phone)) {
      wx.request({
        url: app.host + '/sms/envoyer',
        data: { phone: phone, typeId: 1 },
        dataType: 'json',
        success: function (res) {
          if (res.data.success) {
            that.setData({
              disabled: true
            })
            that.countDown();
            wx.showToast({
              title: res.data.result,
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
  checkRegisterInput: function (cbErr) {
    //!phone || !auth_code || !pwd
    if (!phone || !util.checkInput(phone) || !util.checkPhone(phone)) {
      cbErr && cbErr('手机号格式不对');
      return false;
    }
    if (!auth_code || !util.checkInput(auth_code)) {
      cbErr && cbErr('验证码没填');
      return false;
    }
    if (!pwd || !util.checkInput(pwd) || pwd.length < 8) {
      cbErr && cbErr('密码没填或长度不够');
      return false;
    }
    return true;
  },
  register: function () {
    if (!this.checkRegisterInput(function (res) {
      wx.showToast({
        title: res,
        icon: 'none',
        duration: 2000
      });
    })) {
      return;
    }
    app.globalData.tmpUser.username = phone;
    app.globalData.tmpUser.password = pwd;
    app.globalData.tmpUser.codes = auth_code;
    wx.request({
      url: app.host + '/wechat/bindingUser',
      data: app.globalData.tmpUser,
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          app.globalData.userInfo = res.data.result;
          wx.setStorage({
            key: 'localUser',
            data: res.data.result
          });
          wx.showToast({
            title: '注册成功',
            icon: 'none'
          });
          setTimeout(function(){
            wx.switchTab({ url: '/pages/personal/personal' });
          },1000);
        } else {
          wx.showToast({
            title: res.data.errorCode,
            icon: 'none'
          });
        }
      }
    })
  }
})