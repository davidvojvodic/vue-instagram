<script setup>
import Container from './Container.vue';
import ImageGallery from './ImageGallery.vue';
import Userbar from './Userbar.vue';
import {ref, onMounted, watch, reactive} from "vue"
import { supabase } from '../supabase';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const route = useRoute()
const user = ref(null)
const isFollowing = ref(false)
const {username} = route.params
const loading = ref(false)
const posts = ref([])
const userInfo = reactive({
                posts: null,
                followers: null,
                following: null
            })

const userStore = useUserStore()
const {user: loggedInUser} = storeToRefs(userStore)

const addNewPost = (post) => {
    posts.value.unshift(post)
}

const updateIsFollowing = (follow) => {
    isFollowing.value = follow
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

    await fetchIsFollowing()

    await fetchFollowersCount()

    loading.value = false
}



const fetchIsFollowing = async() => {
    if(loggedInUser.value && (loggedInUser.value.id !== user.value.id)) {
        const {data} = await supabase
        .from("followers_following")
        .select()
        .eq("follower_id", loggedInUser.value.id)
        .eq("following_id", user.value.id)
        .single()

        if(data) return isFollowing.value = true
        
    }
}

const fetchFollowersCount = async () => {
    const response = await supabase
    .from("followers_following")
    .select()
    .eq("following_id", user.value.id)

    console.log(response)
}

watch(loggedInUser, () => {
    fetchIsFollowing()
})

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
            }" :addNewPost="addNewPost" :isFollowing="isFollowing" :updateIsFollowing="updateIsFollowing" />  
            <ImageGallery :posts="posts" />
        </div>
        <div v-else class="flex items-center justify-center">
            <a-spin v-if="loading" />
        </div>
    </Container>
</template>