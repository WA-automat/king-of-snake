<!--HTML文件位置-->
<template>
  <router-view></router-view>
</template>

<!--script脚本位置-->
<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";

export default {
  components: {

  }
}
</script>

<!--CSS样式文件位置-->
<style>
/*修改Web图标需要修改favicon.ico*/
/*背景图片后期修改位置*/
body {
  background: url("assets/images/background.png") no-repeat;
  background-size: cover;
  margin: 100px;
}
</style>
