Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ["10", "20", "30", "40", "50"],
    index: 0,
    array1: ["10", "20", "30", "40", "50"],
    index1: 0,
  },
  onLoad: function (options) {
  
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
  }
})