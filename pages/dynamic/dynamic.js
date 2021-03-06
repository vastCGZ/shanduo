const app = getApp();
var dynamicId = null;
var dateUtil = require('../../utils/date_util.js');
var util = require('../../utils/util.js');
Page({
  data: {
    host: null,
    dynamic: null,
    commentList: [],
    pageIndex: 1,
    pageSize: 20,
    totalPage: 0,
    comments: '',
    createDate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      host: app.host
    });
    dynamicId = options.dynamicId;
    this.loadDynamicDetails();
    this.loadCommentList();
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
  },
  //上拉加载更多
  onReachBottom: function () {
    if (this.data.totalPage > this.data.pageIndex) {
      this.setData({ pageIndex: parseInt(pageIndex) + 1 });
      this.loadCommentList();
    }
  },
  loadDynamicDetails: function () {
    var that = this;
    wx.request({
      url: app.host + '/jdynamic/bydynamic',
      data: {
        dynamicId: dynamicId
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          var dynamic = res.data.result;
          that.setData({ dynamic: dynamic, createDate: dateUtil.formatMsgTime(dynamic.createDate) });
        }
      }
    })
  },

  loadCommentList: function () {
    var that = this;
    wx.request({
      url: app.host + '/jdynamic/commentList',
      data: {
        dynamicId: dynamicId,
        page: that.data.pageIndex,
        pageSize: that.data.pageSize
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          var oldList = that.data.commentList;
          var newList = res.data.result.list;
          if (newList.length > 0) {
            for (var i in newList) {
              newList[i].createDate = dateUtil.formatMsgTime(newList[i].createDate);
            }
            that.data.commentList = oldList.concat(newList);
            that.setData({ commentList: that.data.commentList, totalPage: res.data.result.totalPage });
          }
        }
      }
    })
  },
  inputComments: function (e) {
    this.setData({ comments: e.detail.value });
  },
  sendComments: function () {
    var that = this;
    if (!app.globalData.userInfo){
      util.toast('登录后操作');
      return;
    }
    var comments = that.data.comments;
    if (!util.checkInput(comments)) {
      util.toast('不能发送空白内容');
      return;
    }
    wx.request({
      url: app.host + '/jdynamic/savecomment',
      data: {
        token: app.globalData.userInfo.token,
        dynamicId: dynamicId,
        comment: comments,
        typeId: 1
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          that.setData({ comments: '' });
          util.toast('评论成功,系统审核后将显示');
        }
      }
    })
  },
  dynamicPraise: function () {
    if (!app.globalData.userInfo) {
      util.toast('登录后操作');
      return;
    }
    wx.request({
      url: app.host + '/jdynamic/ispraise',
      data: {
        token: app.globalData.userInfo.token,
        dynamicId: dynamicId
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          util.toast(res.data.result);
        }
      }
    })
  },
  //评论列表
  seeComments: function (e) {
    var id = e.target.dataset.current;
    wx.navigateTo({ url: '/pages/comment/comment?dynamicId=' + id + '' });
  }, onShareAppMessage: function (res) {
    return {
      title: '闪多动态',
      path: '/pages/dynamic/dynamic?dynamicId=' + dynamicId+''
    }
  }
})