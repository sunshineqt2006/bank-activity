import apiHttp from './apiHttp'
import store from '../store/index.js'


/**
 * 用户登出
 *
 * @param {*} success_cb
 * @param {*} fail_cb
 */
function logout() {
    return apiHttp.get('/user/logout', {})
}


function login(mobile,verifyCode,ticket) {
    var params={}
    if(ticket){
        params.ticket=ticket
    }else{
        params.mobile=mobile
        params.verifyCode=verifyCode
    }
    params.type=3
    return apiHttp.post('/user/bindRegistedMobileForThirdLogin',params)
}

function getUserInfo() {
    return apiHttp.post('/user/getUserInfo')
}

/**
 * 获取验证码
 */
function getValidateCode(codeType, userMobile) {
    return apiHttp.post('/service/getValidateCode', {
        userMobile: userMobile,
        codeType: codeType || 'firstLogin'
    })
}

function checkNamelist(whi) {
    return apiHttp.post('/CoMarket/checkNamelist', {
        activityId: store.state.common.activityId,
        whi: whi
    })
}

function getCoMarketList(activityId) {
    return apiHttp.post('/user/getCoMarketList',{
        activityId:activityId
    })
}

//抽奖
function drawPrize(activityId,prizeId) {
    return apiHttp.post('/CoMarket/drawPrize',{
        activityId:activityId,
        prizeId:prizeId
    })
}
//获取抽奖结果
function getDrawResult(activityId,prizeId,drawcode) {
    return apiHttp.post('/CoMarket/getDrawResult',{
        activityId:activityId,
        prizeId:prizeId,
        drawcode:drawcode
    })
}

function getCoMarketAwardLog() {
    return apiHttp.post('/user/getCoMarketAwardLog',{
        activityId:store.state.business.activityId
    })
}

function coMarketPay(awardOrderNo,fourl) {
    var pramas={}
    pramas.awardOrderNo=awardOrderNo;
    // pramas.payType=store.state.common.object;
    if(fourl) pramas.fourl=fourl;
    return apiHttp.post('/user/coMarketPay',pramas)
}


function abcMarketPay(activityId,orderType,fourl) {
    var pramas={}
    pramas.activityId=activityId;
    pramas.orderType=orderType;
    if(fourl) pramas.fourl=fourl;
    return apiHttp.post('/user/addCoPayOrder',pramas)
}

function cancelCoMarketPay(awardOrderNo) {
    return apiHttp.post('/user/cancelCoMarketPay',{
        awardOrderNo:awardOrderNo
    })
}

function getCoMarketAwardLogStatus(awardOrderNo) {
    return apiHttp.post('/user/getCoMarketAwardLogStatus',{
        awardOrderNo:awardOrderNo
    })
}

function setComarketIOSToken(awardOrderNo,activityId,tokenId) {
    return apiHttp.post('/user/setComarketIOSToken',{
        awardOrderNo:awardOrderNo,
        tokenId:tokenId,
        activityId:activityId
    })
}

function getComarketIOSToken(awardOrderNo) {
    return apiHttp.post('/user/getComarketIOSToken',{
        awardOrderNo:awardOrderNo,
    })
}

function getBagDetail(activityId){
    return apiHttp.post('/CoMarket/getCoCashBonus',{
        activityId:activityId
    })
}

//获取活动详情
function getCoMarketInfo(activityId){
    return apiHttp.post('/CoMarket/getCoMarketInfo',{
        activityId:activityId
    })
}

//获取活动时间
function getCoMarketInfoTime(activityId){
    return apiHttp.post('/CoMarket/getCoMarketInfoTime',{
        activityId:activityId
    })
}

//获取活动抢购次数
function getCoMarketInfoStock(activityId){
    return apiHttp.post('/CoMarket/getCoMarketInfoStock',{
        activityId:activityId
    })
}

//获取抽奖结果
function exchangePrize(checkCode,awardLogId) {
    return apiHttp.post('/CoMarket/exchangePrize',{
        activityId:store.state.business.activityId,
        checkCode:checkCode,
        awardLogId:awardLogId
    })
}

//退款
function backThirdParty(awardLogId){
    return apiHttp.post('/CoMarket/backThirdParty',{
        activityId:store.state.business.activityId,
        awardLogId:awardLogId
    })
}



export default {
    logout: logout,
    getValidateCode: getValidateCode,
    login:login,
    getCoMarketList:getCoMarketList,
    drawPrize:drawPrize,
    getCoMarketAwardLog:getCoMarketAwardLog,
    coMarketPay:coMarketPay,
    abcMarketPay:abcMarketPay,
    cancelCoMarketPay:cancelCoMarketPay,
    getCoMarketAwardLogStatus:getCoMarketAwardLogStatus,
    setComarketIOSToken:setComarketIOSToken,
    getComarketIOSToken:getComarketIOSToken,
    getUserInfo:getUserInfo,
    getBagDetail:getBagDetail,
    getCoMarketInfo:getCoMarketInfo,
    getCoMarketInfoTime:getCoMarketInfoTime,
    getCoMarketInfoStock:getCoMarketInfoStock,
    getDrawResult:getDrawResult,
    exchangePrize:exchangePrize,
    checkNamelist:checkNamelist,
    backThirdParty:backThirdParty
}
