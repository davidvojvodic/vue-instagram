<script setup>
// Import necessary dependencies
import { ref, onMounted } from "vue"; // Import the ref and onMounted functions from Vue

// Define reactive variables
const observer = ref(null); // IntersectionObserver instance
const root = ref(null); // Reference to the root element

// Define emits function to emit custom event
const emits = defineEmits(["intersect"]);

// Execute code when the component is mounted
onMounted(() => {
  // Create a new IntersectionObserver instance
  observer.value = new IntersectionObserver(([entry]) => {
    // If the observed element is intersecting
    if (entry && entry.isIntersecting) {
      // Emit the "intersect" event
      emits("intersect");
    }
  });

  // Observe the root element
  observer.value.observe(root.value);
});
</script>

<template>
  <!-- Root element with ref "root" -->
  <div class="h-10 w-10" ref="root"></div>
</template>
