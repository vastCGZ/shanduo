Page({
  data: {
    //
    currentTab:0,
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    // 导航字母
    letters: ['fenzu','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'],
    groups: [
      {
        groupName: 'fenzu',
        users: [
          {},
          {}
        ]
      },
      {
        groupName: 'A',
        users: [
          {
            name: '阿码',
            avatar: '../../image/icon/portrait.png',
            WiFi: 'WiFi在线',
            title: '这是一道个性签名呀啊啊啊啊啊啊啊啊啊啊啊啊'
          }
        ]
      },
      {
        groupName: 'B',
        users: [
          {
            name: '白娘子',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'C',
        users: [
          {
            name: '陈大年',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'D',
        users: [
          {
            name: '邓牛牛',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'E',
        users: [
          {
            name: '而是一个人',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'F',
        users: [
          {
            name: '范长龙',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'G',
        users: [
          {
            name: '甘地',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'H',
        users: [
          {
            name: '何芸',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'I',
        users: [
          {
            name: '一个人',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'J',
        users: [
          {
            name: '剑圣',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'K',
        users: [
          {
            name: '开天辟地',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'L',
        users: [
          {
            name: '来呀，打我呀',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'M',
        users: [
          {
            name: '埋你',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'N',
        users: [
          {
            name: 'Nissan',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'O',
        users: [
          {
            name: '欧尼亚',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'P',
        users: [
          {
            name: '颦儿',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'Q',
        users: [
          {
            name: '群众',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'R',
        users: [
          {
            name: '肉丝',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'S',
        users: [
          {
            name: '施莱安',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'T',
        users: [
          {
            name: '谭老头儿',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'U',
        users: [
          {
            name: '欧阳明哥',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'V',
        users: [
          {
            name: 'Valentina',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'W',
        users: [
          {
            name: '魏神莫',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'X',
        users: [
          {
            name: '夏一天',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'Y',
        users: [
          {
            name: '呦，切克闹',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      },
      {
        groupName: 'Z',
        users: [
          {
            name: '灾难',
            avatar: '../../image/icon/portrait.png'
          }
        ]
      }
    ]
  },
  /** 
   * 点击活动，动态切换 
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return;
    } else {
      that.setData({
        currentTab: !that.data.currentTab
      })
    }
  },
  onLoad: function (options) {
    const res = wx.getSystemInfoSync(),
      letters = this.data.letters;
    // 设备信息
    this.setData({
      windowHeight: res.windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });
    // 第一个字母距离顶部高度，css中定义nav高度为73%，所以 *0.73
    const navHeight = this.data.windowHeight * 0.73, // 
      eachLetterHeight = navHeight / 26,
      comTop = (this.data.windowHeight - navHeight) / 2,
      temp = [];

    this.setData({
      eachLetterHeight: eachLetterHeight
    });

    // 求各字母距离设备左上角所处位置

    for (let i = 0, len = letters.length; i < len; i++) {
      const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
        y = comTop + (i * eachLetterHeight);
      temp.push([x, y]);
    }
    this.setData({
      lettersPosition: temp
    })
  },
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })

    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        selected: 0
      })
    }, 500);
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
      y = e.touches[0].clientY,
      lettersPosition = this.data.lettersPosition,
      eachLetterHeight = this.data.eachLetterHeight,
      letters = this.data.letters;
    // 判断触摸点是否在字母导航栏上
    if (x >= lettersPosition[0][0]) {
      for (let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
          __y = _y + eachLetterHeight; // 单个字母最大高度取值范围
        if (y >= _y && y <= __y) {
          this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
  touchend(e) {
    this.cleanAcitvedStatus();
  }
})