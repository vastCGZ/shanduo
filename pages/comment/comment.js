var postsData = require('../../data/posts_data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts_key: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.dynamicId);
    var that = this;    //调接口
    that.setData({
      posts_key: postsData.postList
    });
  },
})