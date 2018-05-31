const app = getApp();
var date_util = require('../../utils/date_util.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: null,
    dynamics: {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    },
    pageSize: 20,
    lat: 0,
    lon: 0,
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ host: app.host });
    wx.getLocation({
      success: function (res) {
        that.setData({ lat: res.latitude, lon: res.longitude });
        that.loadDynamics();
      },
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.emptyData();
    this.loadDynamics(true);
  },
  //上拉加载更多
  onReachBottom: function () {
    var currentIndex = this.data.dynamics.currentPage;
    if (this.data.dynamics.totalpage > currentIndex) {
      this.data.dynamics.currentPage = parseInt(currentIndex) + 1;
      this.setData({ dynamics: this.data.dynamics });
      this.getActivityData();
    } else {
      util.toast('没有更多')
    }

  },
  loadDynamics: function (refresh) {
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.host + '/jdynamic/dynamicList',
      data: {
        token: app.globalData.userInfo.token,
        typeId: 3,
        lat: that.data.lat,
        lon: that.data.lon,
        page: that.data.dynamics.currentPage,
        pageSize: that.data.pageSize
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          var newData = res.data.result.list;
          if (newData.length > 0) {
            var oldData = that.data.dynamics.arrayResult;
            for (var i in newData) {
              newData[i].createDate = date_util.formatMsgTime(newData[i].createDate);
            }
            that.data.dynamics.arrayResult = oldData.concat(newData);
            that.data.dynamics.totalpage = res.data.result.totalPage;
            that.setData({ dynamics: that.data.dynamics });
          }
        }
      }, complete: () => {
        wx.hideLoading();
        if (refresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  }, emptyData: function () {
    var that = this;
    var ary = that.data.dynamics.arrayResult;
    ary.splice(0, ary.length);
    that.data.dynamics.arrayResult = ary;
    that.data.dynamics.currentPage = 1;
    that.data.dynamics.totalpage = 0;
    that.setData({
      dynamics: that.data.dynamics
    })
  },
  pushDynamic: function () {
    wx.navigateTo({ url: '/pages/release_dt/release_dt' });
  },
  share: function () {
    this.setData({ isShow: true });
  },
  closeDialog: function () {
    if (this.data.isShow) {
      this.setData({ isShow: false });
    }
  }
})