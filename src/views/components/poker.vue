<template>
    <div class="prize-list">
        <div class="prize-body" id="draw">
            <div class="poker-list" v-for="(item,index) in [1,2,3,4,5,6]" :key="index">
                <i @click="isLukyClick" v-if="pokerImg.length>1"  :style="`background-image:url(${pokerImg[index]})`" class="poker-img"></i>
                <i class="poker-img" @click="isLukyClick" v-else></i>
                <em class="poker-z-img">
                    <div>
                        <em v-if="prize.result.isOldPrize===1">您有份奖品待领</em>
                        <em v-else-if="prize.result.isAward===1&&!prize.result.isOldPrize">恭喜您，获得</em>
                        <em v-else-if="prize.result.isAward===0&&!prize.result.isOldPrize">啊哦，未中奖</em>
                    </div>
                    <img :src="prize.result.prizePic">
                    <p>{{prize.result.prizeName}}</p>
                </em>
            </div>
        </div>
        <div class="change">
            <div v-if="userInfo.userId">
                <em>本日您还有
                    <em class="yellow f15">{{activity.remainDrawNum==-1?'无限':activity.remainDrawNum}}次</em> 翻牌机会</em> |
                <em class="yellow block" @click="lookCoupons"> 查看优惠券</em>
            </div>
            <div v-else @click='isLogin' class="blue block">您还未登陆，点击登陆</div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    props:{
        pokerImg:Array
    },
    computed: {
        ...mapState("common", ["userInfo"]),
        ...mapState("business", [ "activity","prize","drawPrizeId"])
    },
    methods:{
        ...mapActions("common", ["isLogin"]),
        ...mapActions("coupon", ["lookCoupons"]),
        ...mapActions("business", ["drawPrize","getDrawResult"]),
        turn(target, time, opts, type) {
            
            //翻牌动作   type=2所有牌面重置。、1为翻牌
            var _this = this;
            if (type === 2) {
                $("i.poker-img").stop().animate(opts[1], time, function() {
                    $(this).next().animate(opts[0], time);
                });
            } else {
                target.find("div").click(function() {
                if (!_this.activity.remainDrawNum){
                    _this.$vux.toast.text("您的机会用完了哦！");
                    return;
                }
                var current = $(this);
                $(this).find("i.poker-img").stop().animate(opts[0], time, function() {
                    $(this).hide().next().show();
                    $(this).next().animate(opts[1], time);
                    });
                });
            }
        },
        trunReset(){  //洗牌
            var verticalOpts = [{ width: 0 }, { width: "110px" }];
            this.turn($("#draw"), 900, verticalOpts, 2);
        },
        isLukyClick(prizePic) { 
            this.drawPrize({prizeId:this.activity.prizeList[0].prizeId,remainDrawNum:this.activity.remainDrawNum,beforeDraw:res=>{
                var verticalOpts = [{ width: 0 }, { width: "111px" }];  //翻牌动作
                this.turn($("#draw"), 1000, verticalOpts, 1);
            },errResult:res=>{
                this.trunReset()
            }})
        }
    }
}
</script>
<style lang="less" scoped>
.prize-list {
      .prize-body {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        div.poker-list {
          height: 150px;
          width: 111px;
          overflow: hidden;
          text-align: center;
          margin-bottom: 10px;
        }
        i.poker-img {
          width: 111px;
          height: 150px;
          display: inline-block;
          margin-bottom: 10px;
          overflow: hidden;
        }
        em.poker-z-img {
          width: 0;
          height: 150px;
          background: red;
          display: none;
          overflow: hidden;
          text-align: center;
          > div {
            margin-top: 15px;
          }
          img {
            width: 80%;
            margin: 5px auto;
          }
        }
        img.poker-z-img {
          width: 0;
          height: 150px;
          display: none;
        }
      }
      .change {
        border-radius: 20px;
        text-align: center;
        font-size: 12px;
        em.block{padding: 10px 0;display: inline-block;margin-left: 10px;}
        div.block{padding: 10px 0;display: inline-block;margin-left: 10px;}
      }
    }
</style>
