<script setup>
import {RouterLink, useRouter} from 'vue-router';
import Container from './Container.vue';
import AuthModal from './AuthModal.vue';
import { ref } from 'vue';
import {useUserStore} from "../stores/users"
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore()

const {user, loadingUser} = storeToRefs(userStore)
const searchUsername = ref('');
const isAuthenticated = ref(false);

const onSearch = () => {
    if(searchUsername.value) {
        router.push(`/profile/${searchUsername.value}`)
        searchUsername.value = '';
    }
}

const handleLogout = async() => {
    await userStore.handleLogout()
}

const goToUsersProfile = () => {
    router.push(`/profile/${user.value.username}`)
}
</script>

<template>
    <ALayoutHeader>
        <Container>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <RouterLink class="text-white" to="/">Instagram</RouterLink>
                    <AInputSearch
                        v-model:value="searchUsername"
                        placeholder="Username..."
                        style="width: 200px"
                        @search="onSearch"
                        />
                </div>
                <div v-if="!loadingUser">
                    <div class="flex items-center gap-6" v-if="!user">
                        <AuthModal :isLogin="false" />
                        <AuthModal :isLogin="true" />
                    </div>
                    <div class="flex items-center gap-6" v-else>
                        <AButton type="primary" @click="goToUsersProfile">Profile</AButton>
                        <AButton type="primary" @click="handleLogout">Logout</AButton>
                    </div>
                </div>
            </div>
            
        </Container>
    </ALayoutHeader>
</template>