const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    avatarUrl: null,
    dynamic: {
      token: null,
      content: null,
      picture: [],
      lat: null,
      lon: null
    }
  },
  bindViewTap: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          avatarUrl: tempFilePaths
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  cancel: function () {
    wx.navigateBack();
  },
  launchDynamic: function () {
    if (this.data.avatarUrl) {
      this.uploadImg(this.data.avatarUrl);
    } else {
      util.toast('请选图');
    }
  },
  uploadImg: function (pics) {
    var that = this;
    var i = pics.i ? pics.i : 0;
    wx.uploadFile({
      url: app.host + "/file/upload",
      filePath: pics[i],
      name: 'file',
      formData: {
        'token': app.globalData.userInfo.token
      },
      success: (res) => {
        console.log(res);
        if (res.statusCode == 200) {
          var back = JSON.parse(res.data);
          if (back.success) {
            var array = that.data.dynamic.picture;
            that.data.dynamic.picture = array.concat(back.result);
            i++;
            if (i == pics.length) {
              that.pushDynamic();
            } else {
              pics.i = i;
              that.uploadImg(pics);
            }
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
  pushDynamic: function () {
    wx.showLoading();
    var that = this;
    wx.request({
      url: app.host + "/jdynamic/savedynamic",
      data: that.data.dynamic,
      dataType: 'json',
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: res.data.result
          });
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/activity/activity'
            })
          }, 500)
        }
      }, fail: (res) => {
        util.toast(res.errorMsg);
      }, complete: (res) => {
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  onLoad: function () {
    var that = this;
    var location = app.globalData.location;
    if (location) {
      that.data.dynamic.token = app.globalData.userInfo.token;
      that.data.dynamic.lat = location.lat;
      that.data.dynamic.lon = location.lon;
      that.setData({ dynamic: that.data.dynamic });
    }
  },
  inputContent: function (env) {
    this.data.dynamic.content = env.detail.value;
    this.setData({ dynamic: this.data.dynamic });
  }
})