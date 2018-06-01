const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }, bindGetUserInfo: function (e) {
    var that = this;
    var errMsg = e.detail.errMsg.split(':')[1];
    if ("ok" === errMsg) {
      app.globalData.tmpUser.nickName = e.detail.userInfo.nickName;
      app.globalData.tmpUser.gender = e.detail.userInfo.gender == 1 ? 1 : 0
      wx.request({
        data: {
          openId: app.globalData.tmpUser.openId,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        dataType: 'json',
        url: app.host + '/wechat/getOpenid',
        success: (res) => {
          if (res.data.success) {
            wx.setStorage({
              key: 'localUser',
              data: res.data.result
            })
            app.onLaunch();
          } else {
            if (10086 == res.data.errCode) {
              var jsonVal = JSON.parse(res.data.errCodeDes);
              app.globalData.tmpUser.unionId = jsonVal.unionId;
            }
          }
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      });
    }
  }
})