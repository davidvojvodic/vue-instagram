<script setup>
// Import necessary dependencies
import Container from './Container.vue'; // Import the Container component
import ImageGallery from './ImageGallery.vue'; // Import the ImageGallery component
import Userbar from './Userbar.vue'; // Import the Userbar component
import { ref, onMounted, watch, reactive } from "vue"; // Import the ref, onMounted, watch, and reactive functions from Vue
import { supabase } from '../supabase'; // Import the supabase client instance
import { useRoute } from 'vue-router'; // Import the useRoute function from vue-router
import { useUserStore } from '../stores/users'; // Import the useUserStore function from the user store
import { storeToRefs } from 'pinia'; // Import the storeToRefs function from Pinia

// Access the current route using useRoute
const route = useRoute();

// Define reactive variables
const user = ref(null); // User data
const isFollowing = ref(false); // Flag indicating if the logged-in user is following the current user
const { username } = route.params; // Username from the route parameters
const loading = ref(false); // Loading state
const posts = ref([]); // Array of posts
const userInfo = reactive({ // User information
  posts: null, // Number of posts
  followers: null, // Number of followers
  following: null // Number of following
});

// Access the user store using useUserStore
const userStore = useUserStore();

// Extract the logged-in user from the user store
const { user: loggedInUser } = storeToRefs(userStore);

// Add a new post to the posts array
const addNewPost = (post) => {
  posts.value.unshift(post);
};

// Update the isFollowing value
const updateIsFollowing = (follow) => {
  isFollowing.value = follow;
};

// Fetch user data and related information
const fetchData = async () => {
  loading.value = true;

  // Retrieve the user data
  const { data: userData } = await supabase.from("users").select().eq("username", username).single();

  // If no user data found, stop loading and set user value to null
  if (!userData) {
    loading.value = false;
    return user.value = null;
  }

  user.value = userData;

  // Retrieve the posts of the user
  const { data: postsData } = await supabase.from("posts").select().eq("owner_id", user.value.id);

  posts.value = postsData;

  // Fetch if the logged-in user is following the current user
  await fetchIsFollowing();

  // Fetch the count of followers and following
  const followerCount = await fetchFollowersCount();
  const followingCount = await fetchFollowingCount();

  userInfo.followers = followerCount;
  userInfo.following = followingCount;
  userInfo.posts = posts.value.length;

  loading.value = false;
};

// Fetch if the logged-in user is following the current user
const fetchIsFollowing = async () => {
  if (loggedInUser.value && (loggedInUser.value.id !== user.value.id)) {
    const { data } = await supabase
      .from("followers_following")
      .select()
      .eq("follower_id", loggedInUser.value.id)
      .eq("following_id", user.value.id)
      .single();

    if (data) return isFollowing.value = true;
  }
};

// Fetch the count of followers for the current user
const fetchFollowersCount = async () => {
  const { count } = await supabase
    .from("followers_following")
    .select("*", { count: "exact" })
    .eq("following_id", user.value.id);

  return count;
};

// Fetch the count of following for the current user
const fetchFollowingCount = async () => {
  const { count } = await supabase
    .from("followers_following")
    .select("*", { count: "exact" })
    .eq("follower_id", user.value.id);

  return count;
};

// Watch for changes in the logged-in user
watch(loggedInUser, () => {
  fetchIsFollowing();
});

// Fetch data on component mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Container component -->
  <Container>
    <div class="flex flex-col py-5" v-if="!loading">
      <!-- Userbar component -->
      <Userbar
        :key="$route.params.username"
        :user="user"
        :userInfo="userInfo"
        :addNewPost="addNewPost"
        :isFollowing="isFollowing"
        :updateIsFollowing="updateIsFollowing"
      />
      <!-- ImageGallery component -->
      <ImageGallery :posts="posts" />
    </div>
    <div v-else class="flex items-center justify-center">
      <!-- Loading spinner -->
      <a-spin v-if="loading" />
    </div>
  </Container>
</template>
