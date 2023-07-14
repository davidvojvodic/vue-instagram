<script setup>

const props = defineProps({
   posts: Array
})
</script>

<template>
    <div class="flex justify-start flex-wrap">
        <img v-for="post in posts" :key="post.id" class="m-3 w-[200px]" :src="`https://ofudapiypjyfggrdiwwk.supabase.co/storage/v1/object/public/images/${post.url}`"  />
    </div>
</template>