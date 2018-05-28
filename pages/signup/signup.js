// pages/signup/signup.js
const app = getApp();
var activityId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:null,
    activity:null,
    participant:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    activityId = options.activityId;
    this.setData({host:app.host});
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

  },
  loadActivityDetail: function () {
    var that = this;
    wx.request({
      data: {
        token: app.globalData.userInfo.token,
        activityId: activityId
      },
      dataType: 'json',
      url: app.host + '/activity/oneActivity',
      success: (res) => {
        console.log(res);
        if(res.data.success){
          that.setData({ participant: res.data.result.resultList, activity: res.data.result.activityInfo})
        }
      }
    })
  }
  , confirmation:function(){
    wx.request({
      data:{
        token: app.globalData.userInfo.token,
        activityId:activityId,
        type:1
      },
      dataType:'json',
      url: app.host +'/activity/joinActivities',
      success:(res)=>{
        console.log(res);
      }
    })
  }
})