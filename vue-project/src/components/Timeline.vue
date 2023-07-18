<script setup>
// Import necessary dependencies and components
import Container from './Container.vue'; // Import the Container component
import { useUserStore } from '../stores/users'; // Import the useUserStore function from the user store
import { storeToRefs } from 'pinia'; // Import the storeToRefs function from Pinia
import Cards from './Cards.vue'; // Import the Cards component
import LoginMessage from "./LoginMessage.vue"; // Import the LoginMessage component

// Access the user store using useUserStore
const userStore = useUserStore();

// Extract the user and loadingUser from the user store
const { user, loadingUser } = storeToRefs(userStore);
</script>

<template>
    <!-- Container component -->
    <Container>
        <div v-if="!loadingUser">
            <!-- Show the Cards component if the user exists -->
            <Cards v-if="user" />
            
            <!-- Show the LoginMessage component if the user does not exist -->
            <LoginMessage v-else />
        </div>
        <div v-else class="flex mt-11 items-center justify-center">
            <!-- Show a loading spinner if the user data is still loading -->
            <ASpin />
        </div>
    </Container>
</template>
