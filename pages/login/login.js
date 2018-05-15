//load.js
const util = require('../../request/request.js')
//获取应用实例

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus_1: true,
    focus_2: true,
    modalHidden: true,
    toast1Hidden: true,
    notice_str: ''
  },
  onTap: function () {
    //保留当前页面,跳转到应用内某个页面
    wx.navigateTo({
      url: '../register/register',
    });
    //跳转到tabBar页面,关闭其他所有tabBar页面
    // wx.switchTab({
    //   url: '../circum/circum',
    // });
    //返回上一页面或者多级页面
    // wx.navigateBack({
    //   delta: 1
    // });
  },
  offTap: function () {
    // 关闭当前页面,跳转到应用内某个页面
    wx.switchTab({
      url: '../index/index',
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
  /*登录 */

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  toast1Change: function (e) {
    this.setData({ toast1Hidden: true });
  }, 
  confirm_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    });
    // 关闭当前页面,跳转到应用内某个页面
    wx.redirectTo({
      url: '../index/index'
    })
  },
  cancel_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  }, 
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    console.log(formData)
    console.log(formData.uname)
    console.log(formData.upwd)
    if (formData.uname.length == 0 || formData.upwd.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else if (formData.upwd.length < 8) {
      wx.showToast({
        title: '密码不能低于8位',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    }else {
      // 这里修改成跳转的页面 
      wx.request({
        url: 'https://app.yapinkeji.com',
        data: formData,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data + '成功')
          that.modalTap();
        },
        fail: function (res) {
          console.log(res.data + '失败')
        }
      })
    }
  }
})