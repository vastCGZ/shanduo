//load.js
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
    username: null,
    password: null
  },
  onTap: function () {
    //保留当前页面,跳转到应用内某个页面
    wx.navigateTo({
      url: '../register/register',
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
  inputUserId: function (event) {
    this.setData({ username: event.detail.value })
  },
  inputPwd: function (event) {
    this.setData({ password: event.detail.value })
  },
  userLogin: function () {
    var that = this;
    wx.showLoading({
      title: '登陆中...',
    })
    wx.request({
      url: app.host + '/juser/loginuser',
      data: {
        username: that.data.username,
        password: that.data.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          app.globalData.userInfo = res.data.result
          wx.setStorage({
            key: 'localUser',
            data: res.data.result
          })
          wx.showModal({
            title: '提示',
            content: '登陆成功'
          })
          wx.switchTab({
            url: '/pages/personal/personal'
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '用户名或密码错误'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '访问错误'
        })
      },
      complete: function () {
        wx.hideLoading()
      },
      method: 'GET'
    })
  }
})
