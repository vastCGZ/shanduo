const app = getApp()
Page({
  onLoad: function (options) {
    var that = this;
    if (!app.globalData.authorize) {
      wx.getSetting({
        success: function (res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.redirectTo({
              url: '/pages/authorization/authorization'
            })
          }else{
            wx.switchTab({ url: '/pages/index/index' });
          }
        }
      });
    } else {
      wx.switchTab({ url: '/pages/index/index' });
    }
  }
})