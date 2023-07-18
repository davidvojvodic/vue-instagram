<script setup>
// Import necessary dependencies

const props = defineProps({
  posts: Array // Declare the "posts" prop as an array
});

const { VITE_BASE_PHOTO_URL } = import.meta.env; // Retrieve the "VITE_BASE_PHOTO_URL" from the environment variables
</script>

<template>
  <!-- Display the images in a flex container -->
  <div class="flex justify-start flex-wrap">
    <!-- Iterate over the posts and display the images -->
    <img v-for="post in posts" :key="post.id" class="m-3 w-[200px]" :src="`${VITE_BASE_PHOTO_URL}${post.url}`" />
  </div>
</template>
