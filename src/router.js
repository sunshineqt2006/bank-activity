import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import Api from './api/authApi'
import { setTitle,setStoreTemp } from './utils'

Vue.use(VueRouter);

setStoreTemp()  //缓存来源from参数

// console.log('111',document.location.href)


if(store.state.common.object==='ccb'){
  require('@/views/ccb/style.less')   //引入各自不同的样式
}else if(store.state.common.object==='abc'||store.state.common.object==='unionpay_abc'){
  require('@/views/abc/style.less')   //引入各自不同的样式
}else if(store.state.common.object==='cib'){
  require('@/views/cib/style.less')   //引入各自不同的样式
}else if(store.state.common.object==='ilike'){
  require('@/views/ilike/style.less')   //引入各自不同的样式
}


const routes=[
  //爱来-翻牌-中秋
  { path: '/ILIKE-Poker-MidAutumn',meta: { title: "花好月正圆，最美人团圆",drawType:2,parent:'ILIKE-Poker-MidAutumn'}, component: () => import('@/views/ilike/poker/Index.vue')},
  { path: '/ILIKE-Poker-MidAutumn/Login',meta: { title: "登录",drawType:2,parent:'ILIKE-Poker-MidAutumn'}, component: () => import('@/views/ilike/poker/Login.vue')},
  { path: '/ILIKE-Poker-MidAutumn/CouponList',meta: { title: "优惠券",drawType:2,parent:'ILIKE-Poker-MidAutumn'}, component: () => import('@/views/ilike/poker/CouponList.vue')},


  //兴业-抽奖
  { path: '/CIB-Index',meta: { title: "特惠购票",drawType:1,parent:'CIB-Index'}, component: () => import('@/views/cib/default/Index.vue')},
  { path: '/CIB-Index/Login',meta: { title: "登录",drawType:1,parent:'CIB-Index'}, component: () => import('@/views/cib/default/Login.vue')},
  { path: '/CIB-Index/CouponList',meta: { title: "优惠券",drawType:1,parent:'CIB-Index'}, component: () => import('@/views/cib/default/CouponList.vue')},

  //农行大转盘
  { path: '/ABC-Turntable',meta: { title: "浓情夏意好运转",drawType:2,parent:'ABC-Turntable' }, component: () => import('@/views/abc/turntable/Index.vue')},
  { path: '/ABC-Turntable/Login',meta: { title: "登录",drawType:2,parent:'ABC-Turntable'}, component: () => import('@/views/abc/turntable/Login.vue')},
  { path: '/ABC-Turntable/CouponList',meta: { title: "优惠券",drawType:2,parent:'ABC-Turntable'}, component: () => import('@/views/abc/turntable/CouponList.vue')},

  //农行-大转盘-教师节
  { path: '/ABC-Turntable-teacher',meta: { title: "浓情满载，匠心献礼",drawType:2,parent:'ABC-Turntable-teacher' }, component: () => import('@/views/abc/turntable-teacher/Index.vue')},
  { path: '/ABC-Turntable-teacher/Start',meta: { title: "浓情满载，匠心献礼",drawType:2,parent:'ABC-Turntable-teacher' }, component: () => import('@/views/abc/turntable-teacher/Start.vue')},
  { path: '/ABC-Turntable-teacher/Login',meta: { title: "登录",drawType:2,parent:'ABC-Turntable-teacher'}, component: () => import('@/views/abc/turntable-teacher/Login.vue')},
  { path: '/ABC-Turntable-teacher/CouponList',meta: { title: "优惠券",drawType:2,parent:'ABC-Turntable-teacher'}, component: () => import('@/views/abc/turntable-teacher/CouponList.vue')},

  //农行-抽奖
  { path: '/ABC-Index',meta: { title: "特惠购票",drawType:1,parent:'ABC-Index'}, component: () => import('@/views/abc/default/Index.vue')},
  { path: '/ABC-Index/Login',meta: { title: "登录",drawType:1,parent:'ABC-Index'}, component: () => import('@/views/abc/default/Login.vue')},
  { path: '/ABC-Index/CouponList',meta: { title: "优惠券",drawType:1,parent:'ABC-Index'}, component: () => import('@/views/abc/default/CouponList.vue')},

  //农行-九宫格
  { path: '/ABC-Squares',meta: { title: "拆红包",drawType:2,parent:'ABC-Squares'}, component: () => import('@/views/abc/squares/Index.vue')},
  { path: '/ABC-Squares/Login',meta: { title: "登录",drawType:2,parent:'ABC-Squares'}, component: () => import('@/views/abc/squares/Login.vue')},
  { path: '/ABC-Squares/BagDetail',meta: { title: "红包明细",drawType:2,parent:'ABC-Squares'}, component: () => import('@/views/abc/squares/BagDetail.vue')},

  //建行抽奖
  { path: '/CCB-Index',meta: { title: "特惠购票",drawType:1,parent:'CCB-Index'}, component: () => import('@/views/ccb/default/Index.vue')},
  { path: '/CCB-Index/Login',meta: { title: "登录",drawType:1,parent:'CCB-Index'}, component: () => import('@/views/ccb/default/Login.vue')},
  { path: '/CCB-Index/CouponList',meta: { title: "优惠券",drawType:1,parent:'CCB-Index'}, component: () => import('@/views/ccb/default/CouponList.vue')},

  //建行翻牌
  { path: '/CCB-Poker',meta: { title: "暑期档好片连翻",drawType:2,parent:'CCB-Poker'}, component: () => import('@/views/ccb/poker/Index.vue')},
  { path: '/CCB-Poker/Login',meta: { title: "登录",drawType:2,parent:'CCB-Poker' }, component: () => import('@/views/ccb/poker/Login.vue')},
  { path: '/CCB-Poker/CouponList',meta: { title: "优惠券",drawType:2,parent:'CCB-Poker'}, component: () => import('@/views/ccb/poker/CouponList.vue')},

  //建行大转盘
  { path: '/CCB-Turntable',meta: { title: "好运转转转",drawType:2,parent:'CCB-Turntable'}, component: () => import('@/views/ccb/turntable/Index.vue')},
  { path: '/CCB-Turntable/Login',meta: { title: "登录",drawType:2,parent:'CCB-Turntable' }, component: () => import('@/views/ccb/turntable/Login.vue')},
  { path: '/CCB-Turntable/CouponList',meta: { title: "优惠券",drawType:2,parent:'CCB-Turntable'}, component: () => import('@/views/ccb/turntable/CouponList.vue')},

  { path: '/PaySuccess',meta: { title: "支付" }, component: () => import('@/views/PaySuccess.vue')},
  { path: '/ErrorPage',meta: { title: "啊哦！暂无活动" }, component: () => import('@/views/ErrorPage.vue')},
  { path: '/ExchangeDetail',meta: { title: "兑换细则" }, component: () => import('@/views/ExchangeDetail.vue')},
  { path: '/*', redirect: '/ErrorPage'}
]



const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  store.commit('common/setDrawType',to.meta.drawType)
  let title = to.query.title ? to.query.title : (to.meta.title ? to.meta.title : '')
  setTitle(title)

  if(to.query.from==='abc'&&to.query.ticket){
    Api.login(null,null,to.query.ticket).then(res=>{
      store.commit("common/setUserInfo", res.data);
      next()
    },error=>{
      next()
    })
  }else{
    next()
  }
})


export default router
