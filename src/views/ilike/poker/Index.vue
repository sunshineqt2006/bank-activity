<template>
  <page :noHeader="false" class="mid-autumn">
    <unpaid slot="unpaid"></unpaid>
    <div class="body">

      <poker ref="poker" :pokerImg="pokerImgList"></poker>

      <div class="rule" width="300">
        <h1 class="title"></h1>
        <pre class="rule-b">{{activity.activeRule}}</pre>
      </div>
      <img src="~assets/images/ilike/MidAutumn/page_bottom_bg.png" class="page-bottom-img">
    </div>
    <prize-page ref="prizePage" slot="other" @close="closeFn"></prize-page>
  </page>

</template>
<script>
import prizePage from "./prizePage.vue";
import unpaid from "views/components/unpaid";
import poker from "views/components/poker";
import { mapState, mapActions } from "vuex";
import layerMixin from "@/utils/layerMixin.js";
import Api from "api/authApi";

import poker0 from "assets/images/ilike/MidAutumn/poker0.png";
import poker1 from "assets/images/ilike/MidAutumn/poker1.png";
import poker2 from "assets/images/ilike/MidAutumn/poker2.png";
import poker3 from "assets/images/ilike/MidAutumn/poker3.png";
import poker4 from "assets/images/ilike/MidAutumn/poker4.png";
import poker5 from "assets/images/ilike/MidAutumn/poker5.png";


export default {
    components: { unpaid, prizePage, poker },
    mixins: [layerMixin],
    data(){
        return{
            pokerImgList:[poker0,poker1,poker2,poker3,poker4,poker5]
        }
    },
    computed: {
        ...mapState("business", ["activity"])
    },
    methods: {
        ...mapActions("business", ["getActivityInfoS"]),
        closeFn() {
            this.$refs.poker.trunReset();
        }
    },
    created() {
        if (this.$route.query.activityId) this.$store.commit("business/setActivityId", this.$route.query.activityId);
        this.$nextTick(() => {
            
        if(this.$route.query.tokenId){
          this.$store.commit("common/setToken", this.$route.query.tokenId);
          Api.getUserInfo().then(res=>{
            this.$store.commit("common/setUserInfo", res.data);
            this.getActivityInfoS();
          })
        }else{
            this.getActivityInfoS();
        }
            
        });
    }
};
</script>

<style lang="less" scoped>
@import "~styles/var.less";
.body {
    flex: 1;
    overflow: auto;
    text-align: center;
    .more-film-img {
        height: 43px;
        display: inline-block;
        width: 345px;
        margin: 20px auto 0 auto;
    }
    .rule {
        padding: 20px 10px 40px;
        margin: 40px 10px 0 10px;
        line-height: 22px;
        text-align: left;
        .title {
            position: relative;
            top: -40px;
            margin: 0 auto;
            width:202px;height:36px;
        }
    }
    .page-bottom-img{width: 100%;margin-top: -22px;}
}
</style>


