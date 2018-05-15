//app.js
<<<<<<< HEAD
=======
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
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
