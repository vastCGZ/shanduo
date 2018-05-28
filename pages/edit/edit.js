const app = getApp();
var webim = require('../../utils/webim.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tmpUserInfo: {},
    gender: ['女', '男'],
    genderIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tmp = this.data.tmpUserInfo;
    tmp.token = app.globalData.userInfo.token;
    this.setData({ userInfo: app.globalData.userInfo, tmpUserInfo: tmp, genderIndex: app.globalData.userInfo.gender });
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

  }, chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        that.uploadImg(res.tempFilePaths);
      }
    })
  }, uploadImg: function (pics) {
    var that = this;
    wx.uploadFile({
      url: app.host + "/file/upload",
      filePath: pics[0],
      name: 'file',
      formData: {
        'token': app.globalData.userInfo.token
      },
      success: (res) => {
        if (res.statusCode == 200) {
          var back = JSON.parse(res.data);
          if (back.success) {
            var tmp = that.data.tmpUserInfo;
            tmp.picture = back.result;
            that.setData({ tmpUserInfo: tmp });
            that.updateUserInfo();
          }
        }
      },
      fail: (e) => {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      }
    })
  },
  updateUserInfo: function () {
    wx.showLoading();
    var that = this;
    wx.request({
      url: app.host + "/juser/updateuser",
      data: that.data.tmpUserInfo,
      dataType: 'json',
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          wx.setStorage({
            key: 'localUser',
            data: res.data.result
          });
          wx.showToast({
            title: '修改成功'
          });
          setTimeout(function () {
            webim.logout((res) => {
              wx.reLaunch({ url: '/pages/personal/personal' });
            });
          }, 1000);
          app.onLaunch();
        }
      }, fail: (res) => {
        util.toast(res.errorMsg);
      }, complete: (res) => {
        wx.hideLoading();
      }
    })
  }, selectGender: function (e) {
    var index = e.detail.value;
    var tmp = this.data.tmpUserInfo;
    tmp.gender = index;
    this.setData({ tmpUserInfo: tmp, genderIndex: index });
    this.updateUserInfo();
  }, selectBirthday: function (e) {
    var tmp = this.data.tmpUserInfo;
    tmp.birthday = e.detail.value;
    this.setData({ tmpUserInfo: tmp });
    this.updateUserInfo();
  }
})