<script setup>
// Import necessary dependencies
import { ref } from 'vue'; // Import the ref function from Vue
import { supabase } from "../supabase"; // Import the supabase client instance
import { useUserStore } from '../stores/users'; // Import the useUserStore function from the user store
import { storeToRefs } from 'pinia'; // Import the storeToRefs function from Pinia

// Define component props
const props = defineProps(["addNewPost"]);

// Access the user store using useUserStore
const userStore = useUserStore();

// Extract user from the user store
const { user } = storeToRefs(userStore);

// Define reactive variables
const loading = ref(false); // Loading state
const errorMessage = ref(""); // Error message
const visible = ref(false); // Modal visibility
const caption = ref(""); // Caption input value
const file = ref(null); // File input value

// Function to show the modal
const showModal = () => {
  visible.value = true;
};

// Function to handle the OK button click
const handleOk = async () => {
  loading.value = true;

  // Generate a random file name
  const fileName = Math.floor(Math.random() * 1000000000000);
  let filePath;

  // Upload the file to the storage if a file is selected
  if (file.value) {
    const { data, error } = await supabase.storage
      .from("images")
      .upload("public/" + fileName, file.value);

    if (error) {
      loading.value = false;
      return (errorMessage.value = "Unable to upload image");
    }

    filePath = data.path;

    // Insert the post data into the "posts" table
    await supabase.from("posts").insert({
      url: filePath,
      caption: caption.value,
      owner_id: user.value.id
    });
  }

  loading.value = false;
  visible.value = false;
  caption.value = "";

  // Call the addNewPost function with the new post data
  props.addNewPost({
    url: filePath,
    caption: caption.value
  });
};

// Function to handle the file input change event
const handleUploadChange = (e) => {
  if (e.target.files[0]) {
    file.value = e.target.files[0];
  }
};
</script>

<template>
  <div>
    <!-- Button to trigger the modal -->
    <a-button @click="showModal">
      Upload photo
    </a-button>
    <!-- Modal component -->
    <a-modal v-model:visible="visible" title="Upload Photo" @ok="handleOk">
      <div v-if="!loading">
        <!-- File input for selecting the photo -->
        <input class="mb-4" type="file" accept=".jpeg,.png,.jpg" @change="handleUploadChange" />
        <!-- Caption input -->
        <AInput class="mt-4" v-model:value="caption" placeholder="Caption..." />
        <!-- Display error message if exists -->
        <ATypographyText type="danger" v-if="errorMessage">{{ errorMessage }}</ATypographyText>
      </div>
      <div class="flex items-center justify-center" v-else>
        <!-- Display loading spinner -->
        <ASpin />
      </div>
    </a-modal>
  </div>
</template>
