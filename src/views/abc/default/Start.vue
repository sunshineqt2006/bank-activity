<template>
    <div class="page abc">
        <div class="header">
            <x-header :left-options="{showBack: false}">{{$route.meta.title}}</x-header>
        </div>
        <div class="content">
            <span class="btn" @click="$router.push({path:'/Turntable'})" ></span>
        </div>
        
    </div>
</template>
<script>
export default {
  created() {
    if (this.$route.query.activityId)  this.$store.commit("business/setActivityId", this.$route.query.activityId)
  }
}
</script>
<style lang="less" scoped>
    .page{display: flex;flex-direction: column;
        .content{flex:1;position: relative;background: url('~assets/images/abChina/teacher/start_bg.jpg') no-repeat;background-size: 100% 100%;
            .btn{position: absolute;bottom: 20px;left: 130px;width: 94px;height: 30px;display: inline-block;background: url('~assets/images/abChina/teacher/start_btn.png') no-repeat;background-size: 100% 100%;}
        }
    }
    
</style>
