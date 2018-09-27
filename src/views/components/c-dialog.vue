<template>
    <div class="c-dialog" v-if="dialogShow">
        <div class="box">
            <i class="close" @click="closeDialog">×</i>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        dialogShow:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        closeDialog(){
            this.$emit("closeDialogFn",true)
        }
    }
}
</script>
<style lang="less" scoped>
.c-dialog{position: absolute;width: 100%;height: 100%;top:0;left:0;z-index: 0;background: rgba(0,0,0,.5);display: flex;justify-content: center;align-items: center;
    .box{background: #ffffff;border-radius: 15px;width: 250px;text-align: center;padding: 20px;position: relative;
        i.close{position: absolute;right:10px;top: 5px;font-size: 30px;}
    }
}
</style>
