<template>
  <page noBack class="CCB-turntable">
    <unpaid slot="unpaid"></unpaid>
    <div class="body">
      <turntable :intervalColors="['#fffdb6','#fff371']" :prizeList="prizeList"></turntable>

      <div class="group-btn frbm">
        <span class="coupon" @click="lookCoupons">我的优惠券</span>
        <span class="goBuy" @click="$util.goToWap">去购票</span>
      </div>

      <div class="rule" width="300">
        <h1 class="title">活动规则</h1>
        <pre class="rule-b">{{activity.activeRule}}</pre>
      </div>

    </div>
    <prize-page ref="prizePage" slot="other"></prize-page>
  </page>
</template>
<script>
import prizePage from "./prizePage.vue";
import turntable from "views/components/turntable";
import unpaid from "views/components/unpaid";
import { mapState, mapActions } from "vuex";
import layerMixin from "@/utils/layerMixin.js";
import smilePic from "assets/images/abc/smail.png";

export default {
    components: { turntable, prizePage, unpaid },
    mixins: [layerMixin],
    data() {
        return {
            prizeList: []
        };
    },
    computed: {
        ...mapState("business", ["activity"])
    },
    methods: {
        ...mapActions("business", ["getActivityInfoS", "goPay"]),
        ...mapActions("coupon", ["lookCoupons"])
    },
    created() {
        if (this.$route.query.activityId)this.$store.commit( "business/setActivityId",this.$route.query.activityId);
        this.$nextTick(() => {
            this.getActivityInfoS().then(res => {
                this.prizeList = this.activity.prizeList;
                this.prizeList.push({
                    prizeName: "谢谢惠顾",
                    prizePic: smilePic
                });
            });
        });
    }
};
</script>

<style lang="less" scoped>
  .body {flex:1;overflow: auto;
    .group-btn{margin: 10px 20px;
      span{width:151px;height: 36px;text-align: center;line-height: 36px;color: #ffffff; }
    }
    .rule{padding:20px 20px;margin: 20px 0px 0;line-height: 22px;
      .title{border-top-right-radius: 15px;border-bottom-right-radius: 15px;background: #ffffff;position: relative;left: -20px;display: inline-block;padding: 5px 20px 5px 10px;margin-bottom: 20px; }
    }
  }
</style>


