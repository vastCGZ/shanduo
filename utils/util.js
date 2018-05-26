const app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//弹出消息
function toast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}
//时间戳转本地时间
function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}
//非空校验
function checkInput(input) {
  if (!input) {
    return false;
  }
  input = input.replace(/\s/g, '');
  if (input.length == 0) {
    return false;
  }
  return true;
}
/*验证手机号*/
function checkPhone(str) {
  var myreg = /^(((13[0-9])|(15[0-9])|16[678]|17[0135678]|(18[0-9]))+\d{8})$/;
  return checkInput(str) && myreg.test(str);
}
//文件Base64编码微信小程序不支持
function encodeBase64(filePath, cbOk) {
  var reader = new FileReader();
  var rs = reader.readAsDataURL(filePath);
  reader.onload = function (e) {
    var dataBase64 = e.target.result;
    cbOk && cbOk(dataBase64);
  }
}
module.exports = {
  formatTime: formatTime,
  toast: toast,
  checkInput: checkInput,
  getLocalTime: getLocalTime,
  checkPhone: checkPhone,
  encodeBase64: encodeBase64
}
