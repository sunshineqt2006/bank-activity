import store from '../store/index.js'
import Api from '../api/apiHttp'
export function setTitle(title) {
  if (!title) return
  document.title = title;
  if (isIOS()) {
    let i = document.createElement('iframe')
    i.src = 'https://m.baidu.com/favicon.ico'
    i.style.display = 'none'
    i.onload = () => {
      setTimeout(() => i.remove(), 9)
    }
    document.body.appendChild(i)
  }
}

export function parseQueryString(str){
  var arr = []
  var length = 0
  var res = {};
  arr = str.split('&');
  length = arr.length;
  
  for(var i=0; i<length; i++){
      res[arr[i].split('=')[0]] = arr[i].split('=')[1];
  }
  return res;
}

export function setStoreTemp() {
  // localStorage.clear();
  const object=GetUrlParam('from').toLowerCase()
  let oldObject=store.state.common.object
  if(object) {
    store.commit('common/setObjectTemp',object)
    if(object!==oldObject) Api.getToken()
  }

}

export function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

export function isIOS() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (/iphone/.test(ua)) {
    return true;
  } else {
    return false;
  }
}

export function  getObjsByClass (param) {
  var tags = tags || document.getElementsByTagName("*");
  var list = [];
  for( var k in tags)
  {
      var tag = tags[k];
      if(tag.className == param) {
          document.write(tag.innerHTML);
          list.push(tag);
      }
  }
  return list;
}

export function goToWap() {
  window.location.href = _WAP_URL+"Index/index.html?token=ZMAXFILM" + 　'&from=' + _vue.$store.state.common.object + 　'&oldToken=' + _vue.$store.state.common.token + '&activityId=' + _vue.$store.state.business.activityId;
}

export function seeFilmDetail(id) {
  window.location.href = _WAP_URL+"Index/detail.html?token=ZMAXFILM" + 　'&from=' + _vue.$store.state.common.object + 　'&oldToken=' + _vue.$store.state.common.token + '&id=' + id + '&activityId=' + _vue.$store.state.business.activityId;
}

export function exchangeUrl() {
  _vue.$router.push({path:'/ExchangeDetail',query:{url:"https://article.zmaxfilm.com/blog/other/1529918590805"}})
}

export function merge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = merge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function countdown(timeStamp, fmt, cb) {
  var showText = ''
  if (timeStamp === 0) {
    window.timer && clearTimeout(window.timer);
    cb(0, '00:00')
    return false;
  }
  let day = parseInt(timeStamp / 60 / 60 / 24);
  let hr = parseInt(timeStamp / 60 / 60);
  let min = parseInt((timeStamp / 60) % 60);
  let sec = parseInt(timeStamp % 60);
  day > 0 ? hr + day * 24 : hr;
  hr = hr > 9 ? hr : "0" + hr;
  min = min > 9 ? min : "0" + min;
  sec = sec > 9 ? sec : "0" + sec;
  if (fmt === 'mm:ss') {
    showText = min + ':' + sec;
  } else if (fmt === 'hh:mm:ss') {
    showText = hr + ':' + min + ':' + sec;
  }
  window.timer && clearTimeout(window.timer)
  window.timer = setTimeout(function () {
    countdown(timeStamp, fmt, cb);
  }, 1000);
  cb(timeStamp, showText)
  timeStamp--;
}

export function GetUrlParam(paraName) {
  var url = document.location.toString();
  var arrObj = url.split("?");
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  }
  else {
    return "";
  }
}


Date.prototype.format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}