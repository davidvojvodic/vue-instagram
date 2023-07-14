<script setup>
import { ref } from 'vue';
import {supabase} from "../supabase"
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const props = defineProps(["addNewPost"])

const userStore = useUserStore()

const {user} = storeToRefs(userStore)

const loading = ref(false)
const errorMessage = ref("")
const visible = ref(false);
const caption = ref("")
const file = ref(null)

const showModal = () => {
    visible.value = true;
};

const handleOk = async() => {
    loading.value = true
    const fileName = Math.floor(Math.random() * 1000000000000)
    let filePath
    if(file.value) {
       const {data, error} = await supabase.storage.from("images").upload("public/" + fileName, file.value)
        
        if(error) {
            loading.value = false
            return errorMessage.value = "Unable to upload image"
        }

        filePath = data.path
        await supabase.from("posts").insert({
            url: filePath,
            caption: caption.value,
            owner_id: user.value.id
        })
    }

    loading.value = false
    visible.value = false;
    caption.value = ""
    props.addNewPost({
        url: filePath,
        caption: caption.value,
    })
};

const handleUploadChange = (e) => {
    
    if(e.target.files[0]) {
        file.value = e.target.files[0]
    }
};

</script>

<template>
    <div>
        <a-button  @click="showModal">
            Upload photo
        </a-button>
        <a-modal v-model:visible="visible" title="Upload Photo" @ok="handleOk">
            <div v-if="!loading">
                <input class="mb-4" type="file" accept=".jpeg,.png,.jpg" @change="handleUploadChange" />
                <AInput class="mt-4" v-model:value="caption" placeholder="Caption..." />
                <ATypographyText type="danger" v-if="errorMessage">{{ errorMessage }}</ATypographyText>
            </div>
            <div class="flex items-center justify-center" v-else>
                <ASpin  />
            </div>
        </a-modal>
    </div>
</template>