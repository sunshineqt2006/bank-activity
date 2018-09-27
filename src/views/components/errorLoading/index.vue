<template>
    <div class="shadow" v-show='show'>
        <div class="box">
            <p class="title">活动太火爆了</p>
            <p class="detail">请耐心等待或刷新再试</p>
            <!-- <span class="btn" @click="refresh">刷新再试</span> -->
        </div>
    </div>
</template>
<script>
var ErrTime=null
export default {
    props: {},
    data() {
        return {
            show: false
        }
    },
    computed: {

    },
    methods: {
        refresh(){
            clearTimeout(ErrTime)
            ErrTime = setInterval(() => {
                location.reload()
            }, 10000)
                
        },
        zdRefresh(){
            location.reload()
        }
    }
}
</script>
<style lang="less" scoped>
    .shadow{position: absolute;width:100%;height: 100%;background: rgba(0, 0, 0, .5);top: 0;z-index: 99;
        .box{display: flex;flex-direction: column;align-items: center;position: relative;width: 250px;height: 230px;background: url('~assets/images/dialog_bg.png') no-repeat #ffffff;background-size: 100%;border-radius: 15px;top: 50%;left: 50%;margin-left: -125px;margin-top: -125px;
            .title{color: #ffffff;font-size: 22px;margin-top: 20px;}
            .detail{margin-top: 70px;margin-bottom: 40px;}
            .btn{border-radius:15px;padding: 4px 0;min-width: 150px;text-align: center;background: #ffa900; }
        }
    }
</style>