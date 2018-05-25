const app = getApp();
var date_util = require('../../utils/date_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: null,
    dynamics: [],
    pageIndex: 1,
    totalPage: 0,
    pageSize: 20,
    lat: 0,
    lon: 0,
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ host: app.host });
    wx.getLocation({
      success: function (res) {
        that.setData({ lat: res.latitude, lon: res.longitude });
        that.loadDynamics();
      },
    })
  },
  loadDynamics: function () {
    var that = this;
    wx.request({
      url: app.host + '/jdynamic/dynamicList',
      data: {
        token: app.globalData.userInfo.token,
        typeId: 3,
        lat: that.data.lat,
        lon: that.data.lon,
        page: that.data.pageIndex,
        pageSize: that.data.pageSize
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          var newData = res.data.result.list;
          if (newData.length > 0) {
            var oldData = that.data.dynamics;
            for (var i in newData) {
              newData[i].createDate = date_util.formatMsgTime(newData[i].createDate);
            }
            that.data.dynamics = oldData.concat(newData);
            that.setData({ dynamics: that.data.dynamics });
          }
        }
      }
    })
  },
  pushDynamic: function () {
    wx.navigateTo({ url: '/pages/release_dt/release_dt' });
  },
  share:function(){
    this.setData({ isShow:true});
  },
  closeDialog:function(){
    if(this.data.isShow){
      this.setData({ isShow: false });
    }
  }
})