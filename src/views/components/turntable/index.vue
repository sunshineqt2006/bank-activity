<template>
  <div class="turntable-page">
    <i class="activity-sm">本活动仅限福州地区</i>
    <div class="turntable">
      <div class="banner">
        <div class="turnplate">
          <canvas class="item" id="wheelcanvas" width="422px" height="422px"></canvas>
          <i class="pointer-pay" @click="pointerFn" v-if="!!Number(activity.drawPay)&&activity.remainDrawNum<=0"></i>
          <i class="pointer" @click="pointerFn" v-else></i>
        </div>
      </div>
    </div>
    <p class="change-p f13" v-if="userInfo.userId">您有<em class="red">{{activity.remainDrawNum?activity.remainDrawNum:0}}次</em>抽奖机会</p>
  </div>

</template>
<script>
require("./jquery-1.10.2.js");
require("./awardRotate.js");
import { mapState,mapActions } from "vuex";
export default {
  props: {
    prizeList: Array,
    intervalColors:{
            type: Array,
            default: ["#fff3f3", "#f0edfa"]
        },
    outsideRadius:{
      type:Number,
      default:188
    },
  },
  data() {
    return {
      turnplate: {}
    };
  },
  computed: {
    ...mapState("common", ["userInfo"]),
    ...mapState("business", ["activity","btnStatus","prize","unpaidTime"]),
  },
  watch: {
      prizeList(val, old) {
        this.$nextTick(() => {
          this.turnplate.bRotate=false
          this.init(this.prizeList);
        });
      }
  },
  methods: {
    ...mapActions("business", [ "goPay", "drawPrize","getDrawResult"]),
    init(prizeList) {
      let _self = this;
      let turnplate = {
        restaraunts: [], //大转盘奖品名称
        colors: [], //大转盘奖品区块对应背景颜色
        outsideRadius: _self.outsideRadius, //大转盘外圆的半径
        textRadius: 145, //大转盘奖品位置距离圆心的距离
        insideRadius: 48, //大转盘内圆的半径
        startAngle: 0, //开始角度
        randomRate: [], //控制获奖率，百分制(相加需等于100%)，对应restaraunts(顺序需要保持一致)，
        bRotate: false //false:停止;ture:旋转
      };

      $(document).ready(function() {
        //动态添加大转盘的奖品与奖品区域背景颜色
        turnplate.randomRate = []; //小心设置按100%分配
        turnplate.restaraunts = prizeList;
        turnplate.colors = _self.intervalColors  ;
        
        if(turnplate.restaraunts.length%2 !==0){
          turnplate.colors.push('#fff4d6')
        }
        this.turnplate = turnplate;

        _self.$set(_self, "turnplate", turnplate);
      });

      //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
      setTimeout(() => {
        _self.drawRouletteWheel(this.turnplate);
      }, 100);
    },
    //旋转转盘 item:奖品位置; txt：提示语;
    rotateFn(item, params) {
      var _self = this;
      let angles =  item * (360 / this.turnplate.restaraunts.length) - 360 / (this.turnplate.restaraunts.length * 2);
      if (angles < 270) {
        angles = 270 - angles;
      } else {
        angles = 360 - angles + 270;
      }
      $("#wheelcanvas").stopRotate();
      $("#wheelcanvas").rotate({
        angle: 0,
        animateTo: angles + 1800,
        duration: 8000,
        callback: function() {
          _self.turnplate.bRotate = !_self.turnplate.bRotate;
          _self.$store.commit('business/setPrize', { result: params, isShow: true, unpaidTime: { timeStamp: 1 } })
          params.isAward && Number(params.payMoney) && _self.prize.unpaidTime.timeStamp && _self.$util.countdown(Math.abs(params.payTime), 'mm:ss', (timeStamp, showText) => {
              if (timeStamp == 0) {
                  _self.$store.commit('business/setPrize', { result: {}, isShow: false, unpaidTime: { timeStamp: 1 } })
                  _self.$store.dispatch('getCoMarketInfoStock')
                  return false;
              };
              _self.$store.commit('business/setPrize', { result: params, isShow: true, unpaidTime: { timeStamp: timeStamp, text: showText } })
          })
        }
      });
    },
    pointerFn() {
      var _self = this;
      
      //获取随机数(奖品个数范围内)

      _self.drawPrize({prizeId:this.prizeList[0].prizeId,remainDrawNum:this.activity.remainDrawNum,isResult:true,beforeDraw:()=>{
        if (this.turnplate.bRotate) return;
        this.turnplate.bRotate = !this.turnplate.bRotate;
      }}).then(res=>{
        this.getDrawResult({prizeId: this.prizeList[0].prizeId, drawcode: res.data,isResult:true }).then(res=>{
          let item=null;
          this.prizeList.forEach((a, index) => {
            
          if ( res.isAward === 1 &&!res.isOldPrize && a.prizeId === res.awardId ) {
            item = index + 1;
            return;
          }
          if ( res.isAward === 1 &&res.isOldPrize==1 && a.prizeId === res.prizeId ) {
            item = index + 1;
            return;
          }

          if ( res.isAward === 0 &&!res.isOldPrize &&a.prizeId === res.awardId ) {
            item = this.prizeList.length;
          return;
          }
          //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
          });
          _self.rotateFn(item, res);
        },err=>{
        this.turnplate.bRotate=false
      })
      },err=>{
        this.turnplate.bRotate=false
      });
    },
    drawRouletteWheel(turnplate) {
      let canvas = document.getElementById("wheelcanvas");
      if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        let arc = Math.PI / (turnplate.restaraunts.length / 2);
        let ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 422, 422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = "22px Microsoft YaHei";
        for (let i = 0; i < turnplate.restaraunts.length; i++) {
          let img = new Image();
          img.src = turnplate.restaraunts[i].prizePic;
          img.onload = () => {
            let angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i % 3];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(
              211,
              211,
              turnplate.outsideRadius,
              angle,
              angle + arc,
              false
            );
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = "#E5302F";
            let text = turnplate.restaraunts[i].prizeName;
            let prizeId = turnplate.restaraunts[i].prizeId;
            let line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(
              211 + Math.cos(angle + arc / 2) * turnplate.textRadius,
              211 + Math.sin(angle + arc / 2) * turnplate.textRadius
            );

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if (text.indexOf("M") > 0) {
              //流量包
              let texts = text.split("M");
              for (let j = 0; j < texts.length; j++) {
                ctx.font =
                  j == 0 ? "bold 20px Microsoft YaHei" : "16px Microsoft YaHei";
                if (j == 0) {
                  ctx.fillText(
                    texts[j] + "M",
                    -ctx.measureText(texts[j] + "M").width / 2,
                    j * line_height
                  );
                } else {
                  ctx.fillText(
                    texts[j],
                    -ctx.measureText(texts[j]).width / 2,
                    j * line_height
                  );
                }
              }
            } else if (text.indexOf("M") == -1 && text.length > 8) {
              //奖品名称长度超过一定范围
              text = text.substring(0, 8) + "||" + text.substring(8);
              let texts = text.split("||");
              for (let j = 0; j < texts.length; j++) {
                ctx.fillText(
                  texts[j],
                  -ctx.measureText(texts[j]).width / 2,
                  j * line_height
                );
              }
            } else {
              //在画布上绘制填色的文本。文本的默认颜色是黑色
              //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
              ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }

            //添加对应图标
            ctx.drawImage(img, -25, 15, 50, 50)
            ;

            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
          };
          //----绘制奖品结束----
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.turntable-page {position: relative; text-align: center;
  .activity-sm{color: #ffffff;background: #e85a60;padding: 5px 10px;position: absolute;right: 0;top: -30px;font-size: 10px;border-top-left-radius: 15px;border-bottom-left-radius:15px;}
  .change-p {
    text-align: center;
    padding: 10px;
  }
}
.turntable {
  width: 254px;
  height: 340px;
  overflow: hidden;
  .banner {
    display: block;
    width: 254px;
    height: 254px;
  }
  .banner .turnplate {
    display: block;
    position: relative;
  }
  .banner .turnplate canvas.item {
    width: 100%;
  }
  .banner .turnplate i.pointer,.banner .turnplate i.pointer-pay {
    position: absolute;
    height: 81px;
    width: 75px;
    left: 50%;
    margin-left: -38px;
    top: 50%;
    margin-top: -50px;
  }
}
</style>
