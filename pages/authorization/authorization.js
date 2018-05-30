const app=getApp();
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
    var errMsg = e.detail.errMsg.split(':')[1];
    if ("ok" === errMsg) {
      wx.request({
        data:{
          openId: app.globalData.openId,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        dataType:'json',
        url: app.host +'/wechat/getOpenid',
        success:(res)=>{
          console.log(res);
        }
      })
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})