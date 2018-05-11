//load.js
const util = require('../../utils/util.js')
//获取应用实例

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus_1: true,
    focus_2: true
  },
  onTap: function () {
    //保留当前页面,跳转到应用内某个页面
    wx.navigateTo({
      url: '../register/register',
    });
    //关闭当前页面,跳转到应用内某个页面
    // wx.redirectTo({
    //   url: '../circum/circum',
    // });
    //跳转到tabBar页面,关闭其他所有tabBar页面
    // wx.switchTab({
    //   url: '../circum/circum',
    // });
    //返回上一页面或者多级页面
    // wx.navigateBack({
    //   delta: 1
    // });
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
  }
})


// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function () {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse) {
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function (e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
