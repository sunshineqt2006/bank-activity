<template>
  <div class="prize-page" v-if="prize.isShow">
    <div class="box" v-if="prize.result.isAward==0">
      <i class="close" @click="closeDialog"> </i>
      <div class="box-body">
        <img src="~assets/images/no_prize_img.png" class="prize-img">
        <p class="prize-text">啊哦，您未中奖</p>
        <!-- <div class="btn" @click="drawPrize({prizeId:drawPrizeId,remainDrawNum:prize.result.remainDrawNum})" v-if="prize.result.remainDrawNum">还有{{prize.result.remainDrawNum}}次机会,再试一次</div> -->
        <div class="btn" @click="closeDialog" v-if="prize.result.remainDrawNum">还有{{prize.result.remainDrawNum}}次机会,再试一次</div>
      </div>
    </div>
    <div class="box" v-else-if="prize.result.isAward==1">
      <i class="close" @click="closeDialog"></i>
      <div class="box-body">
        <img :src="prize.result.prizePic" class="prize-img">
        <p v-if="prize.result.isOldPrize=='1'" class="prize-text">您有一笔订单未支付</p>
        <p v-else-if="!prize.result.isOldPrize" class="prize-text">恭喜您,获得 {{prize.result.prizeName}}</p>
        <p class="f15" v-if="prize.result.payMoney!=0">请在
          <em class=" red"> {{prize.unpaidTime.text}} </em> 内完成支付</p>
        <p class="f12 red" v-if="prize.result.payMoney!=0">(超时未支付，您将失去本次优惠抢购资格)</p>
        <div>
          <div class="btn" v-if="prize.result.payMoney!=0" @click="goPay(prize.result.awardOrderNo)">去支付</div>
          <div class="btn" @click="$util.goToWap" v-else>立即使用</div>
        </div>
      </div>
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
    ...mapActions("business",['goPay','drawPrize','closeDialog'])
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
    background: url('~assets/images/abc/dialog_bg.png') no-repeat #ffffff;background-size: 100%;
    border-radius: 15px;
    width: 250px;
    text-align: center;
    padding:10px 20px;
    position: relative;
    .box-body {
      background-size: 100%;
      padding: 10px;
      margin-top: -5px;
      .prize-text{position: absolute;top: 20px;width: 100%;    left: 0;color: #ffffff;font-size: 20px;}
      .prize-img {
        margin-top: 100px;
        width: 70px;
      }
      p {
        padding: 10px 0;
        font-size: 18px;
      }
      .btn {
        border-radius: 30px;
        min-width: 120px;display: inline-block;
        margin: 10px auto;
        padding: 8px 10px;
      }
    }
    i.close {
      position: absolute;    width: 30px;
    height: 30px;
    display: inline-block;
    background: url('~assets/images/abc/close_icon.png');background-size: 100%;
      right:10px;z-index: 10;
    }
  }
}
</style>
