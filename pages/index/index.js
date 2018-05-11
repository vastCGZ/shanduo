//index.js  
var postsData = require('../../data/posts_data.js')
const req = require('../../utils/util.js')  
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
    posts_key: null,
    //活动数据的长度
    length: 0,
    //
    current: 0,
    imgUrls: []
  },
  onLoad: function () {
    var that = this;
    //调接口
    req.GetByParams('activity/showHotActivity')//看这里  看这里  看这里  
      .then(d => this.setData({ imgUrls: d, loading: false }))
      .catch(e => {
        this.setData({ imgUrls: [], loading: false })
      })
    console.log(this.data.imgUrls)
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          vi_Height: res.windowHeight/2-100,
          sw_Height: res.windowHeight/2-100,
        });
      }

    });
    that.setData({
      posts_key: postsData.postList,
      length: postsData.postList.length
    });
    console.log(postsData.postList.length)
  },
  /** 
     * 滑动切换活动，动态 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
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
    that.setData({ currentTab1: e.detail.current });

  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav1: function (e) {

    var that = this;

    if (this.data.currentTab1 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab1: e.target.dataset.current
      })
    }
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