//获取应用实例
var webim = require('../../utils/webim.js');
var webimhandler = require('../../utils/webim_handler.js');
var Config = {
  sdkappid: 1400088239,
  accountType: 25943,
  accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};
var app = getApp()
var toUserId, toUserName
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgContent: null,
    userInfo: null,
    actionStatus: '',
    toUserName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var localUserInfo = app.globalData.userInfo;
    toUserId = options.toUserId;
    toUserName = options.toUserName;
    if (localUserInfo) {
      this.setData({ userInfo: localUserInfo, toUserName: toUserName });
      this.initIM();
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
  clearInput: function () {
    this.setData({
      msgContent: ""
    })
  },
  receiveMsgs: function (data) {
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    if (msgs.length > 10) {
      msgs.splice(0, msgs.length - 10)
    }

    this.setData({
      msgs: msgs
    })
  },
  initIM: function () {
    var that = this;
    // var avChatRoomId = '@TGS#aWTBZTDFW';
    webimhandler.init({
      accountMode: Config.accountMode
      , accountType: Config.accountType
      , sdkAppID: Config.sdkappid
      // , avChatRoomId: avChatRoomId //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      , selType: webim.SESSION_TYPE.C2C
      , selToID: toUserId
      , selSess: null //当前聊天会话
    });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': Config.sdkappid, //用户所属应用id，必填
      'accountType': Config.accountType, //用户所属应用帐号类型，必填
      'identifier': that.data.userInfo.userId, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': that.data.userInfo.name, //当前用户昵称，选填
      'userSig': that.data.userInfo.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };

    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify//用户自定义通知(默认全员接收)
    };

    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          that.setData({ actionStatus: '在线' });
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          that.setData({ actionStatus: '离线' });
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": onConnNotify, //选填, 
      //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify,//监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
      'isLogOn': true//是否开启控制台打印日志,默认开启，选填
    };

    if (Config.accountMode == 1) {//托管模式
      webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
    } else {//独立模式
      //sdk登录
      webimhandler.sdkLogin(loginInfo, listeners, options);
    }
  },
  inputMsg: function (event) {
    this.setData({ msgContent: event.detail.value })
  },
  sendMsg: function () {
    var that = this;
    var content = that.data.msgContent;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.selType = webim.SESSION_TYPE.C2C;
    webimhandler.onSendMsg(content, function (res) {
      if (res.ActionStatus === 'FAIL') {
        switch (res.ErrorCode) {
          case '20009':
            //双方互相不是好友，禁止发送
            break;
          case '20010':
            //自己不是对方的好友（单向关系），禁止发送
            break;
          case '20011':
            //对方不是自己的好友（单向关系），禁止发送
            break;
        }
      } else {
        that.clearInput();
      }
    })
  }
})