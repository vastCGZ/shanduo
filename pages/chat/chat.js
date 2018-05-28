
var webim = require('../../utils/webim.js');
var util = require('../../utils/util.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentContact: [],//最近联系人
    startX: 0, //开始坐标
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    WxNotificationCenter.addNotification('newMessageNotification', that.newMessageNotification, that);
    webim.getRecentContactList({
      'Count': 10 //最近的会话数 ,最大为 100
    }, function (resp) {
      console.log(resp);
      //业务处理
      if (resp.SessionItem) {
        var ids = [];
        var sessions = resp.SessionItem;
        for (var i in sessions) {
          ids.push(sessions[i].To_Account);
          sessions[i].MsgTimeStamp = util.getLocalTime(sessions[i].MsgTimeStamp);
          sessions[i].isTouchMove = false;
        }
        that.setData({
          recentContact: sessions
        });
        that.searchProfileByUserId(ids)
      }
    }, function (resp) {
      //错误回调
    })

  },
  onUnload: function () {
    WxNotificationCenter.removeNotification('newMessageNotification', this);
  },
  newMessageNotification: function (obj) {
    var that = this;
    var oldRecentContact = that.data.recentContact;
    var atList = false;
    for (var i in oldRecentContact) {
      if (obj.fromAccount == oldRecentContact[i].To_Account) {
        atList = true;
        var count = oldRecentContact[i].UnreadMsgCount;
        oldRecentContact[i].UnreadMsgCount = count + 1;
        oldRecentContact[i].MsgShow = obj.content;
        that.setData({ recentContact: oldRecentContact });
        break;
      }
    }
    if (!atList) {
      var newItem = {};
      newItem.MsgShow = obj.content;
      newItem.MsgTimeStamp = obj.time;
      newItem.To_Account = obj.fromAccount;
      newItem.isTouchMove = false;
      newItem.UnreadMsgCount = 1;
      var oldRecentContact = that.data.recentContact;
      oldRecentContact.push(newItem);
      that.setData({ recentContact: oldRecentContact });
      that.searchProfileByUserId([obj.fromAccount]);
    }
  },
  //搜索用户
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
            for (var k in lls) {
              if (to_account == lls[k].To_Account) {
                lls[k].Nick = webim.Tool.formatText2Html(nick);
                lls[k].Gender = gender;
                lls[k].Image = imageUrl;
                that.setData({ recentContact: lls });
                break;
              }
            }
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  },
  gotoSessionView: function (e) {
    var data = e.currentTarget.dataset.current.split(',');
    var To_Account = data[0];
    var oldRecentContact = this.data.recentContact;
    for (var i in oldRecentContact) {
      if (To_Account == oldRecentContact[i].To_Account) {
        oldRecentContact[i].UnreadMsgCount = 0;
        this.setData({ recentContact: oldRecentContact });
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/interface/interface?toUserId=' + data[0] + '&toUserName=' + data[1] + ''
    })
  },

  //侧滑删除
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.recentContact.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      recentContact: this.data.recentContact
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.recentContact.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      recentContact: that.data.recentContact
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.index.split(',');
    //sess_type == 'C2C' ? 1 : 2;
    var data = {
      'To_Account': val[1],
      'chatType': 1
    }
    webim.deleteChat(
      data,
      function (resp) {
        that.data.recentContact.splice(val[0], 1)
        that.setData({
          recentContact: that.data.recentContact
        })
      }
    );
  }
})