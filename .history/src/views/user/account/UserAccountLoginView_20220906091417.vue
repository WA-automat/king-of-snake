<template>
  <ContentField>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">用户名</label>
            <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">密码</label>
            <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
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
          // 善意的提示
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