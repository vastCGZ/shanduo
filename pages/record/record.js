const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statements: {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    },
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadStatements();
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
    this.emptyData();
    this.loadStatements(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var currentIndex = this.data.statements.currentPage;
    if (this.data.statements.totalpage > currentIndex) {
      this.data.statements.currentPage = parseInt(currentIndex) + 1;
      this.setData({ statements: this.data.statements });
      this.loadStatements();
    } else {
      util.toast('没有更多')
    }
  },
  emptyData: function () {
    var ary = this.data.statements.arrayResult;
    ary.splice(0, ary.length);
    this.data.statements.arrayResult = ary;
    this.data.statements.currentPage = 1;
    this.data.statements.totalpage = 0;
    this.setData({
      statements: this.data.statements
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadStatements: function (refresh) {
    var that = this;
    wx.request({
      url: app.host + 'jmoney/moneyList',
      data: {
        token: app.globalData.userInfo.token,
        page: that.data.statements.currentPage,
        pageSize: that.data.pageSize
      },
      success: (res) => {
        if (res.data.success && res.data.result.list.length > 0) {
          var newData = res.data.result.list;
          for (var i in newData) {
            newData[i].createDate = util.getLocalTime(newData[i].createDate/1000);
          }
          var oldArrayResult = that.data.statements.arrayResult;
          that.data.statements.arrayResult = oldArrayResult.concat(newData);
          that.data.statements.totalpage = res.data.result.totalPage;
          that.setData({ statements: that.data.statements });
        }
      },
      complete: () => {
        if (refresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  }
})