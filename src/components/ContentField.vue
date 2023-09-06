<template>
  <div class="container content-feild">
    <div class="card">
      <div class="card-body">
        <slot>

        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentField.vue"
}
</script>

<style scoped>
/*为组件添加外边距*/
div.content-feild {
  margin-top: 20px;
}
</style>