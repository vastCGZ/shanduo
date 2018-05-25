const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    avatarUrl: [],
    dynamic: {
      token: null,
      content: null,
      picture: [],
      lat: null,
      lon: null
    },
    pictureSize:9
  },
  bindViewTap: function () {
    var that = this;
    if (that.data.avatarUrl.length==9){
      util.toast('最多选择9张');
      return;
    }
    var imgCount = parseInt(that.data.pictureSize) - that.data.avatarUrl.length;
    wx.chooseImage({
      count: imgCount,
      sizeType: ['compressed'],
      success: function (res) {
        var oldAvatarUrl = that.data.avatarUrl;
        that.data.avatarUrl = oldAvatarUrl.concat(res.tempFilePaths)
        that.setData({
          avatarUrl: that.data.avatarUrl
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    })
  },
  cancel: function () {
    wx.navigateBack();
  },
  launchDynamic: function () {
    if (this.data.avatarUrl) {
      this.uploadImg(this.data.avatarUrl);
    } else if (this.data.dynamic.content) {
      this.pushDynamic();
    } else {
      util.toast('请输入想说的话或分享图片');
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
              url: '/pages/launch/launch'
            })
          }, 500)
        }
      }, fail: (res) => {
        util.toast(res.errorMsg);
      }, complete: (res) => {
        wx.hideLoading();
      }
    })
  },
  onLoad: function () {
    var that = this;
    that.data.dynamic.token = app.globalData.userInfo.token;
    wx.getLocation({
      success: function (res) {
        that.data.dynamic.lat = res.latitude
        that.data.dynamic.lon = res.longitude
        that.setData({ dynamic: that.data.dynamic });
      }
    })
  },
  inputContent: function (env) {
    this.data.dynamic.content = env.detail.value;
    this.setData({ dynamic: this.data.dynamic });
  }
})