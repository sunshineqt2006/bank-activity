
import Api from '../api/authApi'
import noPrizePic from "assets/images/no_prize_img.png";
var timerI = null
var errTime=null
var _nextTime = 0
var _nextTime_hidden = 0
var _nextTime_show = 0
var isWebkitvisibilitychangeRead = false
export default {
    namespaced: true,
    state: {
        activityId: '',
        activity: {},
        unpaidTime: {
            time: {
                timeStamp: 1,
                text: '',
            },
            isShow: false
        },
        btnStatus: {
            text: "",
            disabled: true
        },
        activityTime: {
            isShowTime: true,
            time: {
                day: 0,
                hr: 0,
                min: 0,
                sec: 0,
            }
        },
        drawPrizeId: '',
        prize: {
            result: {},
            unpaidTime: {
                timeStamp: 1,
                text: ''
            },
            isShow: false
        }
    },
    mutations: {
        setdrawPrizeId(state, prizeId) {
            state.drawPrizeId = prizeId;
        },
        setActivityId(state, activityId) {
            state.activityId = activityId;
        },
        setActivityInfo(state, activity) {
            state.activity = activity;
        },
        setUnpaidTime(state, info) {   //设置支付倒计时
            state.unpaidTime.time = info;
        },
        setUnpaidTimeShow(state, isShow) {   //设置支付倒计时是否显示
            state.unpaidTime.isShow = isShow
        },
        setBtnStatus(state, info) {
            state.btnStatus = info
        },
        setActivityShow(state, c) {
            state.activityTime.isShowTime = c
        },
        setActivityTime(state, time) {
            state.activityTime.time = time
        },
        setPrize(state, params) {
            state.prize.result = params.result
            state.prize.isShow = params.isShow
            state.prize.unpaidTime = params.unpaidTime
        }
    },
    actions: {
        //获取活动详情
        getActivityInfoS({ rootState, state, commit, dispatch }) {
            rootState.common.indexUrl=document.location.href
            return new Promise((resolve, reject) => {
                errTime&&clearTimeout(errTime)
                _vue.$vux.loading.show({ text: "加载中..." });
                Api.getCoMarketInfo(state.activityId).then(res => {
                    var obj = JSON.parse(JSON.stringify(res.data))
                    obj.banerList = [];
                    res.data.bannerConfig && res.data.bannerConfig.forEach(a => {
                        obj.banerList.push({
                            url: a.jumpUrl,
                            img: a.imgUrl
                        });
                    });
                    delete obj.bannerConfig
                    commit('setActivityInfo', obj)
                    dispatch('getCoMarketInfoTime')
                    rootState.common.userInfo.userId && dispatch('getCoMarketInfoStock')
                    resolve()
                }, error => {
                    _vue.$vux.loading.hide()
                    _vue.$vux.toast.text(error.text||'系统异常');
                })
            })
        },
        getCoMarketInfoTime({ rootState, state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                errTime&&clearTimeout(errTime)
                state.btnStatus = { text: "", disabled: true };
                Api.getCoMarketInfoTime(state.activityId).then(res => {
                    _vue.$vux.loading.hide()
                    commit('setActivityInfo', Object.assign(state.activity, res.data))

                    if (res.data.nextTime > 0) {
                        commit('setBtnStatus', { text: "活动未开始", disabled: false })
                    }

                    if (res.data.nextTime ==='end') {
                        commit('setActivityShow',false)
                        commit('setBtnStatus', { text: "活动已结束", disabled: false })
                    }

                    timerI && clearTimeout(timerI);

                    !isWebkitvisibilitychangeRead&&document.addEventListener('webkitvisibilitychange', function() {
                        if (document.webkitVisibilityState == 'hidden') { 
                            _nextTime_hidden = _nextTime
                        } else {
                            _nextTime_show = _nextTime
                            if(_nextTime_hidden-_nextTime_show<2){
                                dispatch('getCoMarketInfoTime')
                            }
                        } 
                    })
                    isWebkitvisibilitychangeRead = true
                    dispatch('countdown', Math.abs(res.data.nextTime))

                }, error => {
                    _vue.$vux.loading.hide()
                    _vue.$vux.toast.text(error.text);
                })
            })
        },
        countdown({ rootState, state, commit, dispatch }, nextTime) {
            _nextTime = nextTime
            let day = parseInt(nextTime / 60 / 60 / 24);
            let hr = parseInt(nextTime / 60 / 60);
            let min = parseInt((nextTime / 60) % 60);
            let sec = parseInt(nextTime % 60);
            let obj = {}
            obj.day = day
            day > 0 ? hr + day * 24 : hr;
            obj.hr = hr > 9 ? hr.toString().split("") : ["0", hr];
            obj.min = min > 9 ? min.toString().split("") : ["0", min];
            obj.sec = sec > 9 ? sec.toString().split("") : ["0", sec];
            commit('setActivityTime', obj)
            if (nextTime === 0) dispatch('getCoMarketInfoTime')
            if (!nextTime) return;
            nextTime--;
            timerI = setTimeout(function () {
                dispatch('countdown', nextTime)
            }, 1000);
        },
        getCoMarketInfoStock({ rootState, state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                errTime&&clearTimeout(errTime)
                Api.getCoMarketInfoStock(state.activityId).then(res => {
                    var obj = JSON.parse(JSON.stringify(state.activity))
                    obj.cycle = res.data.cycle
                    obj.remainDrawNum = res.data.remainDrawNum
                    obj.unpaid = res.data.unpaid
                    obj.cashTip=res.data.cashTip
                    obj.isDrawPay=res.data.isDrawPay
                    obj.surplusPrize = res.data.surplusPrize
                    obj.prizeList && obj.prizeList.forEach(a => {
                        res.data.prizeList && res.data.prizeList.forEach(b => {
                            if (a.prizeId === b.prizeId) {
                                a.remainDrawNum = b.remainDrawNum
                            }
                        })
                    })
                    commit('setActivityInfo', obj)

                    //兴业银行抽奖特殊处理

                    if (rootState.common.object === 'cib') {
                        if(state.activity.remainDrawNum <= 1)  commit('setBtnStatus', { text: "机会已用完", disabled: false })
                        state.activity.remainDrawNum=state.activity.remainDrawNum-1
                        commit('setActivityInfo', state.activity)
                      }


                    commit('setUnpaidTimeShow', res.data.unpaid ? true : false)
                    state.activity.unpaid && state.unpaidTime.time.timeStamp && _vue.$util.countdown(Math.abs(state.activity.unpaid.countDown), "mm:ss", (timeStamp, showText) => {
                        if (timeStamp == 0) dispatch('getCoMarketInfoStock')
                        state.unpaidTime.time.timeStamp = timeStamp;
                        state.unpaidTime.time.text = showText;
                        commit('setUnpaidTime', state.unpaidTime.time)
                    }
                    );
                }, error => {
                    _vue.$vux.loading.hide()
                    _vue.$vux.toast.text(error.text);
                })
            })
        },
        drawPrize({ rootState, state, commit, dispatch }, params) {

            return new Promise((resolve, reject) => {

                if (!rootState.common.userInfo.userId) {
                    _vue.$router.push({ path: "/" + window._vue.$route.meta.parent + "/Login" });
                    return false;
                }

                if (!state.btnStatus.disabled) {
                    _vue.$vux.toast.text(state.btnStatus.text);
                    return false;
                }

                if(Number(state.activity.drawPay)&&state.activity.remainDrawNum<=0){
                    var str=_HTTP_URL+"#"+_vue.$route.path+"?activityId="+state.activityId
                    Api.abcMarketPay(state.activityId, "1",str).then(res => {
                      window.location.href =res.data.abchinapay.paymentURL;
                    });
                    return;
                  }
                if (!params.remainDrawNum) {
                    _vue.$vux.toast.text('您的机会用完了哦！');
                    return false;
                }

                if(params.beforeDraw) params.beforeDraw()
                commit("setdrawPrizeId", params.prizeId);
                commit('setPrize', { result: {}, isShow: false, unpaidTime: { timeStamp: 1 } })

                // commit('setPrize', { result: {}, isShow: false, unpaidTime: { timeStamp: 1 } })
                Api.drawPrize(state.activityId, params.prizeId).then(res => {
                    _vue.$vux.loading.show({ text: "抽奖中..." });
                    if(!params.isResult){
                        dispatch('getDrawResult', { prizeId: params.prizeId, drawcode: res.data})
                    }
                    resolve(res)
                }, err => {
                    _vue.$vux.loading.hide();
                    _vue.$vux.toast.text(err.text);
                    params.errResult&&params.errResult()
                }
                );
            })
        },
        getDrawResult({ rootState, state, commit, dispatch }, params) {
            return new Promise((resolve, reject) => {
                Api.getDrawResult(state.activityId, params.prizeId, params.drawcode).then(res => {
                    if (res.data.code === 1) {
                        setTimeout(() => {
                            dispatch('getDrawResult', {prizeId:params.prizeId, drawcode:params.drawcode})
                        }, 2000);
                        return;
                    }
                    commit('setUnpaidTimeShow', false)
                    _vue.$vux.loading.hide()
                    res.data.result.prizeId = params.prizeId
                    res.data.result.prizePic = res.data.result.prizePic || noPrizePic;
                    if(params.isResult) {
                        resolve(res.data.result)
                        return;
                    }
                    commit('setPrize', { result: res.data.result, isShow: true, unpaidTime: { timeStamp: 1 } })

                    state.prize.result.isAward && Number(state.prize.result.payMoney) && state.prize.unpaidTime.timeStamp && _vue.$util.countdown(Math.abs(state.prize.result.payTime), 'mm:ss', (timeStamp, showText) => {
                        if (timeStamp == 0) {
                            commit('setPrize', { result: {}, isShow: false, unpaidTime: { timeStamp: 1 } })
                            dispatch('getCoMarketInfoStock')
                            return false;
                        };
                        commit('setPrize', { result: res.data.result, isShow: true, unpaidTime: { timeStamp: timeStamp, text: showText } })
                    })
                }, err => {
                    _vue.$vux.loading.hide();
                    _vue.$vux.toast.text(err.text);
                    reject&&reject()
                })
            })


        },
        closeDialog({ rootState, state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
            if (state.prize.result.isAward == "1" && Number(state.prize.result.payMoney) != 0) {
                _vue.$vux.confirm.show({
                    title: "温馨提示",
                    content: "取消支付您将放弃本次抢购所得的优惠，再考虑一下吧？",
                    confirmText: "继续支付",
                    cancelText: "取消支付",
                    onCancel() {
                        Api.cancelCoMarketPay(state.prize.result.awardOrderNo).then(res => {
                            _vue.$vux.toast.text("取消成功");
                            commit('setPrize', { result: {}, isShow: false, unpaidTime: { timeStamp: 1 } })
                            dispatch('getCoMarketInfoStock')
                            window.timer && clearTimeout(window.timer)
                            resolve()
                        }, err => {
                            _vue.$vux.toast.text(err.text);
                        });
                    },
                    onConfirm() {
                        _vue.$vux.confirm.hide();
                    }
                });
            } else {
                commit('setPrize', { result: {}, isShow: false, unpaidTime: { timeStamp: 1 } })
                dispatch('getCoMarketInfoStock')
                resolve()
            }
        })
        },
        goPay({ rootState, state, commit, dispatch }, awardOrderNo) {
            _vue.$vux.loading.show({ text: "支付中..." });
            var str = ''
            var str = _HTTP_URL + "PaySuccess?awardOrderNo=" + awardOrderNo

            Api.coMarketPay(awardOrderNo, str).then(res => {
                _vue.$vux.loading.hide()
                if (rootState.common.object === 'ccb') {
                    window.location.href = "https://ibsbjstar.ccb.com.cn/CCBIS/ccbMain?" + res.data.ccbpay.paymentURL;
                } else if (rootState.common.object === 'abc') {
                    window.location.href = res.data.abchinapay.paymentURL;
                } else if (rootState.common.object === 'cib'||rootState.common.object === 'unionpay_abc') {
                    dispatch('cibPay', res)
                }
            }, err => {
                _vue.$vux.loading.hide()
                _vue.$vux.toast.text(err.text);
            });
        },
        cibPay({ rootState, state, commit, dispatch }, res) {
            var _params = res.data.params;
            var _form = "";
            _form += '<form id="pay_form" name="pay_form" action="' + res.data.uri + '" method="post">';
            for (var key in _params) { _form += '<input type="hidden" name="' + key + '" id="' + key + '" value="' + _params[key] + '" />' };
            _form += '        </form>';
            $("body").append(_form);
            $("#pay_form").submit()

        },

    },
    getters: {

    }
}
