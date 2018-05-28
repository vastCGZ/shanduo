// pages/activityevaluation_fq/activityevaluation_fq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one_2: 0,
    two_2: 5  
  },
  //情况二:用户给评分  
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
  }
})