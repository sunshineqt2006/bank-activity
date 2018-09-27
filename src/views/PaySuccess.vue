<template>
<page noBack>
    <div class="body">
      <div class="top" v-if="showResultText==='支付成功！'">
        <img src="~assets/images/pay_success_icon.png" class="logo">
        <p>{{showResultText}}</p>
      </div>
      <div class="top" v-else>
        <img src="~assets/images/pay_success_icon.png" class="logo">
        <p>{{showResultText}}</p>
      </div>

      <div class="info">
        <p class="frbm"> <em>商品名称</em> <em>{{couponInfo.awardName}}</em> </p>
        <p class="frbm"> <em>支付金额</em> <em class="orange">￥{{couponInfo.payMoney}}</em> </p>
        <p class="frbm"> <em>交易时间</em> <em>{{new Date(parseInt(couponInfo.payTime)*1000).format('yyyy-MM-dd hh:mm:ss')}}</em> </p>
      </div>
      <div class="exchange-xz" @click="$util.exchangeUrl" v-if="object==='ccb'">兑换细则</div>
      <x-button  type="warn" class="custom-primary"  v-if="showResultText==='支付成功！'" @click.native="$util.goToWap">去使用</x-button>
      <x-button plain type="default" @click.native="backActivity" class="custom-primary">返回活动</x-button>
    </div>

    <page noBack class="paying-page" v-if="isPayingShow">
      <div class="body">
          <img class="pay-icon" src="~assets/images/paying_icon.gif">
          <p>支付中...</p>
      </div>
    </page>
    <c-dialog :dialogShow="dialogShow" @closeDialogFn="dialogShow=false">
        <img src="~assets/images/refund_faild_img.jpg" class="refund-faild-img">
        <p class="left">{{backTip}}</p>
        <div class="btn-group">
          <span class="btn default" @click="$util.goToWap">继续使用</span>
          <span class="btn gray" @click="backThirdPartyFn">前往退款</span>
        </div>
    </c-dialog>

</page>

</template>
<script>
import Api from 'api/authApi'
import { mapState } from "vuex";
import CDialog from "views/components/c-dialog.vue"
export default {
  data() {
    return {
      dialogShow:false,
      awardOrderNo:'',
      couponInfo:{},
      isPayingShow:true,
      backTip:'',
      showResultText:'支付成功！'
    };
  },
  components:{CDialog},
  computed: {
    ...mapState("common", ['object','indexUrl'])
  },
  methods: {
    backActivity(){
      window.location.href=this.indexUrl
    },
    getLogStatus(){
      var that=this
      this.isPayingShow=true
      Api.getCoMarketAwardLogStatus(this.awardOrderNo).then(res=>{
        if(res.data.isPay=='1'){
          clearTimeout(timer)
          this.couponInfo = res.data
          this.isPayingShow=false
          if(res.data.isBack){
            this.dialogShow=true
            this.backTip=res.data.backTip
          }
        }else{
          this.isPayingShow=true
          var timer=setTimeout(() => {
            that.getLogStatus()
          }, 5000);
        }
      })
    },
    backThirdPartyFn(){
      Api.backThirdParty(this.awardOrderNo).then(res=>{
        this.$vux.toast.text('退款成功');
        this.showResultText='退款成功！'
        this.dialogShow=false
      },err=>{
        // this.dialogShow=false
        this.$vux.toast.text(err.text);
      })
    }
  },
  created(){
    this.awardOrderNo=this.$route.query.awardOrderNo
    this.getLogStatus()
  }
};
</script>

<style lang="less" scoped>
@import "~styles/var.less";
.body{
  .top{background: @green-color;text-align: center;padding: 30px;color: #ffffff;
    img{width: 80px;margin-bottom: 10px;}
  }
  .info{margin-top: 10px;background: #ffffff;
    p{padding: 15px 20px;border-bottom:1px solid @border-color2; }
  }
  .custom-primary {margin-top: 30px;width: 50%;border-radius: 99px!important;
  &:last-child{margin-top: 20px;}
}
.exchange-xz{position: relative;padding-left: 42px;padding-top: 8px;font-size: 14px;
  &::before{content: '';background: url("~assets/images/exchange_small_icon.png");width: 18px;    height: 18px;position: absolute;
    background-size: 100%;left: 20px;
}}

}
.paying-page{position: fixed!important;top: -44px!important;width: 100%;height: 100%;display: flex;flex-direction: column;
  .body{flex: 1;display: flex;align-items: center;justify-content: center;flex-direction: column;
    .pay-icon{width: 130px;margin-bottom: 20px;}
    p{font-size: 20px;}
  }
}
.c-dialog{
  .refund-faild-img{width: 90px;margin-bottom: 15px;}
  .btn-group{display: flex;justify-content: space-around;margin-top: 20px;
    .btn{border-radius: 15px;padding: 5px 10px;
      &.default{background: #1dc2bb;}
      &.gray{background: #aaaaaa;}
    }
  }

}
</style>

