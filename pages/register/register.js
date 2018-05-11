//register.js
const util = require('../../utils/util.js')
//获取应用实例

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus_1: true,
    focus_2: true,
    focus_3: true,
    focus_4: true
  },
  onTap: function () {
    //返回上一页面或者多级页面
    wx.navigateBack({
      delta: 1
    });
  },
  focusInputEvent1: function () {
    this.setData({
      focus_1: false
    })
  },
  blurInputEvent1: function () {
    this.setData({
      focus_1: true
    })
  },
  focusInputEvent2: function () {
    this.setData({
      focus_2: false
    })
  },
  blurInputEvent2: function () {
    this.setData({
      focus_2: true
    })
  },
  focusInputEvent3: function () {
    this.setData({
      focus_3: false
    })
  },
  blurInputEvent3: function () {
    this.setData({
      focus_3: true
    })
  },
  tapfocus: function (e) {
    this.setData({
      focus_4: !this.data.focus_4
    })
  }
})