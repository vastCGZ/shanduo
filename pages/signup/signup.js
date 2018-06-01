// pages/signup/signup.js
const app = getApp();
var util = require('../../utils/util.js');
var activityId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: null,
    activity: null,
    participant: [],
    joinActivity: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    activityId = options.activityId;
    this.setData({ host: app.host });
    this.loadActivityDetail();
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
    return {
      title: '闪多活动',
      path: '/pages/signup/signup?activityId=' + activityId + ''
    }
  },
  loadActivityDetail: function () {
    var that = this
    var token = ''
    if (app.globalData.userInfo) {
      token = app.globalData.userInfo.token;
    }
    wx.request({
      data: {
        token: token,
        activityId: activityId
      },
      dataType: 'json',
      url: app.host + '/activity/oneActivity',
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          that.setData({ participant: res.data.result.resultList, activity: res.data.result.activityInfo, joinActivity: res.data.result.joinActivity == 0 ? false : true })
        }
      }
    })
  }
  , confirmation: function () {
    var that = this;
    if (!app.globalData.userInfo) {
      util.toast('登录后操作');
      return;
    }
    wx.request({
      data: {
        token: app.globalData.userInfo.token,
        activityId: activityId,
        type: that.data.joinActivity ? 2 : 1
      },
      dataType: 'json',
      url: app.host + '/activity/joinActivities',
      success: (res) => {
        if (res.data.success) {
          util.toast(res.data.result);
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        }
      }
    })
  }
})