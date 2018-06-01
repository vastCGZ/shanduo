const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    isFocus: true,//控制input 聚焦
    wallets_password_flag: false//密码输入遮罩
  },
  set_wallets_password(e) {//获取验证支付密码
    this.setData({
      wallets_password: e.detail.value
    });
    if (this.data.wallets_password.length == 6) {//密码长度6位时，自动跳转修改支付密码
      this.setData({
        wallets_password_flag: true,//验证消失，修改显示
        isFocus: true
      })
    }
  },
  set_wallets_password1(e) {//获取修改支付密码
    this.setData({
      wallets_password1: e.detail.value
    });
  },
  set_Focus() {//聚焦input
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    this.setData({
      isFocus: false
    })
  },
  toBack:function(){
    this.setData({
      wallets_password: 0
    });
      this.setData({
        wallets_password_flag: false,//验证消失，修改显示
        isFocus: true
      })
  },
  //提交修改
  submitDone: function () {
    var that = this;
    var newPwd = that.data.wallets_password1;
    if (!util.checkInput(newPwd) || newPwd.replace(/\s/g, '').length < 6) {
      util.toast('新密码为空或长度不足');
      return;
    }
    wx.request({
      url: app.host + 'jmoney/updatepassword',
      data: {
        token: app.globalData.userInfo.token,
        typeId: 2,
        password: that.data.wallets_password,
        newPassword: that.data.wallets_password1
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (res) => {
        if(res.data.success){
          util.toast('设置成功');
          setTimeout(function(){
            wx.navigateBack();
          },1000);
        }else{
          util.toast(res.data.errCodeDes);
        }
      }
    })
  }
})