<script setup>
// Import necessary dependencies and components
import { RouterLink, useRouter } from 'vue-router'; // Import RouterLink and useRouter from vue-router
import Container from './Container.vue'; // Import the Container component
import AuthModal from './AuthModal.vue'; // Import the AuthModal component
import { ref } from 'vue'; // Import the ref function from Vue
import { useUserStore } from "../stores/users"; // Import the useUserStore function from the user store
import { storeToRefs } from 'pinia'; // Import the storeToRefs function from Pinia

// Setup the router and user store
const router = useRouter(); // Create a router instance using useRouter
const userStore = useUserStore(); // Access the user store using useUserStore

// Extract the user and loadingUser from the user store
const { user, loadingUser } = storeToRefs(userStore);

// Create reactive variables using ref
const searchUsername = ref('');
const isAuthenticated = ref(false);

// Handle search functionality
const onSearch = () => {
    if (searchUsername.value) {
        router.push(`/profile/${searchUsername.value}`);
        searchUsername.value = '';
    }
}

// Handle logout functionality
const handleLogout = async () => {
    await userStore.handleLogout();
}

// Go to the user's profile
const goToUsersProfile = () => {
    router.push(`/profile/${user.value.username}`);
}
</script>

<template>
    <!-- Header layout -->
    <ALayoutHeader>
        <Container>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <!-- Link to the home page -->
                    <RouterLink class="text-white" to="/">Instagram</RouterLink>
                    
                    <!-- Search input field -->
                    <AInputSearch
                        v-model:value="searchUsername"
                        placeholder="Username..."
                        style="width: 200px"
                        @search="onSearch"
                    />
                </div>
                <div v-if="!loadingUser">
                    <!-- If the user is not authenticated -->
                    <div class="flex items-center gap-6" v-if="!user">
                        <!-- Show authentication modals for login and registration -->
                        <AuthModal :isLogin="false" />
                        <AuthModal :isLogin="true" />
                    </div>
                    <!-- If the user is authenticated -->
                    <div class="flex items-center gap-6" v-else>
                        <!-- Button to go to the user's profile -->
                        <AButton type="primary" @click="goToUsersProfile">Profile</AButton>
                        
                        <!-- Button to handle logout -->
                        <AButton type="primary" @click="handleLogout">Logout</AButton>
                    </div>
                </div>
            </div>
        </Container>
    </ALayoutHeader>
</template>
