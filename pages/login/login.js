//load.js
const util = require('../../utils/util.js')
//获取应用实例

const app = getApp()
var username, password;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onTap: function () {
    //保留当前页面,跳转到应用内某个页面
    wx.navigateTo({
      url: '../register/register',
    });
  },
  inputUserId: function (event) {
    username = event.detail.value;
  },
  inputPwd: function (event) {
    password = event.detail.value;
  },
  userLogin: function () {
    var that = this;
    if (!that.checkLoginInput((res) => {
      wx.showToast({
        title: res,
        icon: 'none',
        duration: 1000
      });
    })) {
      return;
    }
    app.globalData.tmpUser.username = username;
    app.globalData.tmpUser.password = password;
    wx.showLoading({
      title: '登陆中...',
    })
    wx.request({
      url: app.host + '/wechat/bindingUser',
      data: app.globalData.tmpUser,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          wx.setStorage({
            key: 'localUser',
            data: res.data.result
          })
          wx.showToast({
            title: '登陆成功',
            icon: 'success'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/personal/personal'
            });
          }, 1000);
          app.onLaunch();
        } else {
          wx.showToast({
            title: '登陆错误',
            image: '/image/icon/error.gif',
            duration:2000
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
      method: 'POST'
    })
  },
  checkLoginInput: function (cbErr) {
    if (!username || !util.checkInput(username)) {
      cbErr && cbErr('账号名没填');
      return false;
    }
    if (!password || !util.checkInput(password)) {
      cbErr && cbErr('密码没填');
      return false;
    }
    return true;
  },
  closeLoginView: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
