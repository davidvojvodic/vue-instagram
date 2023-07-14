<script setup>
  import { ref, reactive } from 'vue';
  import {useUserStore} from "../stores/users"
  import {storeToRefs} from  "pinia"

    const props =  defineProps(["isLogin"])
    const visible = ref(false);
    const userCredentials = reactive({
      email: "",
      password: "",
      username: ""
    })
    const userStore = useUserStore()

    const {errorMsg, loading, user} = storeToRefs(userStore);

      const showModal = () => {
        visible.value = true;
        
      };

      const handleOk = async (e) => {
        if(props.isLogin) {
          await userStore.handleLogin({
            password: userCredentials.password,
            email: userCredentials.email
          })
        }
        else {
          await userStore.handleSignup(userCredentials);
        }
       
        if(user.value) {
          visible.value = false
          userCredentials.email="";
          userCredentials.password= "";
          userCredentials.username = "";
        }
      };

      const handleCancel = () => {
        userStore.clearErrorMessage()
        visible.value = false;
        userCredentials.email = "";
        userCredentials.password = "";
        userCredentials.username = "";
        
      }

      const title = props.isLogin ? 'Login' : 'Sign up'

</script>

<template>
    <div>
      <a-button type="primary" @click="showModal">{{title}}</a-button>
      <a-modal v-model:visible="visible" :title="title" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :disabled="loading" @click="handleOk">Submit</a-button>
      </template>
      <div v-if="!loading">
        <AInput class="input" v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username" />
        <AInput class="input" v-model:value="userCredentials.email" placeholder="Email" />
        <AInput type="password" class="input" v-model:value="userCredentials.password" placeholder="Password" />
      </div>
      <div v-else class="flex items-center justify-center">
        <a-spin />
      </div>
        <ATypographyText type="danger" v-if="errorMsg">{{ errorMsg }}</ATypographyText>
      </a-modal>
    </div>
</template>

<style scoped>
.input {
    margin-bottom: 10px;
}
</style>
