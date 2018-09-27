<template>
  <page noBack>
        <div class="body">
            <span class="btn" @click="$router.push({ path: '/' + $route.meta.parent })" ></span>
        </div>
        
  </page>
</template>
<script>
export default {
  created() {
    if (this.$route.query.activityId)  this.$store.commit("business/setActivityId", this.$route.query.activityId)
  }
}
</script>
<style lang="less" scoped>
        .body{flex:1;position: relative;background: url('~assets/images/abc/teacher/start_bg.jpg') no-repeat;background-size: 100% 100%;
            .btn{position: absolute;bottom: 20px;left: 130px;width: 94px;height: 38px;display: inline-block;background: url('~assets/images/abc/teacher/start_btn.png') no-repeat;background-size: 100% 100%;}
        }
    
</style>
