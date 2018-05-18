const app = getApp();
var util = require('../../utils/util.js');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],
    array: [10, 20, 30, 40, 50],
    index: null,
    array1: [10, 20, 30, 40, 50],
    index1: null,
    modes: ['AA制', '男生请客', '我请客'],
    modesIndex: null,
    activity: {
      token: null,
      activityName: null,
      activityAddress: null,
      mode: null,
      manNumber: null,
      womanNumber: null,
      remarks: null,
      activityStartTime: null,
      activityCutoffTime: null,
      lon: null,
      lat: null
    },
    mark: 0,
  },
  onLoad: function (options) {
    this.data.activity.token = app.globalData.userInfo.token;
    this.setData({ activity: this.data.activity });
  },
  bindPickerChange: function (e) {
    var index = e.detail.value;
    this.data.activity.manNumber = this.data.array[index];
    this.setData({
      activity: this.data.activity,
      index: index
    })
  },
  bindPickerChange1: function (e) {
    var index = e.detail.value;
    this.data.activity.womanNumber = this.data.array1[index];
    this.setData({
      index1: index,
      activity: this.data.activity
    })
  },
  cancel: function () {
    wx.navigateBack();
  },
  // startTimeChange: function (env) {
  //   this.data.activity.activityStartTime = env.detail.value;
  //   this.setData({ activity: this.data.activity });
  // },
  cutoffTimeChange: function (env) {
    this.data.activity.activityCutoffTime = env.detail.value;
    this.setData({ activity: this.data.activity });
  },
  inputActivityName: function (env) {
    this.data.activity.activityName = env.detail.value;
    this.setData({ activity: this.data.activity });
  },
  inputActivityRemarks: function (env) {
    this.data.activity.remarks = env.detail.value;
    this.setData({ activity: this.data.activity });
  },
  selectMode: function (e) {
    var index = e.detail.value;
    this.data.activity.mode = this.data.modes[index];
    this.setData({
      modesIndex: index,
      activity: this.data.activity
    })
  },
  pushActivity: function () {
    wx.showLoading()
    console.log(this.data.activity);
    var that = this;
    if (this.checkInputData()) {
      wx.request({
        url: app.host + '/activity/saveactivity',
        data: that.data.activity,
        dataType: 'json',
        method: 'GET',
        success: function (res) {
          if (res.data.success) {
            util.toast('发布成功')
          } else {
            util.toast(res.data.errorCode);
          }
        }, complete: function () {
          wx.hideLoading();
        }
      })
    }
  },
  openMap: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getUserLocation();
            }, fail(res) {
              wx.openSetting({
                success: function (res) {
                  that.getUserLocation();
                }
              })
            }
          })
        } else {
          that.getUserLocation();
        }
      }
    });
  },
  getUserLocation: function () {
    var that = this;
    wx.chooseLocation({
      success(res) {
        // name	位置名称
        // address	详细地址
        // latitude	纬度，浮点数，范围为 - 90~90，负数表示南纬
        // longitude	经度，浮点数，范围为 - 180~180，负数表示西经
        that.data.activity.activityAddress = res.address;
        that.data.activity.lon = res.longitude;
        that.data.activity.lat = res.latitude;
        that.setData({
          activity: that.data.activity
        })
      }
    });
  },
  checkInputData: function () {
    var activity = this.data.activity;
    if (!activity.activityName) {
      util.toast('请输入活动主题');
      return false;
    }
    if (!activity.remarks) {
      util.toast('请输入活动内容');
      return false;
    }
    if (!activity.manNumber && !activity.womanNumber) {
      util.toast('请输入活动人数');
      return false;
    }
    if (!activity.activityStartTime) {
      util.toast('请输入活动开始时间');
      return false;
    }
    if (!activity.activityCutoffTime) {
      util.toast('请输入活动截止时间');
      return false;
    }
    if (!activity.mode) {
      util.toast('请输入活动消费方式');
      return false;
    }
    if (!activity.activityAddress) {
      util.toast('请输入活动地点');
      return false;
    }
    return true;
  },
  pickerTap: function (e) {
    this.setData({
      mark: e.currentTarget.dataset.current
    });
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },




  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "-" + day;
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "-" + date1.getDate();

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "-" + day;
    }
    var year = date.getFullYear();
    var time = year + "-" + monthDay + " " + hours + ":" + minute;
    var id = that.data.mark;
    if (id == 0) {
      this.data.activity.activityStartTime = time;
    } else {
      this.data.activity.activityCutoffTime = time;
    }
    this.setData({ activity: this.data.activity });
  }
})