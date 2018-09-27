
import Api from '../api/authApi'
export default {
  namespaced: true,
  state: {
    couponList:[]
  },
  mutations: {
    setCoupon(state,c){
      state.couponList =c;
    }

  },
  actions: {
    lookCoupons({ rootState, state, commit, dispatch }){
      if (!rootState.common.userInfo.userId) {
        _vue.$router.push({ path: "/" + window._vue.$route.meta.parent + "/Login"});
          return false;
      }
      _vue.$router.push({path: "/" + window._vue.$route.meta.parent + "/CouponList"});
    },
    getCoMarketAwardLog({ rootState, state, commit, dispatch }){
      _vue.$vux.loading.show({ text: "加载中..." });
        Api.getCoMarketAwardLog().then(res => {
              _vue.$vux.loading.hide();
              commit('setCoupon',res.data)
            },
            err => {
              _vue.$vux.loading.hide();
              _vue.$vux.toast.text(err.text);
            }
        );
    }
  },
  getters: {

  }
}
