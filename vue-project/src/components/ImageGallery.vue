<script setup>

const props = defineProps({
   posts: Array
})

const {VITE_BASE_PHOTO_URL} = import.meta.env
</script>

<template>
    <div class="flex justify-start flex-wrap">
        <img v-for="post in posts" :key="post.id" class="m-3 w-[200px]" :src="`${VITE_BASE_PHOTO_URL}${post.url}`"  />
    </div>
</template>