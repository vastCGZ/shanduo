const API_URL = 'https://app.yapinkeji.com/'

function getApi(url, params) {
  return new Promise((res, rej) => {
    wx.request({
      url: API_URL + '/' + url,
      data: {
        type:"",
        lon: "",
        lat: "",
        page: "",
        pageSize: ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: res,
      fail: rej
    })
  })
}

  // url: 'https://app.yapinkeji.com/activity/showHotActivity?type=1&lon=22.09&lat=113.5&page=1&pageSize=5',

module.exports = {
  GetByParams(url, page = 1, pageSize = 10, search = '') {
    const params = { start: (page - 1) * pageSize, pageSize: pageSize }
    return getApi(url, search ? Object.assign(params, { q: search }) : params)
      .then(res => res.data)
  },
  GetById(url, id) {
    return getApi(url, id)
      .then(res => res.data)
  }
} 