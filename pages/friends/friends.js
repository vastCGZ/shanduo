const app = getApp()
const unicode_util = require('../../utils/unicode_util.js')
var webim = require('../../utils/webim.js')
Page({
  data: {
    //
    currentTab: 0,
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'F',
    // 导航字母
    letters: ['fenzu', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'],
    groups: [
      {
        groupName: 'fenzu',
        users: [
          {},
          {}
        ]
      }
    ],
    pageCount: 20,
    pageIndex: 1,
    host: null
  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return
    }
    that.setData({
      currentTab: !that.data.currentTab
    })
  },
  // onLoad: function (options) {
  //   const res = wx.getSystemInfoSync(),
  //     letters = this.data.letters;
  //   // 设备信息
  //   this.setData({
  //     windowHeight: res.windowHeight,
  //     windowWidth: res.windowWidth,
  //     pixelRatio: res.pixelRatio
  //   });
  //   // 第一个字母距离顶部高度，css中定义nav高度为73%，所以 *0.73
  //   const navHeight = this.data.windowHeight * 0.73, // 
  //     eachLetterHeight = navHeight / 26,
  //     comTop = (this.data.windowHeight - navHeight) / 2,
  //     temp = [];

  //   this.setData({
  //     eachLetterHeight: eachLetterHeight
  //   });

  //   // 求各字母距离设备左上角所处位置

  //   for (let i = 0, len = letters.length; i < len; i++) {
  //     const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
  //       y = comTop + (i * eachLetterHeight);
  //     temp.push([x, y]);
  //   }
  //   this.setData({
  //     lettersPosition: temp
  //   })
  // },
  // tabLetter(e) {
  //   const index = e.currentTarget.dataset.index;
  //   this.setData({
  //     selected: index,
  //     scrollIntoView: index
  //   })

  //   this.cleanAcitvedStatus();
  // },
  // // 清除字母选中状态
  // cleanAcitvedStatus() {
  //   setTimeout(() => {
  //     this.setData({
  //       selected: 0
  //     })
  //   }, 500);
  // },
  // touchmove(e) {
  //   const x = e.touches[0].clientX,
  //     y = e.touches[0].clientY,
  //     lettersPosition = this.data.lettersPosition,
  //     eachLetterHeight = this.data.eachLetterHeight,
  //     letters = this.data.letters;
  //   // 判断触摸点是否在字母导航栏上
  //   if (x >= lettersPosition[0][0]) {
  //     for (let i = 0, len = lettersPosition.length; i < len; i++) {
  //       // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
  //       const _y = lettersPosition[i][1], // 单个字母所处高度
  //         __y = _y + eachLetterHeight; // 单个字母最大高度取值范围
  //       if (y >= _y && y <= __y) {
  //         this.setData({
  //           selected: letters[i],
  //           scrollIntoView: letters[i]
  //         });
  //         break;
  //       }
  //     }
  //   }
  // },
  // touchend(e) {
  //   this.cleanAcitvedStatus();
  // }
  //   查询我的好友或黑名单
  // jattention/ attentionList
  // token
  // typeId 类型: 1, 好友;2,拉黑
  // page 页码
  // pageSize 记录数
  onShow: function () {
    var pages = getCurrentPages(); //获取加载的页面信息（结果是个数组）
    app.currentPage = pages[0].route;
  },
  onLoad: function (options) {
    this.setData({ host: app.host });
    this.loadFriends();
  },
  loadFriends: function () {
    var that = this;
    wx.request({
      url: app.host + '/jattention/attentionList',
      data: {
        token: app.globalData.userInfo.token, typeId: 1, page: that.data.pageIndex, pageSize: that.data.pageCount
      },
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, method: 'POST',
      success: (res) => {
        if (res.data.success) {
          var array = res.data.result;
          var groups = [];
          for (var i in array) {
            var item = array[i];
            var tag = unicode_util.makePy(item.name.substr(0, 1))[0];
            if (/^[0-9]$/.test(tag)) {
              tag = '#';
            }
            var atGroup = false;
            for (var j in groups) {
              var foundGroup = groups[j];
              if (foundGroup.groupName == tag) {
                atGroup = true;
                foundGroup.users.push(item);
                break;
              }
            }
            if (!atGroup) {
              var group = {};
              var users = [];
              group.groupName = tag;
              users.push(item);
              group.users = users;
              groups.push(group);
            }
          }
          var oldGroup = that.data.groups
          that.data.groups = oldGroup.concat(groups);
          that.setData({ groups: that.data.groups });
        }
      }
    })
  },
  openSession: function (e) {
    var data = e.currentTarget.dataset.current.split(',');
    wx.navigateTo({
      url: '/pages/interface/interface?toUserId=' + data[0] + '&toUserName=' + data[1] + ''
    })
  }
})