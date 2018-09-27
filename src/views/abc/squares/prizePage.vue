<template>
  <div class="prize-page" v-if="prize.isShow">
      <div class="box" v-if="prize.result.isAward==0">
        <i class="close" @click="closeDialog"></i>
        <p class="title">很遗憾~ </p>
        <p class="con"> <img src="~assets/images/abc/squares/no_prize_img.png" class="no-prize"> </p>
        <div class="btn-group">
          <div class="btn" @click="drawPrize({prizeId:drawPrizeId,remainDrawNum:prize.result.remainDrawNum})" v-if="prize.result.remainDrawNum" >继续抽奖</div>
        </div>
      </div>
      <div class="box" v-if="prize.result.isAward==1">
        <i class="close" @click="closeDialog"></i>
        <p class="title">{{prize.result.continuityDay===0?'恭喜您,获得':'您已连续'+prize.result.continuityDay+'天参与活动'}} </p>
        <p class="con"> ￥{{prize.result.prizeValue}} <br>{{prize.result.prizeName}}</p>
        
        <p class="info">红包可累计，购票时直接抵扣</p>
        <div class="btn-group">
          <div class="btn" @click="$util.goToWap">去购票</div>
        </div>
      </div>
        
    </div>
</template>
<script>
import { mapState,mapActions } from "vuex";
export default {
  data(){
    return{}
  },
  computed: {
    ...mapState("business", ['prize','drawPrizeId']),
  },
  methods:{
     ...mapActions("business",['closeDialog',"drawPrize"])
  }
}
</script>
<style lang="less" scoped>
.prize-page{position: absolute;width: 100%;height: 100%;top:0;left:0;z-index: 0;background: rgba(0,0,0,.5);display: flex;justify-content: center;align-items: center;display: flex;flex-direction: column;
  .box{background:url('~assets/images/abc/squares/prize_bg.png') no-repeat;background-size: 100%;height: 333px; width: 311px;text-align: center;padding: 20px;position: relative;;
    i.close{width: 30px;height: 30px;background:url('~assets/images/abc/close_icon.png');background-size: 100%;display: inline-block;margin: 0 auto;}
    p{padding: 10px 0;font-size: 18px;
      &.title{margin-top: 35px;color: #7a2716;font-size: 15px;}
      &.con{margin-top: 20px;color: #db483c;font-size: 20px;font-weight: bolder;
        .no-prize{width: 100px;}
      }
      &.info{margin-top: 90px;color: #fdffda;}
    }
    .btn-group{ width: 260px;position: absolute;bottom: -60px;left: 46px;
      .btn{background: #fee94e;color: #db483c;min-width: 80%;text-align: center;margin-top: 30px;}
    }
  }
  
}
</style>
