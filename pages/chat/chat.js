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
        }
        that.setData({ recentContact: sessions });
        that.searchProfileByUserId(ids);
      }
    }, function (resp) {
      //错误回调
    });
  },
  newMessageNotification: function (obj) {
    console.log(obj);
    var that = this;
    var oldRecentContact = that.data.recentContact;
    var atList = false;
    for (var i in oldRecentContact) {
      if (obj.fromAccount == oldRecentContact[i].To_Account) {
        atList = true;
        var count = oldRecentContact[i].UnreadMsgCount;
        oldRecentContact[i].UnreadMsgCount = count + 1;
        that.setData({ recentContact: oldRecentContact });
        break;
      }
    }
    console.log(that.data.recentContact);
    if (!atList) {
      var newItem = {};
      newItem.MsgShow = obj.content;
      newItem.MsgTimeStamp = obj.time;
      newItem.To_Account = obj.fromAccount;
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
  }
})