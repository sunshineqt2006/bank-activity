<template>
<page>
  <div class="login">
      <img src="~assets/images/cib/logo.png" class="logo">
      <div class="form">
        <!-- <div class="form-input user"><input type="text" class="input" placeholder="银行户名（姓名）" v-model="form.userName" ></div> -->
        <div class="form-input pw"><input type="tel" name="telephone" class="input" placeholder="请输入手机号" v-model="form.mobile"></div>
        <div class="form-yzm">
          <div class="form-input link"><input type="number" class="input" placeholder="请输入验证码" v-model="form.verifyCode"></div>
          <div class="btn btn-yzm" @click="getCode(form.mobile)">{{code.showText}}</div>
        </div>
        <div class="btn btn-login" @click="login(form)">立即登录</div>
      </div>
    </div>

</page>
</template>
<script>
import Api from "api/authApi";
import {mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      form: {}
    };
  },
    computed: {
    ...mapState("common", [ "code"])
  },
  methods: {
    ...mapActions("common", [ "getCode","login"])
  },
  created(){
    this.$store.commit('common/setCode',{showText:"获取验证码",isClick:true})
  }
};
</script>
<style lang="less" scoped>
@import "~styles/var.less";
  .login {flex: 1;background: #ffffff;text-align: center;display: flex;flex-direction: column;justify-content: center;align-items: center;
    .logo { width: 160px; }
    .form { margin: 40px 20px;
      .btn-login {background: #3b76d8; margin-top: 30px;}
      .btn-yzm { background: #3b76d8; width: 90px;}
    }
  }
</style>

