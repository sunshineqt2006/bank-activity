<template>
  <div class="prize-page" v-if="prize.isShow">
    <div class="box" v-if="prize.result.isAward==0">
      <i class="box-top"></i>
      <i class="close" @click="close">×</i>
      <div class="box-body">
        <img src="http://p0bd8izdn.bkt.clouddn.com/ccb/wap/images/no_isAward.jpg" class="prize-img">
        <p>很遗憾，没有中奖</p>
        <!-- <div class="btn" @click="drawPrize({prizeId:drawPrizeId,remainDrawNum:prize.result.remainDrawNum})" v-if="prize.result.remainDrawNum">再试一次</div> -->
        <div class="btn" @click="close" v-if="prize.result.remainDrawNum">再试一次</div>

      </div>
      <i class="box-bottom"></i>
    </div>
    <div class="box" v-else-if="prize.result.isAward==1">
      <i class="box-top"></i>
      <i class="close" @click="close">×</i>
      <div class="box-body">
        <img :src="prize.result.prizePic" class="prize-img">
        <p v-if="prize.result.isOldPrize=='1'">您有一份奖品待领</p>
        <p v-else-if="!prize.result.isOldPrize">恭喜您,获得 {{prize.result.prizeName}}</p>
        <p class="f12" v-if="prize.result.prizeDescribe">{{prize.result.prizeDescribe}}</p>
        <p class="f15" v-if="prize.result.payMoney!=0" >支付 <em class="red">{{prize.result.payMoney}}</em> 元可领取</p>
        <div class="h10"></div>
        <div  class="f12" v-if="prize.result.payMoney!=0" >（请在<em class=" red"> {{prize.unpaidTime.text}} </em> 内完成支付）</div>
        <p class="f12 red" v-if="prize.result.payMoney!=0">(超时未支付，您将失去本次优惠抢购资格)</p>
        <div>
          <div class="btn" v-if="prize.result.payMoney!=0" @click="goPay(prize.result.awardOrderNo)">去支付</div>
          <div class="btn" v-if="prize.result.awardType!=='3'" @click="$util.goToWap" v-else>立即使用</div>
        </div>
      </div>
      <i class="box-bottom"></i>
    </div>
  </div>
</template>
<script>
import { mapState,mapActions } from "vuex";
export default {
  computed: {
    ...mapState("common", ["userInfo", "activityId", "token"]),
    ...mapState("business", ["activityId",'prize','drawPrizeId']),
  },
  methods: {
    ...mapActions("business",['goPay','drawPrize','closeDialog']),
    close(){
      this.closeDialog().then(()=>{
        this.$emit('close',true)
      })
    }
  }
};
</script>
<style lang="less" scoped>
.prize-page {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    width: 250px;
    text-align: center;
    padding: 20px;
    position: relative;
    .box-top,
    .box-bottom {
      width: 250px;
      height: 28px;
      margin-top: -1px;
      display: inline-block;
    }
    .box-body {
      padding: 10px;
      margin-top: -7px;
      .prize-img {
        width: 100px;
      }
      p {
        padding: 5px 0;
        font-size: 18px;
      }
      .btn {
        border-radius: 30px;
        padding: 8px 10px;
        margin:10px 20px 0;
      }
    }
    i.close {
      position: absolute;
      right: 40px;
      top: 30px;
      font-size: 30px;
    }
  }
}
</style>
