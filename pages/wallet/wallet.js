const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WalletInfo: {
      beans: 0,
      money: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadWalletInfo();
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
  //钱包信息
  loadWalletInfo: function () {
    var that = this;
    wx.request({
      url: app.host + 'jmoney/getmoney',
      data: {
        token: app.globalData.userInfo.token
      },
      success: (res) => {
        if (res.data.success) {
          var WalletInfo = that.data.WalletInfo;
          WalletInfo.beans = res.data.result.beans;
          WalletInfo.money = res.data.result.money;
          that.setData({ WalletInfo: WalletInfo })
        }
      }
    })
  }, 
  //交易记录
  gotoStatementsView:function(){
    wx.navigateTo({
      url: '/pages/record/record'
    })
  }
})