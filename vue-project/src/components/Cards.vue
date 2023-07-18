<script setup>
// Import necessary dependencies and components
import { supabase } from '../supabase'; // Import the supabase client instance
import Card from './Card.vue'; // Import the Card component
import Observer from "./Observer.vue"; // Import the Observer component
import { useUserStore } from '../stores/users'; // Import the useUserStore function from the user store
import { storeToRefs } from 'pinia'; // Import the storeToRefs function from Pinia
import { onMounted, ref } from 'vue'; // Import the onMounted and ref functions from Vue

// Access the user store using useUserStore
const userStore = useUserStore();

// Extract the user from the user store
const { user } = storeToRefs(userStore);

// Define reactive variables
const posts = ref([]); // Array of posts
const lastCardIndex = ref(2); // Index of the last card displayed
const ownerIds = ref([]); // Array of owner IDs (followings)
const reachEnd = ref(false); // Flag indicating if the end of posts has been reached

// Fetch initial data
const fetchData = async () => {
  // Retrieve the followings of the current user
  const { data: followings } = await supabase
    .from("followers_following")
    .select("following_id")
    .eq("follower_id", user.value.id);

  // Extract the owner IDs from the followings
  ownerIds.value = followings.map(f => f.following_id);

  // Retrieve the posts of the followings, ordered by creation date
  const { data } = await supabase
    .from("posts")
    .select()
    .in("owner_id", ownerIds.value)
    .range(0, lastCardIndex.value)
    .order("created_at", { ascending: false });

  // Update the posts with the retrieved data
  posts.value = data;
};

// Fetch the next set of posts
const fetchNextSet = async () => {
  // Proceed only if the end of posts has not been reached
  if (!reachEnd.value) {
    // Retrieve the next set of posts
    const { data } = await supabase
      .from("posts")
      .select()
      .in("owner_id", ownerIds.value)
      .range(lastCardIndex.value + 1, lastCardIndex.value + 3)
      .order("created_at", { ascending: false });

    // Append the new posts to the existing posts array
    posts.value = [...posts.value, ...data];

    // Update the lastCardIndex
    lastCardIndex.value += 3;

    // If no new posts were fetched, reach the end of posts
    if (!data.length) {
      reachEnd.value = true;
    }
  }
};

// Fetch initial data on component mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Main template -->
  <div class="flex items-center flex-col gap-5 mt-4 mb-4">
    <!-- Render each post using the Card component -->
    <Card v-for="post in posts" :key="post.id" :post="post" />
    
    <!-- Render the Observer component when there are posts -->
    <Observer v-if="posts.length" class="mb-5" @intersect="fetchNextSet" />
  </div>
</template>
