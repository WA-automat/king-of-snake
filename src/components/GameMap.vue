<template>
  <div ref="parent" class="gamemap">
    <canvas ref="canvas" tabindex="0"></canvas>
  </div>
</template>

<script>
import {GameMap} from "@/assets/scripts/GameMap.js";
import {ref, onMounted} from "vue";

export default {
  name: "GameMap",
  setup() {
    let parent = ref(null);
    let canvas = ref(null);

    // 挂载对象后执行的内容
    onMounted(() => {
      new GameMap(canvas.value.getContext('2d'), parent.value);
    })

    return {
      parent,
      canvas
    }
  }
}
</script>

<style scoped>
/*游戏地图的样式*/
div.gamemap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>