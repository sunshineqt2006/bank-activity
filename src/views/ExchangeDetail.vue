<template>
  <page noBack>
    <div class="page-body">
      <iframe id="iframe" :src="url" frameborder="0" width="100%" height="100%" :scrolling="isIos?'no':'yes'"></iframe>
    </div>
</page>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      isIos:false
    };
  },
  methods: {
  },
  mounted() {
    var _self=this
  },
  created() {
    this.url = this.$route.query.url;
    this.isIos=!!navigator.userAgent.match(/iPad|iPhone/i)
  }
};
</script>
<style lang="less" scoped>
@import "~styles/var.less";
  .page-body {position: relative;top: 44px; height: 623px;
    iframe{
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    min-width: 100%;
    *width:100%;
    width:1px;
}
}
</style>

