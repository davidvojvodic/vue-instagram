<script setup>
import Container from './Container.vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import Cards from './Cards.vue';
import LoginMessage from "./LoginMessage.vue"

const userStore = useUserStore()

const {user, loadingUser} = storeToRefs(userStore)



</script>

<template>
    <Container>
    <div v-if="!loadingUser">
        <Cards v-if="user" />
        <LoginMessage v-else />
    </div>
    <div v-else class="flex mt-11 items-center justify-center">
        <ASpin />
    </div>
    </Container>
</template>