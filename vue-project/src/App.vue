<script setup>
import Nav from './components/Nav.vue';
import {RouterView} from 'vue-router';
import { onMounted } from 'vue';
import {useUserStore} from "./stores/users"

onMounted(() => {
  const userStore = useUserStore()
  userStore.getUser()
})
</script>

<template>
  <main>
    <Nav />
    <RouterView />
    
  </main>
</template>

