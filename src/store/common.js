

import Api from '../api/authApi'
let codeTime=null
export default {
  namespaced: true,
  state: {
    userInfo: {},
    token:'',
    drawType:-1,
    object:'',
    indexUrl:'',
    code:{
      showText:'获取验证码',
      isClick:true
    }
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info
    },
    setIndexUrl(state, url) {
      state.indexUrl = url
    },
    setToken(state, t){
      state.token = t;
    },
    setDrawType(state,drawType){
      state.drawType = drawType;
    },
    setObjectTemp(state,object){
      state.object = object;
    },
    setCode(state,params){
      state.code.showText=params.showText
      state.code.isClick=params.isClick
    }
  },
  actions: {
    getCode({ rootState, state, commit, dispatch },mobile){
      if (!mobile) {
        _vue.$vux.toast.text("请输入手机号");
        return;
      }
      if (!/^1\d{10}$/.test(mobile)) {
        _vue.$vux.toast.text("请输入正确的手机号");
        return;
      }
      if (!state.code.isClick) return;
        Api.getValidateCode("firstLogin", mobile).then(res => {
          var codeNum = res.data.deadline;
          if (codeTime) clearInterval(codeTime);
          commit('setCode',{showText:codeNum + "秒",isClick:false})
          codeTime = setInterval(function() {
            codeNum--;
            commit('setCode',{showText:codeNum + "秒",isClick:false})
            if (codeNum === 0) {
              commit('setCode',{showText:"重新获取验证码",isClick:true})
              clearInterval(codeTime);
              codeTime = null;
            }
          }, 1000);
        },err=>{
          _vue.$vux.toast.text(err.text);
          commit('setCode',{showText:"获取验证码",isClick:true})
        });
    },
    login({ rootState, state, commit, dispatch },loginInfo){
      
      if (!loginInfo.mobile) {
        _vue.$vux.toast.text("请输入手机号");
        return;
      }
      if (!/^1\d{10}$/.test(loginInfo.mobile)) {
        this.$vux.toast.text("请输入正确的手机号");
        return;
      }
      if (!loginInfo.verifyCode) {
        _vue.$vux.toast.text("验证码不能为空");
        return;
      }
      Api.login( loginInfo.mobile, loginInfo.verifyCode, loginInfo.userName).then(
        res => {
          commit("setUserInfo", res.data);
          _vue.$router.go(-1)
        },err => {
          _vue.$vux.toast.text(err.text);
        }
      );
    },
    isLogin({ rootState, state, commit, dispatch }){
      if(!state.userInfo.userId){
        _vue.$router.push({ path: "/" + window._vue.$route.meta.parent + "/Login"});
      }else{
        commit("setUserInfo", {});
      }
    }
  },
  getters: {
    
  }
}
