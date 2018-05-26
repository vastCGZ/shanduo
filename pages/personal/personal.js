const app = getApp();
var toastutil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    headImg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var localUserInfo = app.globalData.userInfo;
    if (!localUserInfo) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
    } else {
      this.setData({ userInfo: localUserInfo });
      if (localUserInfo.picture) {
        this.setData({ headImg: app.host + '/picture/' + localUserInfo.picture })
      }

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gotoMydynamicView: function () {
    wx.navigateTo({
      url: '/pages/mydynamic/mydynamic'
    })
  },
  gotoMyActivityView: function () {
    wx.navigateTo({
      url: '/pages/myactivity/myactivity'
    })
  },
  signin: function () {
    var that = this;
    wx.request({
      url: app.host + '/experience/signin',
      data: { token: app.globalData.userInfo.token },
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          toastutil.toast(res.data.result);
        } else {
          toastutil.toast(res.data.errorCode);
        }
      }
    })
  }, getoSettingView: function () {
    wx.navigateTo({
      url: '/pages/setup/setup',
    })
  }, gotoMyWalletView: function () {
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  }, gotoMemberCenterView: function () {
    wx.navigateTo({
      url: '/pages/vipcore/vipcore',
    })
  }
})