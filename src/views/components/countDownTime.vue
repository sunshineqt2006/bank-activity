<template>
  <div class="count-down-time" v-if="activityTime.isShowTime">
    <span class="title">
      <em>{{nextTime>0?'距离活动开始':'距离活动结束'}}</em>
    </span>
    <div class="time-con">
      <div class="t-c">
        <i v-for="h in activityTime.time.hr">{{h}}</i>时</div>
      <div class="t-c">
        <i v-for="m in activityTime.time.min">{{m}}</i>分</div>
      <div class="t-c">
        <i v-for="s in activityTime.time.sec">{{s}}</i>秒</div>
    </div>
    <!-- {{ `${day}天 ${hr}小时 ${min}分 ${sec}秒` }}  -->
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    props: {
        nextTime: [Number,String]
    },
    computed: {
        ...mapState("business", ["activityTime"])
    }
};
</script>
