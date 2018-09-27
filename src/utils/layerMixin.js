import store from '../store/index.js'
import Api from '../api/authApi'
export default{
    watch:{
        '$route':{
          handler: function (val, oldVal) {
            // console.log('route',_vue.$route)
            // console.log('val',val.path,'----',window._vue.$route)
               if(val.path==="/"+window._vue.$route.meta.parent){
                if(window._vue.$route.meta.parent==='Turntable'||window._vue.$route.meta.parent==='TurntableCCB') {
                  store.dispatch('business/getActivityInfoS')
                  return;
                }
                if(store.state.business.activityId!=window._vue.$route.query.activityId){
                  store.commit("business/setActivityId", window._vue.$route.query.activityId)
                  store.dispatch('business/getActivityInfoS')
                  return;
                }

                store.state.common.userInfo.userId&&store.dispatch('business/getCoMarketInfoStock')
               }

               if(val.path==="/"+window._vue.$route.meta.parent+'/CouponList'){
                store.state.common.userInfo.userId&&store.dispatch('coupon/getCoMarketAwardLog')
               }

            },
          deep: true
        }
      }
}