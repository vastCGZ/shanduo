const app = getApp();
var toastutil = require('../../utils/util.js');
var webim = require('../../utils/webim.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  logout: function () {
    wx.showModal({
      title: '系统提示',
      content: '确定退出当前账号？',
      success: (res) => {
        if (res.confirm) {
          webim.logout((res) => {
            app.globalData.userInfo = null,
              wx.clearStorage();
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/personal/personal',
                })
              },1000);
            app.onLaunch();
          }, (res) => {

          });
        }
      }
    })
  }, gotoSecurityView: function () {
    wx.navigateTo({
      url: '/pages/security/security'
    })
  }, gotoAboutView: function () {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  }
})