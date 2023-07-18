<template>
  <!-- Main template -->
  <main>
    <!-- Include the Nav component -->
    <Nav />
    
    <!-- Include the RouterView component for dynamic routing -->
    <RouterView />
  </main>
</template>

<script setup>
// Import necessary dependencies and functions
import Nav from './components/Nav.vue'; // Import the Nav component
import { RouterView } from 'vue-router'; // Import the RouterView component from vue-router
import { onMounted } from 'vue'; // Import the onMounted function from Vue
import { useUserStore } from "./stores/users" // Import the useUserStore function from the user store

// Execute code when the component is mounted
onMounted(() => {
  // Access the user store using useUserStore()
  const userStore = useUserStore()
  
  // Call the getUser() method from the user store
  userStore.getUser()
})
</script>
