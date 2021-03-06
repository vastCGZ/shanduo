var app = getApp()
var util = require('../../utils/util.js');
var date_util = require('../../utils/date_util.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    vi_Height: 0,
    sw_Height: 0,
    // 活动，动态切换  
    currentTab: 0,
    // 活动内的切换  
    currentTab1: 0,
    // 动态内的切换
    currentTab2: 0,
    //定义活动数组
    activitys: [{
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
    //定义动态数组
    dynamics: [{
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }, {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }],
    latitude: 0,
    longitude: 0,
    host: null,
    pageSize: 20,
    advertise: null
  },
  onShow: function () {
    var pages = getCurrentPages(); //获取加载的页面信息（结果是个数组）
    app.currentPage = pages[0].route;
  },
  onLoad: function () {
    var that = this;
    WxNotificationCenter.addNotification('newMessageNotification', that.newMessageNotification, that);
    that.setData({ host: app.host })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          vi_Height: res.windowHeight / 2 - 100,
          sw_Height: res.windowHeight / 2 - 100
        });
      }
    });
    wx.getLocation({
      success: function (res) {
        that.setData({ latitude: res.latitude, longitude: res.longitude });
        that.getActivityData();
      },
      fail: (res) => {
        wx.openSetting({
          success: (res) => {
            wx.getLocation({
              success: function (res) {
                that.setData({ latitude: res.latitude, longitude: res.longitude });
                that.getActivityData();
              },
            })
          }
        })
      }
    })
    that.advertise();
  }, newMessageNotification: function () {
    wx.showTabBarRedDot({
      index: 1
    });
  },
  bindGetUserInfo: function (e) {
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
              app.globalData.tmpUser.unionId = res.data.errCodeDes;
            }
          }
        }
      })
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  onUnload: function () {
    WxNotificationCenter.removeNotification('newMessageNotification', this);
  },
  //下拉刷新
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
      var currentIndex = this.data.activitys[this.data.currentTab1].currentPage;
      if (this.data.activitys[this.data.currentTab1].totalpage > currentIndex) {
        this.data.activitys[this.data.currentTab1].currentPage = parseInt(currentIndex) + 1;
        this.setData({ activitys: this.data.activitys });
        this.getActivityData();
      } else {
        util.toast('没有更多')
      }
    } else {
      var currentIndex = this.data.dynamics[this.data.currentTab2].currentPage;
      if (this.data.dynamics[this.data.currentTab2].totalpage > currentIndex) {
        this.data.dynamics[this.data.currentTab2].currentPage = parseInt(currentIndex) + 1;
        this.setData({ dynamics: this.data.dynamics });
        this.getDynamicData();
      } else {
        wx.showToast({
          title: '没有更多',
          icon: 'none'
        })
      }
    }

  },
  /** 
     * 滑动切换活动，动态 
     */
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
    if (this.data.currentTab == 0) {
      this.getActivityData();
    } else {
      this.getDynamicData();
    }
  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return;
    }
    this.setData({
      currentTab: e.target.dataset.current
    })
    if (this.data.currentTab == 0) {
      this.getActivityData();
    } else {
      this.getDynamicData();
    }
  },
  /** 
     * 滑动切换活动内的Tab
     */
  bindChange1: function (e) {
    var that = this;
    that.setData({ currentTab1: e.detail.current });
    that.emptyData();
    that.getActivityData();
  },
  //滑动切换动态内的Tab
  bindChange2: function (e) {
    var that = this;
    that.setData({ currentTab2: e.detail.current });
    that.emptyData();
    that.getDynamicData();
  },
  /** 
   * 点击活动tab切换 
   */
  swichNav1: function (e) {
    var that = this;
    if (this.data.currentTab1 === e.target.dataset.current) {
      return;
    }
    that.setData({
      currentTab1: e.target.dataset.current
    });
    that.emptyData();
    that.getActivityData();

  },
  /** 
   * 点击动态tab切换 
   */
  swichNav2: function (e) {
    var that = this;
    if (this.data.currentTab2 === e.target.dataset.current) {
      return;
    }
    that.setData({
      currentTab2: e.target.dataset.current
    });
    that.emptyData();
    that.getDynamicData();
  },
  //远程获取活动数据
  getActivityData: function (refresh) {
    wx.showLoading();
    var that = this;
    var token = '';
    if (app.globalData.userInfo) {
      token = app.globalData.userInfo.token;
    }
    wx.request({
      url: app.host + '/activity/showHotActivity',
      data: {
        token: token,
        type: parseInt(that.data.currentTab1) + 1,
        lon: that.data.longitude,
        lat: that.data.latitude,
        page: that.data.activitys[that.data.currentTab1].currentPage,
        pageSize: that.data.pageSize
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          var array = that.data.activitys[that.data.currentTab1].arrayResult;
          that.data.activitys[that.data.currentTab1].arrayResult = array.concat(res.data.result.list);
          that.data.activitys[that.data.currentTab1].totalpage = res.data.result.totalpage;
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
    var token = '';
    if (app.globalData.userInfo) {
      token = app.globalData.userInfo.token;
    }
    wx.request({
      url: app.host + '/jdynamic/dynamicList',
      data: {
        token: token,
        typeId: parseInt(that.data.currentTab2) + 1,
        lon: that.data.longitude,
        lat: that.data.latitude,
        page: that.data.dynamics[that.data.currentTab2].currentPage,
        pageSize: that.data.pageSize
      },
      dataType: 'json',
      success: function (res) {
        //createDate
        if (res.data.success) {
          var newData = res.data.result.list;
          if (newData.length > 0) {
            for (var i in newData) {
              newData[i].createDate = date_util.formatMsgTime(newData[i].createDate);
            }
            var array = that.data.dynamics[that.data.currentTab2].arrayResult;
            that.data.dynamics[that.data.currentTab2].arrayResult = array.concat(newData);
            that.data.dynamics[that.data.currentTab2].totalpage = res.data.result.totalPage;
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
  },
  emptyData: function () {
    var that = this;
    if (that.data.currentTab == 0) {
      var ary = that.data.activitys[that.data.currentTab1].arrayResult;
      ary.splice(0, ary.length);
      that.data.activitys[that.data.currentTab1].arrayResult = ary;
      that.data.activitys[that.data.currentTab1].currentPage = 1;
      that.data.activitys[that.data.currentTab1].totalpage = 0;
      that.setData({
        activitys: that.data.activitys
      })
    } else {
      var ary = that.data.dynamics[that.data.currentTab2].arrayResult;
      ary.splice(0, ary.length);
      that.data.dynamics[that.data.currentTab2].arrayResult = ary;
      that.data.dynamics[that.data.currentTab2].currentPage = 1;
      that.data.dynamics[that.data.currentTab2].totalpage = 0;
      that.setData({
        dynamics: that.data.dynamics
      })
    }
  },
  //跳转动态详情
  gotoDynamicDetails: function (e) {
    var id = e.currentTarget.dataset.current;
    wx.navigateTo({ url: '/pages/dynamic/dynamic?dynamicId=' + id + '' });
  },
  //广告轮播图
  advertise: function () {
    var that = this;
    wx.request({
      url: app.host + '/jcarousel/carouselList',
      data: 'json',
      success: (res) => {
        if (res.data.success) {
          that.setData({ advertise: res.data.result });
        }
      }
    })
  }, gotoApplyView: function (e) {
    var activityId = e.currentTarget.dataset.current;
    wx.navigateTo({
      url: '/pages/signup/signup?activityId=' + activityId + ''
    })
  }, gotoSearchView: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
  , gotoUserHomePage: function (e) {
    var userId = e.currentTarget.dataset.current;
    if (userId == app.globalData.userInfo.userId) {
      wx.switchTab({
        url: '/pages/personal/personal'
      })
    } else {
      wx.navigateTo({
        url: '/pages/information/information?otherUserId=' + userId + ''
      })
    }
  }, gotoCreditCenterView: function () {
    wx.navigateTo({
      url: '/pages/credit/credit'
    });
  }
}) 