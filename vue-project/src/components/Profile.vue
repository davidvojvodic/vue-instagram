<script setup>
import Container from './Container.vue';
import ImageGallery from './ImageGallery.vue';
import Userbar from './Userbar.vue';
import {ref, onMounted} from "vue"
import { supabase } from '../supabase';
import { useRoute } from 'vue-router';

const route = useRoute()
const user = ref(null)
const {username} = route.params
const loading = ref(false)
const posts = ref([])

const addNewPost = (post) => {
    posts.value.unshift(post)
}

const fetchData = async() => {
    loading.value = true
    const {data: userData} = await supabase.from("users").select().eq("username", username).single()

    if(!userData) {
        loading.value = false
        return user.value = null
    }


     user.value = userData
    

    const {data: postsData} = await supabase.from("posts").select().eq("owner_id", user.value.id)

    posts.value = postsData
    loading.value = false
}

onMounted(() => {
    fetchData()
})

</script>

<template>
    <Container>
        <div class="flex flex-col py-5" v-if="!loading">
            
            <Userbar :key="$route.params.username" :user="user" :userInfo="{
                posts: 4,
                followers: 200,
                following: 123
            }" :addNewPost="addNewPost" />
            <ImageGallery :posts="posts" />
        </div>
        <div v-else class="flex items-center justify-center">
            <a-spin v-if="loading" />
        </div>
    </Container>
</template>