//获取应用实例
var webim = require('../../utils/webim.js');
var webimhandler = require('../../utils/webim_handler.js');
var util = require('../../utils/util.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
var app = getApp();
var toUserId, toUserName, bottom;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgContent: null,
    userInfo: null,
    actionStatus: '',
    toUserName: '',
    messageBody: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var localUserInfo = app.globalData.userInfo;
    toUserId = options.toUserId;
    toUserName = options.toUserName;
    if (localUserInfo) {
      that.setData({ userInfo: localUserInfo, toUserName: toUserName, actionStatus: app.globalData.actionStatus });
      webimhandler.init({
        selType: webim.SESSION_TYPE.C2C
        , selToID: toUserId
        , selSess: null //当前聊天会话
      });
      webimhandler.getLastC2CHistoryMsgs(10, function (res) {
        if (res) {
          var historyMsgList = res.historyMsgList;
          var oldMessageBody = that.data.messageBody;
          for (var i in historyMsgList) {
            var msg = {};
            var msgbody = historyMsgList[i]
            msg.fromAccountNick = msgbody.fromAccountNick;
            msg.content = msgbody.elems[0].content.text;
            msg.time = util.getLocalTime(msgbody.time);
            if (msgbody.fromAccountNick == app.globalData.userInfo.userId) {
              msg.me = true;
            }
            oldMessageBody.push(msg);
            that.setData({ messageBody: oldMessageBody })
          }
        }
      });
    }
    //注册通知
    WxNotificationCenter.addNotification('onConnNotify', that.onConnNotify, that);
    WxNotificationCenter.addNotification('newMessageNotification', that.newMessageNotification, that);
  },
  onUnload:function(){
    WxNotificationCenter.removeNotification('onConnNotify', this);
    WxNotificationCenter.removeNotification('newMessageNotification', this);
  },
  //连接状态通知处理
  onConnNotify: function (obj) {
    this.setData({ actionStatus: obj })
  },
  newMessageNotification: function (obj) {
    if (obj.selToID == toUserId) {
      var oldMessageBody = this.data.messageBody;
      oldMessageBody.push({
        fromAccountNick: obj.selToID,
        content: obj.content,
        time: obj.time
      });
      this.setData({ messageBody: oldMessageBody });
      this.pageScrollToBottom();
    }
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
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#messageBox').boundingClientRect(function (rect) {
      // 使页面滚动到底部  
      wx.pageScrollTo({
        scrollTop: bottom = bottom ? bottom : rect.bottom
      })
    }).exec()
  },
  clearInput: function () {
    this.setData({
      msgContent: ""
    })
  },
  inputMsg: function (event) {
    this.setData({ msgContent: event.detail.value })
  },
  sendMsg: function () {
    var that = this;
    var content = that.data.msgContent;
    if (!util.checkInput(content)) {
      util.toast('不能发送空白内容');
      return;
    }
    webimhandler.onSendMsg(content, function (res) {
      that.clearInput();
      if (res) {
        var oldMessageBody = that.data.messageBody;
        oldMessageBody.push(res);
        that.setData({ messageBody: oldMessageBody });
        that.pageScrollToBottom();
      }
    }, function (res) {
      if (res && res.ActionStatus === 'FAIL') {
        switch (res.ErrorCode) {
          case 20003:
            util.toast('账号无效');
            break;
          case 20009:
            //双方互相不是好友，禁止发送
            util.toast('双方不是好友');
            break;
          case 20010:
            //自己不是对方的好友（单向关系），禁止发送
            util.toast('不是对方的好友');
            break;
          case 20011:
            //对方不是自己的好友（单向关系），禁止发送
            util.toast('对方不是自己的好友');
            break;
        }
      }else{
        util.toast(res);
      }
    })
  },
  addFriend: function () {
    var add_friend_item = [
      {
        'To_Account': toUserId,
        "AddSource": "AddSource_Type_Unknow",
        "AddWording": '你好，我们做朋友吧' //加好友附言，可为空
      }
    ];
    var options = {
      'From_Account': app.globalData.userInfo.userId,
      'AddFriendItem': add_friend_item
    };
    webim.applyAddFriend(options, function (res) {
      console.log(res);
    }, function (res) {
      console.log(res);
    });
  },
  cloneFriendRequest: function () {
    var options = {
      'From_Account': app.globalData.userInfo.userId,
      'PendencyType': 'Pendency_Type_ComeIn',
      'StartTime': 0,
      'MaxLimited': 10,
      'LastSequence': 0
    };
    webim.getPendency(options, function (res) {
      console.log('拉取好友申请');
      console.log(res);
    }, function (res) {
      console.log(res);
    });
  },
  getFriendList: function () {
    var options = {
      'From_Account': app.globalData.userInfo.userId,
      'TimeStamp': 0,
      'StartIndex': 0,
      'GetCount': 10,
      'LastStandardSequence': 0,
      "TagList":
      [
        "Tag_Profile_IM_Nick",
        "Tag_SNS_IM_Remark"
      ]
    };
    webim.getAllFriend(
      options,
      function (resp) {
        console.log(resp);
      }, function () {

      });
  }, choosePicture: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        webimhandler.uploadPic(res.tempFiles[0], function (res) {
          console.log(res);
        }, function (res) {
          console.log(res);
        });
      },
    })
  }, chooseVideo: function () {
    wx.chooseVideo({
      maxDuration: 8,
      success: function (res) {
        //tempFilePath
        //size
        //选择的文件
        util.encodeBase64(res.tempFilePath, function (res) {
          console.log(res);
        });
      }
    });
  }

})