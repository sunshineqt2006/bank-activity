<template>
  <page :noHeader="false">
    <div class="body">
      <div class="content" v-if="couponList.length!==0">

        <div class="box" v-for="(item,index) in couponList" :key="index" :class="item.awardType=='1'? prizeStyle[1]:prizeStyle[0]">
          <div class="film-top">
            <i class="type" v-if="item.awardType=='1'">优惠券</i>
            <i class="type" v-else-if="item.awardType=='2'">兑换券</i>
            <i class="type" v-else>实物券</i>
            <div class="detail">
              <div class="name" v-if="item.awardType=='1'">
                <i>￥</i> {{item.awardMoney}}</div>
              <div class="info">
                <h1 class="f15">{{item.awardName}}</h1>
                <p>{{item.remark}}</p>
              </div>
            </div>
            <span class="btn" @click="matchingFn(item)" v-if="item.awardType=='3'">核销</span>
            <span class="btn" @click="$util.goToWap" v-else>去购票</span>
            

          </div>
          <div class="film-bottom frbm">
            <em class=" text-ellipsis-line">有效期至：{{new Date(parseInt(item.endTime)*1000).format('yyyy-MM-dd hh:mm:ss')}}</em>
          </div>
        </div>


      </div>
      <div class="no-data" v-else> <img src="~assets/images/no_data_icon.png"></div>
    </div>
    <x-dialog v-model="dialog.show" class="dialog-demo">
        <div style="padding:20px;">
          <span class="title">请输入核销码</span>
          <div class="input-group">
            <x-input  type="text" placeholder=""  novalidate :show-clear="false" v-model="hxm" :max="4" ></x-input>
          </div>
        </div>
        <div class="btn-group"> <span @click="dialog.show=false">取消</span><span @click="submitCheck" >确定核销</span> </div>
      </x-dialog>
  </page>
</template>
<script>
import {mapState, mapActions } from "vuex";
import Api from "api/authApi";
export default {
    data() {
        return {
          hxm:'',
          dialog:{
            show:false,
            data:{}
          },
            dataList: [],
            prizeStyle: ["first", "second", "third", "fourth"]
        };
    },
    computed: {
        ...mapState("coupon", ["couponList"]),
    },
    methods:{
      ...mapActions("coupon", ["getCoMarketAwardLog"]),
      matchingFn(coupon){
        this.hxm=''
        this.dialog={
          show:true,
          data:coupon
        }

      },
      submitCheck(){
        if(this.hxm===''){
          this.$vux.toast.text('请输入核销码')
          return;
        }
        // str=this.hx.a.toString()+this.hx.b.toString()+this.hx.c.toString()+this.hx.d.toString()
        Api.exchangePrize(this.hxm,this.dialog.data.awardLogId).then(res=>{
            this.dialog={
              show:false,
              data:{}
            }
            this.$vux.toast.text(res.text)
            this.getCoMarketAwardLog()
        },err=>{ this.$vux.toast.text(err.text);})
      }
    }
};
</script>
<style lang="less">
.weui-dialog{border-radius: 15px;}
#app .weui-cell{padding: 5px 0 0 15px;
  .weui-input{    letter-spacing: 44px;}
}
</style>

<style lang="less" scoped>
  .body {flex: 1; display: flex;justify-content: center;
    .box {
      width: 350px;
      margin: 10px auto;
      background: #ffffff;
      border-radius: 8px;
      *{font-size: 13px;}
      .detail-body{padding: 10px 0;margin: 0 10px; border-top: 1px solid #dddddd;}
      .film-bottom {    height: 40px;padding: 0 15px 0 10px;
        em {font-weight: normal;
          white-space: nowrap;
        }
      }
      .film-top {
        width: 350px;
        height: 93px;
        background-repeat: no-repeat;position: relative;
        .type{background: #ffffff;position: absolute;right: 0;top: 10px;padding: 4px 10px 4px 8px;border-top-left-radius: 15px;border-bottom-left-radius: 15px;}
        .detail {
          padding: 0px 85px 0px 60px;
          display: flex;
          height: 100%;
        }
        .info {color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 15px;
          h1{margin-bottom: 5px;}
        }
        .name {
          color: #ffffff;
          text-align: center;
          font-weight: normal;
          white-space: nowrap;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 40px;
          i {
            margin-top: 13px;
            font-size: 20px;
          }
        }
        .btn {
          padding: 4px 8px;
          border-radius: 15px;
          background: #ffffff;
          position: absolute;right: 10px;font-size: 12px;
          bottom: 17px;
          &.disable{background: #dcdcdc;color:#aaaaaa!important; }
        }
      }
        &.first .film-top{
          background: url("~assets/images/coupon_box_top_bg.png") no-repeat;
          background-size: 100%;
          .type,.btn{color:#05b5f1; }
          }
        &.second .film-top{
          background: url("~assets/images/coupon_box_top_bg2.png");
          background-size: 100%;
          .type,.btn{color:#59bf48; }
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
  .dialog-demo{border-radius: 15px;
    .btn-group{display: flex;justify-content: space-between;border-top: 1px solid #eeeeee;
      span{flex: 1;text-align: center;padding: 15px;color:#159ced ;
        &:first-child{border-right: 1px solid #eeeeee;}
      }
    }
    span.title{font-weight: bolder;}
    .input-group{background:url('~assets/images/ilike/hxm_input_bg.jpg')no-repeat;    margin: 20px 0 0 40px;width:230px;height: 30px;background-size:190px 100%;
      input.hxm{border:0;background:none;width:180px;height: 30px;letter-spacing:47px;margin-left: 11px;}
    }
  }
</style>

