//register.js
const request = require('../../request/request.js')
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
    focus_4: true,
    /*提示框 */
    modalHidden: true,
    toast1Hidden: true,
    notice_str: '',
    /*验证码 */
    isShow: false,         //默认按钮1显示，按钮2不显示
    sec: 60　
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
  },
  /* 验证码倒计时*/
  getCode: function () {
    var _this = this;　　　　//防止this对象的混杂，用一个变量来保存
    _this.setData({
      isShow: true                    //按钮1隐藏，按钮2显示
    })
    var num = _this.data.sec;                //用一个变量来保存最初定义的倒计时秒数，就不用在计时完之后再手动设置秒数
    var remain = _this.data.sec;             //用另外一个变量来操作秒数
    var time = setInterval(function () {
      if (remain <= 0) {
        _this.setData({
          sec: num,
          isShow: false
        })
        clearInterval(time);
        return false      //必须有
      }
      remain--;
      _this.setData({
        sec: remain
      })
    }, 1000)
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
    //密码证码
    var strpwd = /^[0-9a-zA-Z]{0,18}$/g;
    //手机证码
    var strphone = /^1[34578]\d{9}$/;
    //验证码证码
    var strtest = /^/; 
    if (formData.phone.length == 0) {
      wx.showToast({
        title: '输入的手机号为空',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else if (formData.phone.length < 11) {
      wx.showToast({
        title: '手机号长度有误',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else if (!strphone.test(formData.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else if (formData.test.length != 6) {
      wx.showToast({
        title: '请输入正确的验证码',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else if (formData.pwd.length < 8) {
      wx.showToast({
        title: '密码不能低于8位',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else if (!strpwd.test(formData.pwd)) {
      wx.showToast({
        title: '密码由0~18位由数字和26个英文字母混合而成',
        mask: true,
        icon: 'none',
        duration: 2000,
      })
    } else {
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