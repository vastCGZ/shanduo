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

function toast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}
function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}
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
module.exports = {
  formatTime: formatTime,
  toast: toast,
  checkInput: checkInput,
  getLocalTime: getLocalTime,
  checkPhone: checkPhone
}
