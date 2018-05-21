// pages/myactivity/myactivity.js
const app = getApp();
var user;
var location;
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
    }]
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
    this.setData({ currentTab: cur })
    this.emptyData();
    this.loadActivities();
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
    location = app.globalData.location;
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
    that.loadActivities();
  },
  loadActivities: function () {
    var that = this;
    wx.request({
      url: app.host + '/activity/showOneActivity',
      data: {
        token: user.token,
        page: that.data.activities[that.data.currentTab].currentPage,
        pageSize: pageSize,
        lat: location.lat,
        lon: location.lon,
        type: parseInt(that.data.currentTab) + 1
      },
      dataType: 'json',
      method: 'GET',
      success: function (res) {
        var data = res.data;
        console.log(data);
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
  }
})