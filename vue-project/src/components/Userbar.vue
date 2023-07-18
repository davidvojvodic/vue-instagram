<script setup>
// Import necessary dependencies
import UploadPhotoModal from './UploadPhotoModal.vue'; // Import the UploadPhotoModal component
import { useRoute } from 'vue-router'; // Import the useRoute function from vue-router
import { useUserStore } from '../stores/users'; // Import the useUserStore function from the user store
import { storeToRefs } from 'pinia'; // Import the storeToRefs function from Pinia
import { supabase } from '../supabase'; // Import the supabase client instance

// Access the current route using useRoute
const route = useRoute();

// Access the user store using useUserStore
const userStore = useUserStore();

// Extract the profileUsername from the route parameters
const { username: profileUsername } = route.params;

// Extract user from the user store
const { user } = storeToRefs(userStore);

// Define component props
const props = defineProps({
  user: Object,
  userInfo: Object,
  addNewPost: Function,
  isFollowing: Boolean,
  updateIsFollowing: Function
});

// Function to follow a user
const followUser = async () => {
  props.updateIsFollowing(true);
  await supabase.from("followers_following").insert({ follower_id: user.value.id, following_id: props.user.id });
};

// Function to unfollow a user
const unfollowUser = async () => {
  props.updateIsFollowing(false);
  await supabase.from("followers_following").delete().eq("follower_id", user.value.id).eq("following_id", props.user.id);
};
</script>

<template>
  <!-- User information section -->
  <div class="flex flex-col pb-20" v-if="props.user">
    <div class="flex justify-between items-center">
      <!-- User's username -->
      <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
      <div v-if="user">
        <!-- UploadPhotoModal component for the user's own profile -->
        <UploadPhotoModal v-if="profileUsername === user.username" :addNewPost="addNewPost" />
        <div v-else>
          <!-- Follow/Unfollow buttons for other users' profiles -->
          <AButton v-if="!props.isFollowing" @click="followUser">Follow</AButton>
          <AButton v-else @click="unfollowUser">Following</AButton>
        </div>
      </div>
    </div>
    <!-- User information: posts, followers, following -->
    <div class="flex flex-row items-center gap-5 info">
      <a-typography-title :level="5">{{ userInfo.posts }} posts</a-typography-title>
      <a-typography-title :level="5">{{ userInfo.followers }} followers</a-typography-title>
      <a-typography-title :level="5">{{ userInfo.following }} following</a-typography-title>
    </div>
  </div>
  <!-- User not found message -->
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
