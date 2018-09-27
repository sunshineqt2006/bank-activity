<template>
  <page>
    <div class="body">
      <div class="content" v-if="couponList.length!==0">
        <div class="box" v-for="(item,index) in couponList" :key="index" >
          <div class="film-top">
            <div class="title" :class="prizeStyle[index%3]">
              <h1 class="text-ellipsis-line"><i>￥</i>{{item.awardMoney}}</h1>
              <p class="text-ellipsis-line">{{item.awardName}}</p>
            </div>
            <div class="detail">
              <p class="text-ellipsis">备注：{{item.remark}}</p>
              <p>有效期至：{{new Date(parseInt(item.endTime)*1000).format('yyyy-MM-dd hh:mm:ss')}}</p>
          </div>
        </div>
      </div>


      </div>
      <div class="no-data" v-else> <img src="~assets/images/no_data_icon.png"></div>
    </div>

  </page>
</template>
<script>
import {mapState, mapActions } from "vuex";
export default {
    data() {
        return {
            dataList: [],
            prizeStyle: ["a", "b", "c", "d"]
        };
    },
    computed: {
        ...mapState("coupon", ["couponList"]),
    }
};
</script>

<style lang="less" scoped>
@import "~styles/var.less";
  .body {flex: 1; display: flex;justify-content: center;
    .box {
      width: 350px;
      margin: 10px auto;
      background: #ffffff;
      *{font-size: 13px;}
      .film-top {
        width: 350px;
        height: 93px;display: flex;
        background-repeat: no-repeat;position: relative;
        .title{width: 100px;overflow: hidden;text-align: center;display: flex;color: #ffffff;flex-direction: column;justify-content: center;
          h1{font-size:25px;font-weight: normal ;margin-bottom: 5px;
            i{position: relative;font-size: 15px;}
          }
          &.a{background:#88a8ff;
            &::before{content: '';width: 6px;height:100%;position:absolute;left: -5px;background:url('~assets/images/abc/coupon_bg_a.png') repeat-y;}
          }
          &.b{background:#fda93d;
            &::before{content: '';width: 6px;height:100%;position:absolute;left: -5px;background:url('~assets/images/abc/coupon_bg_b.png') repeat-y;}
          }
          &.c{background:#37d38f;
            &::before{content: '';width: 6px;height:100%;position:absolute;left: -5px;background:url('~assets/images/abc/coupon_bg_c.png') repeat-y;}
          }
        }
        .detail {margin-left: 10px;padding: 10px 0;flex: 1;
          display: flex;flex-direction: column;justify-content: space-between;
        }
      }
        
    }
  }
  .no-data {
    background: #f3f5f7;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 125px;
    }
  }
</style>

