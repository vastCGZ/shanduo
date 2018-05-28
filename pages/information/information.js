// pages/information/information.js
const app = getApp();
var otherUserId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0 //tab标题的滚动条位置
    ,otherUser:null
    ,host:null
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
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
    that.setData({host:app.host})
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
    this.loadUserDetail();
  }
  , loadUserDetail: function () {
    var that=this;
    wx.request({
      data: {
        token: app.globalData.userInfo.token,
        userId: otherUserId
      },
      url: app.host + '/jattention/userdetails',
      success: (res) => {
        if(res.data.success){
          console.log(res);
          that.setData({otherUser:res.data.result})
        }
      }
    })
  }
})