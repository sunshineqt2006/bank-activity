import common from './common'
import coupon from './coupon'
import Vue from 'vue'
import {createPersistedState} from './plugin'
import business from './business'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common: common,
    business: business,
    coupon:coupon
  },
  plugins: [
    createPersistedState({ //长期存储关键数据
      paths: [
        // 'coupon',
        'common.indexUrl',
        'common.userInfo',
        'common.token',
        'common.drawType',
        'common.object',
        'business.activityId',
        'business.activity',
        'business.btnStatus',
        'business.prize.result',
        'business.drawPrizeId'
        
      ]
    }),
    // createPersistedState({ //会话存储避免刷新丢失数据
    //   getState: key => JSON.parse(window.localStorage.getItem(key)),
    //   setState: (key, state) => window.localStorage.setItem(key, JSON.stringify(state)),
    // })
  ]
})
