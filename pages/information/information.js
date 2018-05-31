const app = getApp();
var date_util = require('../../utils/date_util.js');
var util = require('../../utils/util.js');
var webimhandler = require('../../utils/webim_handler.js');
var otherUserId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0 //tab标题的滚动条位置
    , otherUser: null
    , host: null,
    activitys: {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    },
    dynamics: {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }, pageSize: 20,
    lat: 0,
    lon: 0
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    this.emptyData();
    if (this.data.currentTab == 0) {
      this.getActivityData();
    } else {
      this.getDynamicData();
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
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
  onLoad: function (options) {
    var that = this;
    otherUserId = options.otherUserId;
    that.setData({ host: app.host })
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
    wx.getLocation({
      success: function (res) {
        that.setData({ lat: res.latitude, lon: res.longitude });
      }
    });
    this.loadUserDetail();
    this.getActivityData();
  }
  , loadUserDetail: function () {
    var that = this;
    wx.request({
      data: {
        token: app.globalData.userInfo.token,
        userId: otherUserId
      },
      url: app.host + '/jattention/userdetails',
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          that.setData({ otherUser: res.data.result })
        }
      }
    })
  },
  //远程获取活动数据
  getActivityData: function (refresh) {
    wx.showLoading();
    var that = this;
    wx.request({
      url: app.host + '/activity/showHotActivity',
      data: {
        token: app.globalData.userInfo.token,
        type: 7,
        lon: that.data.lon,
        lat: that.data.lat,
        page: that.data.activitys.currentPage,
        pageSize: that.data.pageSize,
        userId: otherUserId
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          var array = that.data.activitys.arrayResult;
          that.data.activitys.arrayResult = array.concat(res.data.result.list);
          that.data.activitys.totalpage = res.data.result.totalpage;
          that.setData(
            { activitys: that.data.activitys }
          );

        } else {
          wx.showToast({
            title: res.data.errorCode,
            icon: 'none'
          })
        }
      }, fail: function (res) {
        console.log(res.errorMsg);
      }, complete: function () {
        wx.hideLoading();
        if (refresh) wx.stopPullDownRefresh();
      }, method: 'GET'
    });
  },
  //远程获取动态数据
  getDynamicData: function (refresh) {
    wx.showLoading();
    var that = this;
    wx.request({
      url: app.host + '/jdynamic/dynamicList',
      data: {
        token: app.globalData.userInfo.token,
        typeId: 4,
        lon: that.data.lon,
        lat: that.data.lat,
        page: that.data.dynamics.currentPage,
        pageSize: that.data.pageSize,
        userId: otherUserId
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          var newData = res.data.result.list;
          if (newData.length > 0) {
            for (var i in newData) {
              newData[i].createDate = date_util.formatMsgTime(newData[i].createDate);
            }
            var array = that.data.dynamics.arrayResult;
            that.data.dynamics.arrayResult = array.concat(newData);
            that.data.dynamics.totalpage = res.data.result.totalPage;
            that.setData(
              { dynamics: that.data.dynamics }
            );
          }
        } else {
          wx.showToast({
            title: res.data.errorCode,
            icon: 'none'
          })
        }
      }, fail: function (res) {
        console.log(res.errorMsg);
      }, complete: function () {
        wx.hideLoading();
        if (refresh) wx.stopPullDownRefresh();
      }, method: 'GET'
    });
  }, emptyData: function () {
    var that = this;
    if (that.data.currentTab == 0) {
      var ary = that.data.activitys.arrayResult;
      ary.splice(0, ary.length);
      that.data.activitys.arrayResult = ary;
      that.data.activitys.currentPage = 1;
      that.data.activitys.totalpage = 0;
      that.setData({
        activitys: that.data.activitys
      })
    } else {
      var ary = that.data.dynamics.arrayResult;
      ary.splice(0, ary.length);
      that.data.dynamics.arrayResult = ary;
      that.data.dynamics.currentPage = 1;
      that.data.dynamics.totalpage = 0;
      that.setData({
        dynamics: that.data.dynamics
      })
    }
  }, //跳转动态详情
  gotoDynamicDetails: function (e) {
    var id = e.currentTarget.dataset.current;
    wx.navigateTo({ url: '/pages/dynamic/dynamic?dynamicId=' + id + '' });
  }, //下拉刷新
  onPullDownRefresh: function () {
    this.emptyData();
    if (this.data.currentTab == 0) {
      this.getActivityData(true);
    } else {
      this.getDynamicData(true);
    }
  },
  //上拉加载更多
  onReachBottom: function () {
    if (this.data.currentTab == 0) {
      var currentIndex = this.data.activitys.currentPage;
      if (this.data.activitys.totalpage > currentIndex) {
        this.data.activitys.currentPage = parseInt(currentIndex) + 1;
        this.setData({ activitys: this.data.activitys });
        this.getActivityData();
      } else {
        util.toast('没有更多')
      }
    } else {
      var currentIndex = this.data.dynamics.currentPage;
      if (this.data.dynamics.totalpage > currentIndex) {
        this.data.dynamics.currentPage = parseInt(currentIndex) + 1;
        this.setData({ dynamics: this.data.dynamics });
        this.getDynamicData();
      } else {
        wx.showToast({
          title: '没有更多',
          icon: 'none'
        })
      }
    }

  }, gotoSessionView: function (e) {
    console.log(e);
    var data = e.currentTarget.dataset.current.split(',');
    wx.navigateTo({
      url: '/pages/interface/interface?toUserId=' + data[0] + '&toUserName=' + data[1] + ''
    })
  },
  addFriend:function(){
    var localUser = app.globalData.userInfo;
    if (localUser){
      webimhandler.addFriend(localUser.userId, otherUserId, (res)=>{
        console.log(res);
      }, (res)=>{
        console.log(res);
      });
    }else{
      util.toast('登录后操作');
    }
  }
})