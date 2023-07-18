// Import the main CSS file
import './assets/main.css'

// Import necessary dependencies
import { createApp } from 'vue' // Import the createApp function from Vue
import { createPinia } from 'pinia' // Import the createPinia function from Pinia
import Antd from 'ant-design-vue' // Import Ant Design Vue library
import 'ant-design-vue/dist/antd.css' // Import the Ant Design CSS file

import App from './App.vue' // Import the App component
import router from './router' // Import the router configuration

// Create a new Vue app instance
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Ant Design Vue library
app.use(Antd)

// Use the router configuration
app.use(router)

// Mount the app to the DOM element with the ID 'app'
app.mount('#app')
