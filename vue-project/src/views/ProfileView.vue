<script setup>
// Import necessary dependencies
import Profile from '../components/Profile.vue'; // Import the Profile component
</script>

<template>
  <main>
    <!-- Render the Profile component with the current username as the key prop -->
    <Profile :key="$route.params.username" />
  </main>
</template>
