<template>
  <page noBack pagDetail @pagDetailClick="pagDetail">
    <div class="content">
      <div class="top">
        <p>累积红包金额</p>
        <p class="money">{{activity.cashTip?'￥'+activity.cashTip.cashBonusSum:0}}</p>
        <p>请在 {{activity.cashTip&&activity.cashTip.endTime}} 之前使用，逾期失效</p>
        <p class="red" @click="$util.goToWap">立即使用</p>
      </div>
      <div class="middle">
        <div class="describe">{{activity.cashTip&&activity.cashTip.continuityTip}}</div>

        <div class="con squares">
          <span class="bag thanks a-0"></span>
          <span class="bag a-1"> <em class="money">{{bagList[0].prizeName}}</em> </span>
          <span class="bag  a-2"> <em class="money">{{bagList[1].prizeName}}</em></span>

          <span class="bag  a-7"> <em class="money">{{bagList[6].prizeName}}</em> </span>
          <span class="start" @click="luckFn"></span>
          <span class="bag  a-3"><em class="money">{{bagList[2].prizeName}}</em></span>

          <span class="bag  a-6"> <em class="money">{{bagList[5].prizeName}}</em></span>
          <span class="bag  a-5"> <em class="money">{{bagList[4].prizeName}}</em></span>
          <span class="bag  a-4"> <em class="money">{{bagList[3].prizeName}}</em></span>
        </div>
        <div class="dp">
          <em v-if="userInfo.userId">您今天还有 <i class="yellow">{{activity.remainDrawNum}}次</i> 抽奖机会</em>
          <em v-else @click="isLogin">您还未登陆，点击登陆</em>
        </div>
      </div>
      <div class="rule">
        <i class="title"></i>
        <pre class="con">{{activity.activeRule}}</pre>
      </div>
    </div>
    <prize-page slot="other" ref="prizePage"></prize-page>
  </page>

</template>
<script>
import { mapState, mapActions } from "vuex";
import { setTimeout } from "timers";
import prizePage from "./prizePage.vue";
import layerMixin from "@/utils/layerMixin.js";
var click = false;
export default {
  mixins: [layerMixin],
    components: { prizePage },
    data() {
        return {
            bagList: [
                { prizeId: "" },
                { prizeValue: "" },
                { prizeValue: "" },
                { prizeValue: "" },
                { prizeValue: "" },
                { prizeValue: "" },
                { prizeValue: "" },
                { prizeValue: "" },
                { prizeValue: "" }
            ],
            luck: {
                index: 0, //当前转动到哪个位置，起点位置
                count: 0, //总共有多少个位置
                timer: 0, //setTimeout的ID，用clearTimeout清除
                speed: 20, //初始转动速度
                times: 0, //转动次数
                cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
                prize: -1 //中奖位置
            },
            luckPrize: 0,
            isError: false
        };
    },
    computed: {
        ...mapState("common", ["userInfo"]),
        ...mapState("business", ["activity", "activityId", "prize"])
    },
    methods: {
        ...mapActions("common", ["isLogin"]),
        ...mapActions("business", ["getActivityInfoS","getCoMarketInfoStock","drawPrize", "getDrawResult"]),
        pagDetail() {
            if(!this.userInfo.userId){
                this.$router.push({ path: "/" + window._vue.$route.meta.parent + "/Login" });
                return;
            }
            this.$router.push({path: "/ABC-Squares/BagDetail",query: {activityId: this.activityId,activityEnd: this.activity.activityDateEnd }});
        },
        refesh() {
            this.getActivityInfoS().then(() => {
                if (this.activity.prizeList.length < 7) {
                    var arr = JSON.parse(JSON.stringify(this.bagList)).slice( 0,7);
                    var sum = 0;
                    arr && arr.forEach((a, index) => {
                            this.activity.prizeList.forEach((b, bIndex) => {
                                this.bagList[sum] = b;
                                sum++;
                            });
                        });
                } else {
                    this.bagList = this.activity.prizeList.slice(0, 7);
                }
                this.bagList = this.bagList.slice(0, 7);
                this.$nextTick(() => {
                    this.init();
                });
            });
        },
        luckFn() {
            if (click) return false;
            
            this.drawPrize({ prizeId: this.bagList[0].prizeId,remainDrawNum: this.activity.remainDrawNum,isResult: true,beforeDraw: () => {
                    click = true;
                    this.isError = false;
                    this.luckPrize = -1;
                }
            }).then(res => {
                    this.roll();
                    this.getDrawResult({prizeId: this.bagList[0].prizeId,drawcode: res.data,isResult: true }).then(
                        res => {
                            if (res.isAward === 0) {
                                this.luckPrize = 0;
                            } else {
                                this.bagList &&this.bagList.forEach((a, index) => {
                                        if (a.prizeId == res.awardId) {
                                            this.luckPrize = index + 1;
                                        }
                                    });
                            }
                            this.$store.commit("business/setPrize", { result: res,isShow: false,unpaidTime: { timeStamp: 1 }});
                        }, () => {this.luckPrize = 0; this.isError = true;});
                    },() => {this.luckPrize = 0; this.isError = true;
             });
        },
        init() {
            this.luck.count = $(".bag").length;
            $(".squares")
                .find(".a-" + this.luck.index)
                .addClass("active");
        },
        init_roll() {
            var index = this.luck.index;
            var count = this.luck.count;
            $(".squares")
                .find(".a-" + index)
                .removeClass("active");
            index += 1;
            if (index > count - 1) {
                index = 0;
            }
            $(".squares")
                .find(".a-" + index)
                .addClass("active");
            this.luck.index = index;
            return false;
        },
        roll() {
            if (this.isError) {
                clearTimeout(this.luck.timer);
                this.luckPrize = 0;
            }
            // console.log("isError0", this.isError, this.luck);
            this.luck.times += 1;
            this.init_roll();
            if ( this.luck.times > this.luck.cycle + 10 && this.luck.prize == this.luck.index) {
                clearTimeout(this.luck.timer);
                this.luck.prize = -1;
                this.luck.times = 0;
                click = false;
                console.log("isError2", this.isError, this.luck);
                if (!this.isError) this.$store.commit("business/setPrize", {result: this.prize.result,isShow: true,unpaidTime: { timeStamp: 1 }});
            } else {
                if (this.luck.times < this.luck.cycle) {
                    this.luck.speed -= 10;
                } else if (this.luck.times == this.luck.cycle) {
                    this.luck.prize = this.luckPrize;
                    console.log("luck1", this.luck);
                } else {
                    if (this.luck.times > this.luck.cycle + 10 &&((this.luck.prize == 0 && this.luck.index == 7) || this.luck.prize == this.luck.index + 1)
                    ) {
                        this.luck.speed += 110;
                    } else {
                        this.luck.speed += 20;
                    }
                }
                if (this.luck.speed < 40) {
                    this.luck.speed = 40;
                }
                // console.log(luck.times+'^^^^^^'+luck.speed+'^^^^^^^'+luck.prize);
                this.luck.timer = setTimeout(this.roll, this.luck.speed);
            }

            return false;
        }
    },
    created() {
        if (this.$route.query.activityId) this.$store.commit("business/setActivityId", this.$route.query.activityId);
        this.$nextTick(() => { this.refesh();});
    }
};
</script>

<style lang="less" scoped>
@import "~styles/var.less";
.page {
    background: #e3f2f7;
    .content {
        flex: 1;
        overflow: auto;
        .top {
            margin: 15px 0 0;
            line-height: 28px;
            padding: 20px 0 0;
            height: 165px;
            background: url("~assets/images/abc/squares/squares_top_bg.jpg") no-repeat;
            background-size: 100%;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            .money {
                padding: 10px 0;
                font-size: 30px;
            }
        }
        .middle {
            margin: 0px 15px;
            .describe {
                font-size: 12px;
                margin: 0 15px;
                background: #ffefd7;
                border: 10px solid #afe8fc;
                border-bottom: 0;
                border-radius: 8px;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                padding: 10px;
            }
            .con {
                padding: 22px 0 20px 20px;
                position: relative;
                top: -4px;
                display: flex;
                flex-wrap: wrap;
                width: 328px;
                height: 308px;
                background: url("~assets/images/abc/squares/squares_middle_bg.jpg")
                    no-repeat;
                background-size: 100%;
                span {
                    border-radius: 8px;
                    width: 98px;
                    height: 100px;
                    margin-right: 5px;
                    &.bag {
                        background: url("~assets/images/abc/squares/bag.png") #ffffff;
                        background-position: center 20px;
                        background-repeat: no-repeat;
                        background-size: 60px 42px;
                    }
                    &.bag.active {
                        background: url("~assets/images/abc/squares/bag.png") #fefdd1;
                        background-position: center 20px;
                        background-repeat: no-repeat;
                        background-size: 60px 42px;
                        border: 2px solid #f0ba00;
                        box-sizing: border-box;
                    }

                    &.thanks {
                        background: url("~assets/images/abc/squares/thanks.png") #ffffff;
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: 64px 56px;
                    }
                    &.thanks.active {
                        background: url("~assets/images/abc/squares/thanks.png") #fefdd1;
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: 64px 56px;
                        border: 2px solid #f0ba00;
                        box-sizing: border-box;
                    }

                    &.start {
                        background: url("~assets/images/abc/squares/start.png")
                            no-repeat;
                        background-size: 100%;
                    }

                    .money {
                        display: block;
                        text-align: center;
                        margin-top: 65px;
                        color: @warn-color;
                    }
                }
            }
            .dp {
                width: 228px;
                height: 60px;
                text-align: center;
                margin: 0 auto;
                background: url("~assets/images/abc/squares/squres_dp.png") no-repeat;
                background-size: 100%;
                position: relative;
                top: -20px;
                em {
                    position: relative;
                    top: 22px;
                    color: #ffffff;
                    display: inline-block;
                    padding: 10px;
                }
            }
        }
        .rule {
            border: 2px dashed #05b5f1;
            margin: 20px 15px 20px;
            padding: 10px;
            border-radius: 6px;
            position: relative;
            i.title {
                width: 38px;
                height: 43px;
                background: url("~assets/images/abc/squares/squres_rule_title.png")
                    no-repeat;
                background-size: 100%;
                display: inline-block;
                position: absolute;
                top: -20px;
                left: -1px;
            }
            .con {
                margin-top: 20px;
                font-size: 13px;
            }
        }
    }
}
</style>

