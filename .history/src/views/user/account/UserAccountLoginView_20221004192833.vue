<!--
 * @Author: WA_automat 1577696824@qq.com
 * @Date: 2022-09-05 15:11:57
 * @LastEditors: WA_automat 1577696824@qq.com
 * @LastEditTime: 2022-10-04 19:17:52
 * @FilePath: \web\src\views\user\account\UserAccountLoginView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <ContentField>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">用户�?</label>
            <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">密码</label>
            <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密�?">
          </div>
          <div class="error-message">{{error_message}}</div>
          <button type="submit" class="btn btn-primary">提交</button>
        </form>
      </div>
    </div>
  </ContentField>
</template>


<script>
import ContentField from "../../../components/ContentField";
import {useStore} from 'vuex';
import {ref} from "vue";
import router from "@/router";

export default {
  name: "UserAccountLoginView",
  components: {
    ContentField
  },
  setup() {
    const store = useStore();
    let username = ref('');
    let password = ref('');
    let error_message = ref('');

    const login = () => {
      // 清空error_message
      error_message = "";

      store.dispatch("login",{
        username:username.value,
        password:password.value,
        success(){
          store.dispatch("getinfo",{
            success(){
              router.push({name:'home'});
              console.log(store.state.user);
            }
          })
        },
        error(){
          // 善意的提�?
          error_message = "用户名或密码错误";
        }
      })
    }

    return {
      // 返回内容
      username,
      password,
      error_message,
      login,
    }
  }
}
</script>

<style scoped>
button {
  width: 100%;
}

div.error-message {
  color: red;
}
</style>