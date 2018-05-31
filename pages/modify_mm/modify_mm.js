// pages/modify_mm/modify_mm.js
const app = getApp();
var oldPwd, newPwd, confirmPwd;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, inputOldPwd: function (e) {
    oldPwd = e.detail.value;
  }, inputNewPwd: function (e) {
    newPwd = e.detail.value;
  }, inputConfirmPwd: function (e) {
    confirmPwd = e.detail.value;
  }, btnSubmit: function () {
    var that = this;
    if (that.checkInput()) {
      wx.request({
        url: app.host + 'juser/updatepassword',
        data: {
          token: app.globalData.userInfo.token,
          typeId: 2,
          password: oldPwd,
          newPassword: newPwd
        }, header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, method: 'POST',
        success: (res) => {
          if(res.data.success){
            util.toast(res.data.result);
            setTimeout(function(){
              wx.navigateBack();
            },1000);
          }else{
            util.toast(res.data.errCodeDes);
          }
        }
      })
    }
  }, checkInput: function () {
    if (!util.checkInput(oldPwd)) {
      util.toast('请输入旧密码');
      return false;
    }
    if (!util.checkInput(newPwd) || newPwd.replace(/\s/g, '').length < 8) {
      util.toast('新密码为空或长度不足');
      return false;
    }
    if (!/^[A-Za-z0-9]+$/.test(newPwd)){
      util.toast('密码不能包含特殊字符');
      return false;
    }
    if (!util.checkInput(confirmPwd)) {
      util.toast('请确认密码');
      return false;
    }
    if (newPwd !== confirmPwd) {
      util.toast('确认密码不一致');
      return false;
    }
    return true;
  }
})