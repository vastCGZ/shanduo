var API_URL = 'https://app.yapinkeji.com/activity/showHotActivity'

var requestHandler = {
  params: {},
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  
  },
}

//GET请求  
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理  
  var params = requestHandler.params;

  wx.request({
    url: API_URL,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理  
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete  
    }
  })
}
/*验证码倒计时 */
function getCode(_this, num) {
  _this.setData({
    isShow: true                    //按钮1隐藏，按钮2显示
  })
  var remain = num;             //用另外一个变量来操作秒数是为了保存最初定义的倒计时秒数，就不用在计时完之后再手动设置秒数
  var time = setInterval(function () {
    if (remain == 1) {
      clearInterval(time);
      _this.setData({
        sec: num,
        isShow: false
      })
      return false      //必须有
    }
    remain--;
    _this.setData({
      sec: remain
    })
  }, 1000)
}
module.exports = {
  GET,
  POST,
  getCode 
}
