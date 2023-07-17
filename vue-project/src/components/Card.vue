<script setup>

  const props = defineProps(["post"])
</script>

<template>
    <a-card hoverable style="width: 240px">
      <template #cover>
        <img alt="example" :src="`https://ofudapiypjyfggrdiwwk.supabase.co/storage/v1/object/public/images/${post.url}`" />
      </template>
      <a-card-meta :title="post.username">
        <template #description>{{ post.caption }}</template>
      </a-card-meta>
    </a-card>
</template>