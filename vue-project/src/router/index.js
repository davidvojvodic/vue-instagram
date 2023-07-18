// Import necessary dependencies
import { createRouter, createWebHistory } from 'vue-router'; // Import createRouter and createWebHistory from vue-router
import HomeView from '../views/HomeView.vue'; // Import the HomeView component
import ProfileView from '../views/ProfileView.vue'; // Import the ProfileView component

// Create the router instance
const router = createRouter({
  // Set the history mode to use web history
  history: createWebHistory(import.meta.env.BASE_URL),

  // Define the routes
  routes: [
    {
      // Route for the home page
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // Route for the profile page with a dynamic parameter ":username"
      path: '/profile/:username',
      name: 'profile',
      component: ProfileView
    }
  ]
})

// Export the router instance
export default router
