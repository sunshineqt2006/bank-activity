<template>
  <page noBack>
    <unpaid slot="unpaid"></unpaid>
    <div class="body">

      <div style="height:175px;" v-if="activity.banerList.length">
        <swiper :list="activity.banerList" auto height="175px" dots-class="custom-bottom" dots-position="center"></swiper>
      </div>

      <div class="activity-film">

        <count-down-time :nextTime="activity.nextTime"></count-down-time>

        <div class="box" v-for="(item,index) in activity.prizeList" :key="index">
          <div class="film-top" :class="prizeStyle[1]">
            <p>{{item.prizeName}} <br>{{item.prizeContent}} </p>
          </div>
          <div class="film-bottom">
            <em class=" text-ellipsis-line">{{item.prizeDescribe}}</em>

            <span class="btn" v-if="activity.drawType==='2'" :class="btnStatus.disabled&&(!!activity.remainDrawNum ||!userInfo.userId)?'':'disabled'" @click="isLukyClick(item.prizeId,activity.remainDrawNum)">
              <i v-if="!btnStatus.disabled">{{btnStatus.text}}</i>
              <i v-else>{{activity.remainDrawNum||!userInfo.userId?'立即抢票':'机会用完了'}}</i>
            </span>

            <span class="btn" v-if="activity.drawType==='1'" :class="btnStatus.disabled&&(!!item.remainDrawNum ||!userInfo.userId)?'':'disabled'" @click="isLukyClick(item.prizeId,item.remainDrawNum)">
              <i v-if="!btnStatus.disabled">{{btnStatus.text}}</i>
              <i v-else>{{item.remainDrawNum||!userInfo.userId?'立即抢票':'机会用完了'}}</i>
            </span>

          </div>
        </div>
        <div class="surplus-prize">本次剩余票量<span class="red">{{activity.surplusPrize}}</span>张</div>
        <div class="change">
          <div v-if="userInfo.userId">
            <em>{{activity.cycle}}你还有
              <em class="red">{{activity.remainDrawNum==-1?'无限':activity.remainDrawNum}}</em> 次优惠抢购机会</em> |
            <em class="blue block" @click="lookCoupons"> 查看优惠券</em>
          </div>
          <div v-else @click='isLogin' class="blue">
            <em class="block">您还未登陆，点击登陆</em>
          </div>
        </div>

        <i class="more-film-img" @click="$util.goToWap"></i>

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
    components: { Swiper, prizePage, countDownTime, unpaid },
    mixins: [layerMixin],
    data() {
        return {
            prizeStyle: ["first", "second", "third", "fourth"]
        };
    },
    computed: {
        ...mapState("common", ["userInfo", "token"]),
        ...mapState("business", [
            "activity",
            "activityId",
            "unpaidTime",
            "btnStatus",
            "activityTime",
            "prize"
        ])
    },
    methods: {
        ...mapActions("coupon", ["lookCoupons"]),
        ...mapActions("common", ["isLogin"]),
        ...mapActions("business", ["getActivityInfoS", "goPay", "drawPrize"]),
        goSquares() {
            if (!this.userInfo.userId) {
                this.$router.push({
                    path: "/" + window._vue.$route.meta.parent + "/Login"
                });
            } else {
                this.$router.push({
                    path: "/ABC-Squares/Squares",
                    query: { activityId: "65" }
                });
            }
        },
        isLukyClick(prizeId, remainDrawNum) {
            this.drawPrize({ prizeId: prizeId, remainDrawNum: remainDrawNum });
        }
    },
    created() {
        if (this.$route.query.activityId)
            this.$store.commit(
                "business/setActivityId",
                this.$route.query.activityId
            );
        this.$nextTick(() => {
            this.getActivityInfoS();
        });
    }
};
</script>
<style lang="less" scoped>
@import "~styles/var.less";
@import "../style.less";

.body {
    .activity-film {
        padding: 10px 10px 10px 10px;
        z-index: 0;
        position: relative;
        margin-bottom: 15px;
        .change {
            background: #ffffff;
            text-align: center;
            font-size: 12px;
            em.block{padding: 10px 0;display: inline-block}
        }
        .more-film-img {
          background: url("~assets/images/abc/default/more_film_img.png");background-size: 100%;
            height: 43px;
            display: inline-block;
            width: 345px;
            margin: 20px auto 0 auto;
        }
        .box { width: 350px; margin: 10px auto;
        .film-bottom {display: flex; justify-content: space-between; align-items: center; width: 350px;height: 51px;background: url("~assets/images/ccb/default/film_box_bottom_bg.png");
          background-repeat: no-repeat;background-size: 100%;
          em {margin-left: 20px;}
          .btn {margin-right: 20px; padding: 4px 8px;border-radius: 15px;
            &.disabled {background: #a7a7a7;}
          }
        }
        .film-top {
          width: 350px;
          height: 87px;
          background-repeat: no-repeat;
          p {
            color: #ffffff;
            text-align: right;
            padding: 20px;
            font-size: 18px;
          }
          &.first {
            background: url("~assets/images/ccb/default/film_box_top_bg.png");
            background-size: 100%;
          }
          &.second {
            background: url("~assets/images/ccb/default/film_box_top_bg2.png");
            background-size: 100%;
          }
          &.third {
            background: url("~assets/images/ccb/default/film_box_top_bg3.png");
            background-size: 100%;
          }
          &.fourth {
            background: url("~assets/images/ccb/default/film_box_top_bg4.png");
            background-size: 100%;
          }
        }
      }
        .more-coupon {
            .more-coupon-img1 {
                width: 170px;
            }
        }
        .count-down-time {
            .title {
                text-align: center;
                position: relative;
                display: block;
                em {
                    background: #f6f6f6;
                    padding: 0px 15px;
                    font-size: 15px;
                    z-index: 1;
                    position: relative;
                }
                &::after {
                    content: "";
                    left: 0;
                    position: absolute;
                    width: 100%;
                    top: 50%;
                    border-top: 1px solid #0a0205;
                }
            }
            .time-con {
                text-align: center;
                margin: 20px 0;
            }
            p {
                display: inline-block;
                i {
                    font-size: 16px;
                    display: inline-block;
                    background: #000;
                    color: #ffffff;
                    padding: 10px 6px;
                    border-radius: 4px;
                    margin: 0px 2px;
                }
            }
        }
    }
    .more-film-img {
        width: 355px;
        margin: 13px auto 20px auto;
        img {
            width: 170px;
        }
        .poker-img {
            width: 170px;
            height: 170px;
            background: url("http://p0bd8izdn.bkt.clouddn.com/ccb/wap/images/more_film_img2.gif")
                no-repeat;
            background-size: 100% 100%;
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
                background: #02c3ab;
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
            color: #02c3ab;
            text-align: center;
            padding: 10px 0;
            display: block;
        }
        .rule {
            padding: 10px 0;
            line-height: 22px;
            .activity-rule {
                width: 100%;
                height: 400px;
                border: 0;
            }
        }
        .activity-time {
            padding: 10px 0;
            font-size: 14px;
        }
    }
}
.exchange-class {
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 80px;
    z-index: 89;
}
.surplus-prize{
  text-align: center;
  padding: 4px 0px 16px 0px;
}
</style>


