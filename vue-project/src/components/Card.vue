<script setup>
// Define component props
const props = defineProps(["post"]);

// Extract base photo URL from environment variables
const { VITE_BASE_PHOTO_URL } = import.meta.env;
</script>

<template>
    <!-- Card component with hover effect -->
    <a-card hoverable style="width: 240px">
      <template #cover>
        <!-- Display the post image using the base photo URL and post URL -->
        <img alt="example" :src="`${VITE_BASE_PHOTO_URL}${post.url}`" />
      </template>
      <!-- Card meta information -->
      <a-card-meta :title="post.username">
        <template #description>{{ post.caption }}</template>
      </a-card-meta>
    </a-card>
</template>
