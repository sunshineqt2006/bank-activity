<template>
  <div class="prize-page" v-if="prize.isShow">
      <div class="box" v-if="prize.result.isAward==0">
        <i class="close" @click="closeDialog">×</i>
        <img :src="prize.result.prizePic" class="prize-img">
        <p>很遗憾，没有抢到！</p>

        <div class="frbm" style="    margin: 10px 10px 0;">
          <!-- <div class="btn" @click="drawPrize({prizeId:drawPrizeId,remainDrawNum:prize.result.remainDrawNum})" v-if="prize.result.remainDrawNum">再试一次</div> -->
          <div class="btn" @click="closeDialog" v-if="prize.result.remainDrawNum">再试一次</div>

          <div class="btn yellow" @click="moreCoupoons" v-if="!(object=='cib'||object=='abc'||object=='unionpay_abc')" >更多优惠</div>
        </div>
      </div>
      <div class="box" v-if="prize.result.isAward==1">
        <i class="close" @click="closeDialog">×</i>
        <img :src="prize.result.prizePic" class="prize-img">
        <p v-if="prize.result.isOldPrize=='1'">您有一笔订单未支付</p>
        <p v-else-if="!prize.result.isOldPrize">恭喜您,获得 {{prize.result.prizeName}}</p>
        <p class="f15" v-if="prize.result.payMoney!=0">请在
          <em class=" red"> {{prize.unpaidTime.text}} </em> 内完成支付</p>
          <p class="f12 red" v-if="prize.result.payMoney!=0&&!(object=='abc'||object=='unionpay_abc')">(超时未支付，您将失去本次优惠抢购资格)</p>
          <div v-if="prize.result.payMoney!=0&&(object=='abc'||object=='unionpay_abc')" class="left">
            <p class="f12 red ">(支付提示：本活动仅限福建省农业银行银联云闪付信用卡用户（厦门除外）参与，继续支付前，请勾选“我已了解”。)</p>
            <span class="know"> <check-icon :value.sync="isKnow" >我已了解</check-icon></span>
          </div>
        <div>
          <div class="btn" :class="isKnow&&(object=='abc'||object=='unionpay_abc')?'':'disable'" v-if="prize.result.payMoney!=0" @click="goPayFn">去支付</div>
          <div class="btn" @click="$util.goToWap" v-else>立即使用</div>
        </div>
      </div>

    </div>
</template>
<script>
import Api from "api/authApi";
import { mapState,mapActions } from "vuex";
import { CheckIcon } from 'vux'

export default {
  components:{CheckIcon},
  data(){
    return{
      isKnow:false
    }
  },
  computed: {
    ...mapState("common", ["userInfo", "token",'object']),
    ...mapState("business", ["activityId",'prize','drawPrizeId']),
  },
  methods:{
    ...mapActions("business",['goPay','drawPrize','closeDialog']),
    goPayFn(){
      if(!this.isKnow&&this.object=='unionpay_abc'){
         this.$vux.toast.text('继续支付前，请阅读支付提示哦！');
        return;
      }
      this.goPay(this.prize.result.awardOrderNo)
    },
    moreCoupoons(){
      if(this.object==='ccb'){
        this.$router.push({path:'/CCB-Poker',query:{activityId:'21',from:'ccb'}})
      }else if(this.object==='abc'){
        this.$router.push({path:'/Squares/Squares',query:{activityId:'25',from:'abc'}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.prize-page{position: absolute;width: 100%;height: 100%;top:0;left:0;z-index: 0;background: rgba(0,0,0,.5);display: flex;justify-content: center;align-items: center;
  .box{background: #ffffff;border-radius: 15px;width: 250px;text-align: center;padding: 20px;position: relative;
    i.close{position: absolute;right:10px;top: 5px;font-size: 30px;}
    .prize-img{width: 100px;}
    p{padding: 10px 0;font-size: 18px;}
      .btn {
        border-radius: 30px;
        min-width:75px;display: inline-block;
        padding: 8px 10px;
        flex: 1;
        &:nth-child(2n){
          margin-left: 10px;
        }
        &.disable{background: #aaaaaa;}
      }
      .know{margin:0 0 20px 0;display: block;}
  }

}
</style>
