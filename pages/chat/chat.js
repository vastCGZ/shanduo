//获取应用实例
var webim = require('../../utils/webim.js');
var webimhandler = require('../../utils/webim_handler.js');


var Config = {
  sdkappid: 1400088239
  , accountType: 25943
  , accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgContent: null,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var localUserInfo = app.globalData.userInfo;
    if (localUserInfo) {
      this.setData({ userInfo: localUserInfo });
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

    var avChatRoomId = '@TGS#aWTBZTDFW';
    webimhandler.init({
      accountMode: Config.accountMode
      , accountType: Config.accountType
      , sdkAppID: Config.sdkappid
      , avChatRoomId: avChatRoomId //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      , selType: webim.SESSION_TYPE.GROUP
      , selToID: avChatRoomId
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
          webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": webimhandler.onConnNotify, //选填
      "onBigGroupMsgNotify": function (msg) {
        webimhandler.onBigGroupMsgNotify(msg, function (msgs) {
          that.receiveMsgs(msgs);
        })
      }, //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify//监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
      'isLogOn': true//是否开启控制台打印日志,默认开启，选填
    };
    //sdk登录
    webimhandler.sdkLogin(loginInfo, listeners, options);
  },
  inputMsg: function (event) {
    this.setData({ msgContent: event.detail.value })
  },
  sendMsg: function () {
    if (this.data.userInfo) {
      webimhandler.onSendMsg(this.data.msgContent);
    } else {
      wx.showModal({
        title: '提示',
        content: '用户没有登录'
      })
    }
  }
})