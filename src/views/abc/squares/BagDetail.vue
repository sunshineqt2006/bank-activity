<template>
  <page>
    <div class="body">


        <div class="total">
          <div class="con">
            <span class="box green">  <em>累积领取</em> <em>￥{{detail.getTotal}}</em> </span><em class="f24">-</em>
            <span class="box red">  <em>累积使用</em> <em>￥{{detail.useTotal}}</em> </span><em class="f24">=</em>
            <span class="box green">  <em>当前可用</em> <em>{{detail.usableTotal}}</em> </span>
          </div>
          <p class="gray">请在 {{new Date(parseInt(this.activityEnd)*1000).format('yyyy-MM-dd')}} 之前使用，逾期失效</p>
        </div>
        <div class="list" v-for="item in list">
          <p class="date">{{item.name}}</p>
          <div class="con">
            <div class="cell frbm" v-for="sitem in item.data"> <span class="green f24" :class="sitem.logType==='0'?'green':'red'">{{sitem.logType==='0'?'+':'-'}}{{sitem.cashBonus}}</span><em>{{new Date(parseInt(sitem.createTime)*1000).format('MM-dd hh:mm:ss')}}</em> </div>
          </div>
        </div>



    </div>
    
  </page>
</template>
<script>
import Api from "api/authApi";
export default {
  data() {
    return {
        activityId:'',
        activityEnd:'',
        detail:{},
        list:[]
    };
  },
  watch:{
        '$route':{
          handler: function (val, oldVal) {
               if(val.path==="/"+window._vue.$route.meta.parent+'/BagDetail'){
                this.getDataList()
               }
            },
          deep: true
        }
      },
  methods: {
      getDataList(){
          Api.getBagDetail(this.activityId).then(res=>{
            
              this.detail=res.data
              this.detail.list&&this.detail.list.forEach(a=>{

              })
              var arr = this.detail.list
              var map = {},
                  dest = [];
              for(var i = 0; i < arr.length; i++){
                  var ai = arr[i];
                  if(!map[new Date(parseInt(ai.createTime)*1000).format('yyyy年MM月')]){
                      dest.push({
                          name: new Date(parseInt(ai.createTime)*1000).format('yyyy年MM月'),
                          data: [ai]
                      });
                      map[new Date(parseInt(ai.createTime)*1000).format('yyyy年MM月')] = ai;
                  }else{
                    
                      for(var j = 0; j < dest.length; j++){
                          var dj = dest[j];
                          if(dj.name == new Date(parseInt(ai.createTime)*1000).format('yyyy年MM月')){
                              dj.data.push(ai);
                              break;
                          }
                      }
                  }
              }
              this.list=dest
          })
      }
      
  },
  created() {
      this.activityId=this.$route.query.activityId
      this.activityEnd=this.$route.query.activityEnd
      this.getDataList()
  }
};
</script>

<style lang="less" scoped>
@import "~styles/var.less";
@import "../style.less";
  .body { min-height: 622px; overflow-y: auto; background: #f6f6f6;
    .total{background: #ffffff;padding: 15px 0;text-align: center;
      .con{display: flex;align-items: center;margin: 10px 30px 20px;
        .box{width: 80px;display: inline-block;height: 80px;border-radius: 10px;margin: 0 auto;display: flex;align-items: center;flex-direction: column;justify-content: center;
          &.green{border: 1px solid #02c3ab;color: #02c3ab;}
          &.red{border: 1px solid #df3031;color: #df3031;}
        }
      }
      .gray{color: #989ba6;}
    }
    .list{
      .date{padding: 10px 15px;}
      .con{background: #ffffff;
        .cell{padding: 15px;border-bottom: 1px solid #eee;
          .green{position: relative;display: flex;align-items: center;color:#02c3ab;
            &::before{content: '';height: 36px;width:36px;margin-right: 10px;background: url('~assets/images/abc/squares/+bag_icon.jpg');background-size: 100%;display: inline-block;}
          }
          .red{position: relative;display: flex;align-items: center;color:#df3031;
            &::before{content: '';height: 36px;width:36px;margin-right: 10px;background: url('~assets/images/abc/squares/-bag_icon.jpg');background-size: 100%;display: inline-block;}
          }

        }
      }
    }
    
  }
</style>

