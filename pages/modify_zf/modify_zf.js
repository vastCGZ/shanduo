// pages/modify_zf/modify_zf.js

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
      wallet_pay(this)
    }
  },
  set_wallets_password1(e) {//获取修改支付密码
    this.setData({
      wallets_password1: e.detail.value
    });
  },
  set_Focus() {//聚焦input
    console.log('isFocus', this.data.isFocus)
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    this.setData({
      isFocus: false
    })
  }
})
/*-----------------------------------------------*/
// 验证支付密码
function wallet_pay(_this) {
  console.log('验证支付密码')
  _this.setData({
    wallets_password_flag: true,
    isFocus: true
  })
}