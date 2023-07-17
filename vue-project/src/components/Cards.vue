<script setup>
import { supabase } from '../supabase';
import Card from './Card.vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';


const userStore = useUserStore()

const {user} = storeToRefs(userStore)

const posts = ref([])

const fetchData = async () => {
    const {data: followings} = await supabase
    .from("followers_following")
    .select("following_id")
    .eq("follower_id", user.value.id)

    const owner_ids = followings.map(f => f.following_id)

    const {data} = await supabase
    .from("posts")
    .select()
    .in("owner_id", owner_ids)

    posts.value = data
}

onMounted(() => {
    fetchData()
})
</script>

<template>
    <div class="flex items-center flex-col gap-5 mt-4">
            <Card v-for="post in posts" :key="post.id" :post="post" />
    </div>
</template>