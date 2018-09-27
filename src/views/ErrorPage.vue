<template>
<page noBack>
<div class="error-page">
        <img src="~assets/images/404.jpg" class="err-img">
      </div>

</page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {
  }
};
</script>
<style lang="less" scoped>
@import "~styles/var.less";
.error-page {height: 623px;background: #ffffff;
  .err-img{    width: 100%;}
}
</style>

