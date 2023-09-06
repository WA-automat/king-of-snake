<!--HTML文件位置-->
<template>
  <div class="background">
    <router-view></router-view>
  </div>
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
}

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("assets/images/background.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
