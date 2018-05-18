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
    wx.getLocation({
      success: function (res) {
        var location = {};
        location.lat = res.latitude;
        location.lon = res.longitude;
        that.globalData.location = location;
      }
    });
  },

  globalData: {
    userInfo: null,
    location: null
  },
  host: 'https://yapinkeji.com/shanduoparty'
})