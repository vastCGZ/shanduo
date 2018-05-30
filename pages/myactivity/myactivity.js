// pages/myactivity/myactivity.js
const app = getApp();
var user;
var lat, lon;
var pageSize = 20;
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    activities: [{
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }, {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }, {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }],
    typeId: [4, 5, 6],
    host: null
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    this.emptyData();
    this.loadActivities();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return; }
    this.setData({ currentTab: cur });
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    var that = this;
    user = app.globalData.userInfo;
    that.setData({ host: app.host });
    wx.getLocation({
      success: function (res) {
        lat = res.latitude;
        lon = res.longitude;
        that.loadActivities();
      },
    })
    // 高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc
        });
      }
    });

  },
  loadActivities: function () {
    var that = this;
    wx.request({
      url: app.host + '/activity/showHotActivity',
      data: {
        token: user.token,
        page: that.data.activities[that.data.currentTab].currentPage,
        pageSize: pageSize,
        lat: lat,
        lon: lon,
        type: parseInt(that.data.typeId[that.data.currentTab])
      },
      dataType: 'json',
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.success && data.result.list.length > 0) {
          that.data.activities[that.data.currentTab].totalpage = data.result.totalpage;
          var array = that.data.activities[that.data.currentTab].arrayResult;
          that.data.activities[that.data.currentTab].arrayResult = array.concat(data.result.list);
          that.setData({ activities: that.data.activities });
        }
      }
    })
  },
  onReachBottom: function () {

  },
  onPullDownRefresh: function () {
    this.emptyData();
    this.loadActivities();
  },
  emptyData: function () {
    var ary = this.data.activities[this.data.currentTab].arrayResult;
    ary.splice(0, ary.length);
    this.data.activities[this.data.currentTab].arrayResult = ary;
    this.data.activities[this.data.currentTab].currentPage = 1;
    this.data.activities[this.data.currentTab].totalpage = 0;
    this.setData({
      activities: this.data.activities
    })
  },
  gotoAppraiseView: function () {
    wx.navigateTo({
      url: '/pages/activityevaluation_cy/activityevaluation_cy',
    })
  }, cancelRegistration: function (e) {
    var activityId = e.currentTarget.dataset.current;
    wx.showModal({
      title: '提醒',
      content: '确定取消吗?',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            data: {
              token: app.globalData.userInfo.token,
              activityId: activityId,
              type: 2
            },
            dataType: 'json',
            url: app.host + '/activity/joinActivities',
            success: (res) => {
              if (res.data.success) {
                wx.startPullDownRefresh({
                  complete: () => {
                    wx.stopPullDownRefresh();
                  }
                });
              }
            }
          })
        }
      }
    })
  }
})