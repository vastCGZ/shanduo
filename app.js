//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'localUser',
      success: function (res) {
        that.globalData.userInfo = res.data
      }
    });
  },

  globalData: {
    userInfo: null
  },
  host: 'https://yapinkeji.com/shanduoparty'
})