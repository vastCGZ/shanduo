//app.js
var webimhandler = require('/utils/webim_handler.js');
var webim = require('/utils/webim.js');
var WxNotificationCenter = require('/utils/WxNotificationCenter.js');
var Config = {
  sdkappid: 1400088239,
  accountType: 25943,
  accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};
App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'localUser',
      success: function (res) {
        that.globalData.userInfo = res.data;
        that.initIM();
      }
    });
    WxNotificationCenter.addNotification('onConnNotify', that.onConnNotify, that);
  },
  initIM: function (cbOk) {
    var that = this;
    // var avChatRoomId = '@TGS#aWTBZTDFW';
    webimhandler.init({
      accountMode: Config.accountMode
      , accountType: Config.accountType
      , sdkAppID: Config.sdkappid
    });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': Config.sdkappid, //用户所属应用id，必填
      'accountType': Config.accountType, //用户所属应用帐号类型，必填
      'identifier': that.globalData.userInfo.userId, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': that.globalData.userInfo.name, //当前用户昵称，选填
      'userSig': that.globalData.userInfo.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };
    //监听事件
    var listeners = {
      "onConnNotify": webimhandler.onConnNotify, //选填, 
      //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
      'isLogOn': false//是否开启控制台打印日志,默认开启，选填
    };
    //sdk登录
    webimhandler.sdkLogin(loginInfo, listeners, options, cbOk);
  },
  //连接状态通知处理
  onConnNotify: function (obj) {
    this.globalData.actionStatus = obj;
  },
  globalData: {
    userInfo: null,
    actionStatus: ''
  },
  host: 'https://yapinkeji.com/shanduoparty'
})