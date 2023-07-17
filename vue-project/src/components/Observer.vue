<script setup>
import {ref, onMounted} from "vue"


const observer = ref(null)
const root = ref(null)

const emits = defineEmits(["intersect"])

onMounted(() => {
    observer.value = new IntersectionObserver(([entry]) => {
        if(entry && entry.isIntersecting) {
            emits("intersect")
        }
    })

    observer.value.observe(root.value)
})
</script>

<template>
    <div class="h-10 w-10" ref="root">
        
    </div>
</template>