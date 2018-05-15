//index.js  
<<<<<<< HEAD
var postsData = require('../../data/posts_data.js')
// const req = require('../../utils/util.js')  
const network = require("../../request/request.js")  
=======
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
//获取应用实例  
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    vi_Height: 0,
    sw_Height: 0,
    // 活动，动态切换  
    currentTab: 0,
    // 活动内的切换  
    currentTab1: 0,
    //扫一扫
    show: null,
    //请求的活动数据
    posts_hot: null,
    posts_hot_sex: null,
    posts_key: null,
    //活动数据的长度
    length: 0,
<<<<<<< HEAD
    length1: 0,
    //
    current: 0,
    imgUrls: []
  },
  onLoad: function () {
    var that = this;    //调接口
    //写入参数  
    var params = new Object()
    params.type = 1;
    params.lon = 113.91;
    params.lat = 22.50;
    params.page = 1;
    params.pageSize = 5;

    //发起请求  
    network.GET(
      {
        params: params,
        success: function (res) {
          //拿到解密后的数据，进行代码逻辑  
          that.setData({
            posts_hot: res.data.result.list,
            length: res.data.result.list.length
          });
        },
        fail: function () {
          //失败后的逻辑  

        },
      }
    ) 
=======
    latitude: 0,
    longitude: 0,
    host: null
  },
  onLoad: function () {
    var that = this;
    that.setData({ host: app.host });
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
    /** 
     * 获取系统信息 
     */
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
<<<<<<< HEAD
    that.setData({
      posts_key: postsData.postList,
      length1: postsData.postList.length
=======
    wx.getLocation({
      success: function (res) {
        that.setData({ latitude: res.latitude });
        that.setData({ longitude: res.longitude });
        that.getActivityData();
      }
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
    });
  },
  /** 
     * 滑动切换活动，动态 
     */
  bindChange: function (e) {
    console.log(e.target.dataset.current);
    var that = this;
    that.setData({ currentTab: e.target.dataset.current });
  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /** 
     * 滑动切换活动内的Tab
     */
  bindChange1: function (e) {
    var that = this;
<<<<<<< HEAD
    that.setData({ currentTab1: e.detail.current});

=======
    that.setData({ currentTab1: e.detail.current });
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav1: function (e) {
    var that = this;
<<<<<<< HEAD
    var type_on = parseInt(e.target.dataset.current)+1

=======
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
    if (this.data.currentTab1 === e.target.dataset.current) {
      return;
    }
<<<<<<< HEAD
    //调接口
    //写入参数  
    var params = new Object()
    params.type = type_on;
    params.lon = 113.91;
    params.lat = 22.50;
    params.page = 1;
    params.pageSize = 5;

    //发起请求  
    network.GET(
      {
        params: params,
        success: function (res) {
          //拿到解密后的数据，进行代码逻辑  
          that.setData({
            posts_hot: res.data.result.list,
            length: res.data.result.list.length
          });
        },
        fail: function () {
          //失败后的逻辑  

        },
      }) 
=======
    that.setData({
      currentTab1: e.target.dataset.current
    })
    that.getActivityData();
  },
  getActivityData: function () {
    var that = this;
    wx.request({
      url: app.host + '/activity/showHotActivity',
      data: {
        token: app.globalData.userInfo.token,
        type: that.data.currentTab1 + 1,
        lon: that.data.longitude,
        lat: that.data.latitude,
        page: 1,
        pageSize: 10
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.success) {
          that.setData({
            posts_key: res.data.result.list,
            length: res.data.result.list.length
          });
        }
      }, fail: function (res) {
        console.log(res.errorMsg);
      }, method: 'GET'
    });
>>>>>>> 034b9e3908860b96a62c54544ebdc056458e7bf2
  },
  /**
   * 扫一扫
   */
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        this.show = "--result:" + res.result + "--scanType:" + res.scanType + "--charSet:" + res.charSet + "--path:" + res.path;
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  bindFocus: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
}) 