<template>
  <page noBack class="poker3">
    <unpaid slot="unpaid"></unpaid>
    <div class="body">

      <poker ref="poker" :pokerImg="['']"></poker>
      <i class="more-film-img" @click="$util.goToWap"></i>

      <div class="rule" width="300">
        <h1 class="title"></h1>
        <pre class="rule-b">{{activity.activeRule}}</pre>
      </div>
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

export default {
    components: { unpaid, prizePage, poker },
    mixins: [layerMixin],
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
            this.getActivityInfoS();
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
        padding: 20px 10px;
        margin: 20px 10px;
        line-height: 22px;
        text-align: left;
        .title {
            position: relative;
            left: -12px;
            top: -20px;
            margin-bottom: 0px;
            width: 104px;
            height: 25px;
            margin-left: 2px;
        }
    }
}
</style>


