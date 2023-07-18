<script setup>
// Import necessary dependencies
import { ref, reactive } from 'vue'; // Import the ref and reactive functions from Vue
import { useUserStore } from "../stores/users"; // Import the useUserStore function from the user store
import { storeToRefs } from "pinia"; // Import the storeToRefs function from Pinia

// Define component props
const props = defineProps(["isLogin"]);

// Define reactive variables
const visible = ref(false); // Modal visibility
const userCredentials = reactive({ // User credentials form fields
  email: "",
  password: "",
  username: ""
});

// Access the user store using useUserStore
const userStore = useUserStore();

// Extract reactive variables from the user store
const { errorMsg, loading, user } = storeToRefs(userStore);

// Show the modal
const showModal = () => {
  visible.value = true;
};

// Handle OK button click
const handleOk = async (e) => {
  if (props.isLogin) {
    await userStore.handleLogin({
      password: userCredentials.password,
      email: userCredentials.email
    });
  } else {
    await userStore.handleSignup(userCredentials);
  }

  if (user.value) {
    // Reset form fields and close the modal
    visible.value = false;
    userCredentials.email = "";
    userCredentials.password = "";
    userCredentials.username = "";
  }
};

// Handle Cancel button click
const handleCancel = () => {
  // Clear error message, reset form fields, and close the modal
  userStore.clearErrorMessage();
  visible.value = false;
  userCredentials.email = "";
  userCredentials.password = "";
  userCredentials.username = "";
};

// Determine the title based on isLogin prop
const title = props.isLogin ? 'Login' : 'Sign up';
</script>

<template>
  <!-- Modal component -->
  <div>
    <!-- Button to show the modal -->
    <a-button type="primary" @click="showModal">{{title}}</a-button>

    <!-- Modal component -->
    <a-modal v-model:visible="visible" :title="title" @ok="handleOk">
      <!-- Modal footer -->
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :disabled="loading" @click="handleOk">Submit</a-button>
      </template>

      <!-- Modal content -->
      <div v-if="!loading">
        <!-- Username input field (only for sign up) -->
        <AInput class="input" v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username" />

        <!-- Email input field -->
        <AInput class="input" v-model:value="userCredentials.email" placeholder="Email" />

        <!-- Password input field -->
        <AInput type="password" class="input" v-model:value="userCredentials.password" placeholder="Password" />
      </div>

      <!-- Loading spinner -->
      <div v-else class="flex items-center justify-center">
        <a-spin />
      </div>

      <!-- Error message (if any) -->
      <ATypographyText type="danger" v-if="errorMsg">{{ errorMsg }}</ATypographyText>
    </a-modal>
  </div>
</template>

<style scoped>
.input {
  margin-bottom: 10px;
}
</style>
