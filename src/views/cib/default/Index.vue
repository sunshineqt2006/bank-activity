<template>
  <page noBack>
      <unpaid slot="unpaid"></unpaid>
    <div class="body">
        
      <div style="height:175px;" v-if="activity.banerList.length">
        <swiper :list="activity.banerList" auto height="175px" dots-class="custom-bottom" dots-position="center"></swiper>
      </div>
      <div class="user-info frbm">
          <span class="left"> <i class="advert-img"></i> {{userInfo.userId?'您好！'+userInfo.bindmobile:'您还未登陆'}}</span>
          <span class="btn" @click="isLogin">{{userInfo.userId?'注销':'登录'}}</span>
        </div>

      <div class="activity-film">

        <count-down-time  :nextTime="activity.nextTime"></count-down-time>

        <div class="box" v-for="(item,index) in activity.prizeList" :key="index">
          <div class="film-top" :class="prizeStyle[index%4]">
            <h3 class="film-Voucher">{{item.prizeName}}</h3>
            <p>{{item.prizeContent}}</p>
            <button class="film-rushtbuy" v-if="activity.drawType==='2'" :class="btnStatus.disabled&&(!!activity.remainDrawNum ||!userInfo.userId)?'':'disabled'" @click="isLukyClick(item.prizeId,activity.remainDrawNum)">
              <i v-if="!btnStatus.disabled">{{btnStatus.text}}</i>
              <i v-else>{{activity.remainDrawNum||!userInfo.userId?'立即购买':'机会用完了'}}</i>
            </button>
            <button class="film-rushtbuy" v-if="activity.drawType==='1'" :class="btnStatus.disabled&&(!!item.remainDrawNum ||!userInfo.userId)?'':'disabled'" @click="isLukyClick(item.prizeId,item.remainDrawNum)">
              <i v-if="!btnStatus.disabled">{{btnStatus.text}}</i>
              <i v-else>{{!userInfo.userId||item.remainDrawNum?'立即购买':'机会用完了'}}</i>
            </button>
          </div>
        </div>
        <div class="change">
          <div v-if="userInfo.userId">
            <em>{{activity.cycle}}你还有<em class="red">{{activity.remainDrawNum==-1?'无限':activity.remainDrawNum}}</em> 次优惠抢购机会</em> |
            <em class="blue block" @click="lookCoupons"> 查看优惠券</em>
          </div>
          <div v-else @click="isLogin" class="blue"><em class="block">您还未登陆，点击登录</em></div>
        </div>

      </div>

      <div class="hot-film" v-if="activity.hotFilm.length">
        <h1 class="title">当前热门影片</h1>
        <div class="film-cell" v-for="item in activity.hotFilm" :key="item.id">
          <img :src="item.cover" width="77px" class="hot-film-cover">
          <div class="hot-body">
            <h3>{{item.filmName}}</h3>
            <div class="describe">
              <p class="text-ellipsis-line">导演:{{item.director}}</p>
              <p class="text-ellipsis-line">主演:{{item.cast}}</p>
            </div>
          </div>
          <span class="btn" @click="$util.seeFilmDetail(item.id)">GO</span>
        </div>
        <span class="more blue" @click="$util.goToWap">查看更多热门影片</span>
      </div>
      <div class="hot-film" width="300">
        <h1 class="title">活动规则</h1>
        <pre class="rule">{{activity.activeRule}}</pre>
      </div>

    </div>
    <prize-page ref="prizePage" slot="other"></prize-page>
  </page>

</template>
<script>
import { Swiper } from "vux";
import prizePage from "views/components/prizePage.vue";
import countDownTime from "views/components/countDownTime.vue";
import unpaid from "views/components/unpaid";
import { mapState, mapActions } from "vuex";
import layerMixin from "@/utils/layerMixin.js";

export default {
    components: { Swiper, prizePage, countDownTime,unpaid },
    mixins: [layerMixin],
    data() {
        return {
            prizeStyle: ["first", "second", "third", "fourth"]
        };
    },
    computed: {
        ...mapState("common", ["userInfo", "token"]),
        ...mapState("business", [ "activity","activityId", "unpaidTime", "btnStatus", "activityTime","prize"])
    },
    methods: {
        ...mapActions("common", ["isLogin"]),
        ...mapActions("business", ["getActivityInfoS", "goPay", "drawPrize"]),
        ...mapActions("coupon", ["lookCoupons"]),
        isLukyClick(prizeId, remainDrawNum) {
            this.drawPrize({prizeId:prizeId,remainDrawNum:remainDrawNum});
        }
    },
    created() {
        if (this.$route.query.activityId)  this.$store.commit("business/setActivityId", this.$route.query.activityId);
        this.$nextTick(() => {
            this.getActivityInfoS();
        });
    }
};
</script>
<style lang="less" scoped>
@import "~styles/var.less";
.body {
    .activity-film {
        margin: 10px 10px 15px 10px;
        z-index: 0;
        position: relative;
        .change {
            background: #ffffff;
            text-align: center;
            font-size: 12px;
            em.block{padding: 10px 0;display: inline-block}
        }
        .box {
            width: 350px;
            margin: 10px auto;
            background: url("~assets/images/cib/default/film_box_top_bg7.png");
            background-size: 100%;
            .film-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 350px;
                height: 45px;
                background: url("~assets/images/cib/default/film_box_top_bg6.png");
                background-repeat: no-repeat;
                background-size: 100%;
                em {
                    margin-left: 20px;
                }
                .btn {
                    /*margin-right: 20px;*/
                    width: 100%;
                    padding: 4px 8px;
                    border-radius: 15px;
                    color: #fff45c;
                    background: none;
                    text-align: center;
                    &.disabled {
                        background: #a7a7a7;
                    }
                }
                a {
                    margin: 0 auto;
                    color: #fff45c;
                    font-size: 14px;
                }
            }
            .film-top {
                width: 350px;
                height: 215px;
                background-repeat: no-repeat;
                text-align: center;
                .film-Voucher {
                    color: #0090fa;
                    text-align: center;
                    padding: 30px 20px 0px 20px;
                    font-size: 38px;
                }
                p {
                    color: #3f3f3f;
                    text-align: center;
                    padding: 25px 20px 0px 20px;
                    font-size: 12px;
                }
                .film-rushtbuy {
                    width: 215px;
                    border-width: 0px;
                    background-color: #0090fa;
                    padding: 4px 8px;
                    border-radius: 15px;
                    margin-top: 22px;
                    font-size: 14px;
                    color: #ffffff;
                    &.disabled {
                        background: #a7a7a7;
                    }
                }
                background-size: 100%;
            }
        }
    }
    .hot-film {
        background: #ffffff;
        padding: 0px 20px;
        overflow: hidden;
        margin-bottom: 15px;
        .title {
            font-size: 16px;
            font-weight: bolder;
            padding: 10px 0;
            border-bottom: 1px solid #dddddd;
        }
        .film-cell {
            padding: 10px 0;
            display: flex;
            height: 115px;
            border-bottom: 1px solid #ccc;
            justify-content: space-between;
            .hot-body {
                margin: 0 0 0 10px;
                width: 180px;
                flex-direction: column;
                display: flex;
                .describe {
                    display: flex;
                    flex: 1;
                    justify-content: space-around;
                    flex-direction: column;
                }
            }
            .btn {
                padding: 5px 12px;
                border-radius: 15px;
                height: 18px;
                margin-top: 80px;
            }
        }
        .hot-film-cover {
            border-radius: 4px;
            height: 105px;
        }
        .more {
            text-align: center;
            padding: 10px 0;
            display: block;
        }
        .rule {
            padding: 10px 0;
            line-height: 22px;
        }
    }
}
</style>


