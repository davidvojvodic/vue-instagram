<script setup>
import UploadPhotoModal from './UploadPhotoModal.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { supabase } from '../supabase';

const route = useRoute();
const userStore = useUserStore();

const {username: profileUsername} = route.params
const {user} = storeToRefs(userStore)

const props = defineProps({
    user: Object,
    userInfo: Object,
    addNewPost: Function,
    isFollowing: Boolean,
    updateIsFollowing: Function
})

const followUser = async() => {
    props.updateIsFollowing(true)
    await supabase.from("followers_following").insert({follower_id: user.value.id, following_id: props.user.id})
}

const unfollowUser = async() => {
    props.updateIsFollowing(false)
    await supabase.from("followers_following").delete().eq("follower_id" , user.value.id).eq("following_id", props.user.id)
}

</script>

<template>
    <div class="flex flex-col pb-20" v-if="props.user">
        <div class="flex justify-between items-center">
            <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
            <div v-if="user">
                <UploadPhotoModal v-if="profileUsername === user.username" :addNewPost="addNewPost" />
                <div v-else>
                    <AButton v-if="!props.isFollowing" @click="followUser">Follow</AButton>
                    <AButton v-else @click="unfollowUser">Following</AButton>
                </div>
            </div>
        </div>
        <div class="flex flex-row items-center gap-5 info">
            <a-typography-title :level="5">{{ userInfo.posts }} posts</a-typography-title>
            <a-typography-title :level="5">{{ userInfo.followers }} followers</a-typography-title>
            <a-typography-title :level="5">{{ userInfo.following }} following</a-typography-title>
        </div>
    </div>
    <div v-else>
        <div class="flex justify-between items-center">
            <a-typography-title :level="2">User not found</a-typography-title>
    
        </div>
    </div>
</template>

<style scoped>
.info h5 {
    margin: 0 !important;
}
</style>