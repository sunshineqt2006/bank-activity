import axios from 'axios'
import signUtil from '../utils/signUtil'
import store from '../store/index.js'
let API_BASE_URL = _BASE_URL ? _BASE_URL : '';
let APP_ACCOUNT = 'zmaxfilm';
let APP_PASSWORD = 'adflkjlsda';
let API_VERSION = '1.3.6';

let token
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept':"application/json"
  },
  transformRequest: [function (data, headers) {
    return changeData(data);
  }],
});

function retry( config,retryDelay=200){
  config.url = config.url.replace(API_BASE_URL, '')
  config.data = urlToObject(config.data)
  //去除签名
  delete config.params.sign
  delete config.params.t
  //延时处理
  var backoff = new Promise(function(resolve) {
      setTimeout(function() {
          resolve();
      }, retryDelay);
  });
  //重新发起axios请求
  return backoff.then(function() {
      return instance.request(config);
  });
}

async function getToken(config) {
    var param = {};
    param['appAccount'] = APP_ACCOUNT;
    param['appPasswd'] = APP_PASSWORD;
    param['appVersion'] = APP_ACCOUNT;
    param['deviceNumber'] = '';
    if(store.state.common.token){
      param['tokenId'] = store.state.common.token;
    }
    param['deviceType'] =store.state.common.object

    console.log('param',param)
    var res = await instance.post('/service/getToken', param, {tryAgain: true});


    console.log('res',res)
  if (res && res.data && res.data.tokenId) {
    token = res.data.tokenId
    // localStorage.setItem("token",token);
    console.log('token',token)
    store.commit('common/setToken',token)
  }

  if (config) {
    config.params.sign = getSign(config.params, config.dataObj);
    config.tryAgain = true
    config.data = urlToObject(config.data)//data重置
    config.url = config.url.replace(API_BASE_URL, '')//二次请求url重复
    res = await instance.request(config)
  }
  return res
}

function getSign(params, data) {
  delete params.sign
  token= store.state.common.token?store.state.common.token:'0552a7361f6fdfb829f5fc442d92d736a';
  if (token) {
    params.tokenId = token
  }
  let timeStr = new Date().getTime().toString();
  params.t = timeStr
  let params_temp = Object.assign({}, params)
  // console.log('params_temp',params_temp)
  if (data) {
    params_temp = Object.assign(params_temp, data)
  }

  return signUtil.getSign(params_temp)
}

function changeData(data) {

  if (!data)
    return data
  let str = ''
  let keys = Object.keys(data)
  if (!keys || keys.length == 0)
    return data
  keys.forEach(function (element) {
    str += '&' + element + "=" + data[element]
  }, this);
  return str.substring(1, str.length)
}


var urlToObject = function (urlParams) {
  var urlObject = {};
  if (urlParams) {
    var urlString = urlParams
    var urlArray = urlString.split("&");
    for (var i = 0, len = urlArray.length; i < len; i++) {
      var urlItem = urlArray[i];
      var item = urlItem.split("=");
      urlObject[item[0]] = item[1];
    }
    return urlObject;
  }
};

instance.interceptors.request.use(config => {

  if (!config.params) {
    config.params = {}
  }
  let sign = getSign(config.params, config.data);
  //添加sign
  config.params.sign = sign
  return config;
});

instance.interceptors.response.use(response => {
  let data = response.data
  if (data.status == 0) {
    return data
  } else {
    // console.log("response error", data)
    if (!response.config.tryAgain && (data && data.status == '10001')) {
      _vue.$vux.loading.hide();
      return getToken(response.config)
    }

    if(data&&data.status=="20001"){
      window._vue.$store.commit('common/setUserInfo',{})

      window._vue.$router.push({path:'/'+window._vue.$route.meta.parent+'/Login'})
      return;
    }
    return Promise.reject(data);
  }
}, error => {
  // if(error.message.indexOf("502")!= -1||error.message.indexOf("503")!= -1){
  //   setTimeout(()=>{
  //     var originalRequest = error.config;
  //     originalRequest._retry = true
  //     originalRequest.url=originalRequest.url.slice(7)
  //     originalRequest.data=_vue.$util.parseQueryString(originalRequest.data)
  //     console.log('originalRequest',originalRequest)
  //     return instance.request(originalRequest);
  // },3000)

  // }

  // window._vue.$vux.loading.hide();
  if(error.response&&(error.response.status==502||error.response.status==503)){
    return retry(error.response.config)
  }
  return Promise.reject(error);
});


function get(url, params) {
  return instance.get(url, {params: params})
}

function post(url, params) {
  return instance.post(url, params)
}


function getTheatre(url, params) {
  return instance.get('/theatre'+url, {params: params})
}


export default {
  getToken,
  instance,
  get,
  post,
  getTheatre,
}
