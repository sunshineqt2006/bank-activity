<template>
    <div class="unpaid" v-if="userInfo.userId&&activity.unpaid&&unpaidTime.isShow">
        <em>您还有一笔未支付订单，请在
          <i class="red">{{unpaidTime.time.text}}</i> 内完成支付</em>
        <i @click="goPay(activity.unpaid.awardOrderNo)" class="unpaid-btn">去支付</i>
      </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    computed: {
    ...mapState("common", ["userInfo"]),
    ...mapState("business", [ "activity", "unpaidTime"])
  },
  methods: {
        ...mapActions("business", ["goPay"]),
    }
}
</script>
<style lang="less" scoped>
@import "~styles/var.less";
.unpaid {background: #fff9c4; padding:10px;font-size:13px;display: block;position: relative;
  .unpaid-btn { background: @primary-color; padding: 4px 5px; color: #ffffff;position: absolute;right: 10px;top: 6px;}
}
</style>
