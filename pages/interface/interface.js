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
    messageBody: [],
    recentContact: {}
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
            var msgbody = historyMsgList[i];
            msg.fromAccount = msgbody.fromAccount;
            msg.content = msgbody.elems[0].content.text;
            msg.time = util.getLocalTime(msgbody.time);
            if (msgbody.fromAccount == app.globalData.userInfo.userId) {
              msg.me = true;
            }
            oldMessageBody.push(msg);
            that.setData({ messageBody: oldMessageBody })
          }
        }
      });
    };
    that.searchProfileByUserId([toUserId]);
    //注册通知
    WxNotificationCenter.addNotification('onConnNotify', that.onConnNotify, that);
    WxNotificationCenter.addNotification('newMessageNotification', that.newMessageNotification, that);
  },
  searchProfileByUserId: function (ids) {
    var that = this;
    var tag_list = [
      "Tag_Profile_IM_Nick",//昵称
      "Tag_Profile_IM_Gender",//性别
      "Tag_Profile_IM_Image"//头像
    ];
    var options = {
      'To_Account': ids,
      'TagList': tag_list
    };
    webim.getProfilePortrait(
      options,
      function (resp) {
        if (resp.UserProfileItem && resp.UserProfileItem.length > 0) {
          for (var i in resp.UserProfileItem) {
            var to_account = resp.UserProfileItem[i].To_Account;
            var nick = null, gender = null, imageUrl = null;
            for (var j in resp.UserProfileItem[i].ProfileItem) {
              switch (resp.UserProfileItem[i].ProfileItem[j].Tag) {
                case 'Tag_Profile_IM_Nick':
                  nick = resp.UserProfileItem[i].ProfileItem[j].Value;
                  break;
                case 'Tag_Profile_IM_Gender':
                  switch (resp.UserProfileItem[i].ProfileItem[j].Value) {
                    case 'Gender_Type_Male':
                      gender = '男';
                      break;
                    case 'Gender_Type_Female':
                      gender = '女';
                      break;
                    case 'Gender_Type_Unknown':
                      gender = '未知';
                      break;
                  }
                  break;
                case 'Tag_Profile_IM_Image':
                  imageUrl = resp.UserProfileItem[i].ProfileItem[j].Value;
                  break;
              }
            }
            var lls = that.data.recentContact;
            lls.Nick = webim.Tool.formatText2Html(nick);
            lls.Gender = gender;
            lls.Image = imageUrl;
            that.setData({ recentContact: lls });
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  },
  onUnload: function () {
    WxNotificationCenter.removeNotification('onConnNotify', this);
    WxNotificationCenter.removeNotification('newMessageNotification', this);
  },
  //连接状态通知处理
  onConnNotify: function (obj) {
    this.setData({ actionStatus: obj })
  },
  newMessageNotification: function (obj) {
    if (obj.fromAccount == toUserId) {
      var oldMessageBody = this.data.messageBody;
      oldMessageBody.push({
        fromAccount: obj.fromAccount,
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
  //发送文本消息
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
      } else {
        util.toast(res);
      }
    })
  },
  //发送图片
  choosePicture: function () {
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
  },
  //发送视频
  chooseVideo: function () {
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