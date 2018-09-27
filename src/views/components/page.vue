<template>
    <div class="page" >
        <div class="header" :class="object" v-if="noHeader">
            
            <x-header :left-options="{backText: '',showBack: !noBack}">{{$route.meta.title}}
                <a slot="right" class="black" @click="$emit('pagDetailClick',true)" v-if="pagDetail">红包明细</a>
            </x-header>
        </div>
        <slot name="unpaid"></slot>
        <div style="position:relative">
            <scroller lock-x scrollbar-y  height="-44">
                <div class="conent"><slot></slot></div>
            </scroller>
            <slot name="other"></slot>
        </div>
    </div>
</template>
<script>
import { Scroller } from "vux";
import { mapState } from "vuex";
export default {
    props:{
        pagDetail:{
          type:Boolean,
          default:false
        },
        noBack:{
            type:Boolean,
            default:false
        },
        noHeader:{
            type:Boolean,
            default:true
        }
    },
     components: {Scroller},
     computed: {
        ...mapState("common", ["object"]),
     }
}
</script>
<style lang="less" scoped>
@import "~styles/var.less";
    .page{display: flex;flex-direction: column;background: #f6f6f6;position: relative;
    .vux-header .black {color: #333333;}
        .conent{min-height: 623px; overflow: auto;display: flex;flex-direction: column;}
        .header.cib .vux-header{    background: #3b76d8;height: 44px;}
        .header.ccb .vux-header{    background: #09b6f2;height: 44px;}
        .header.abc .vux-header{    background: #ffffff;height: 44px;}
        .header.unionpay_abc .vux-header{    background: #ffffff;height: 44px;}
    }


</style>


