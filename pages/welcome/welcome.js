const app = getApp()
Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.authorize) {
      wx.switchTab({url:'/pages/index/index'});
    }else{
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.switchTab({ url: '/pages/index/index' });
          }else{
            wx.redirectTo({
              url: '/pages/authorization/authorization'
            })
          }
        }
      });
    }
  }
})