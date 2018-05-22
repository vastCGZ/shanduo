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

module.exports = {
  formatTime: formatTime,
  toast: toast,
  checkInput: checkInput
}
