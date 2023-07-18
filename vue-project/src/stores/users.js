import { ref } from 'vue'; // Import the ref function from Vue
import { defineStore } from 'pinia'; // Import the defineStore function from Pinia
import { supabase } from "../supabase"; // Import the supabase client instance

// Define the user store using defineStore
export const useUserStore = defineStore('users', () => {
  // Define reactive variables
  const user = ref(null); // User data
  const errorMsg = ref(""); // Error message
  const loading = ref(false); // Loading state
  const loadingUser = ref(false); // User loading state

  // Handle user login
  const handleLogin = async (credentials) => {
    // Extract email and password from credentials
    const { email, password } = credentials;

    // Validate email format
    if (!email.includes("@")) {
      return errorMsg.value = "Email is not valid!";
    }

    // Validate password presence
    if (!password.length) {
      return errorMsg.value = "Password cannot be empty";
    }

    loading.value = true;

    // Sign in the user with email and password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Handle sign-in error
    if (error) {
      loading.value = false;
      return errorMsg.value = error.message;
    }

    // Retrieve the existing user data from the database
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    // Update the user data in the store
    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id
    };

    loading.value = false;
    errorMsg.value = "";
  };

  // Handle user signup
  const handleSignup = async (credentials) => {
    // Extract email, password, and username from credentials
    const { email, password, username } = credentials;

    // Validate password length
    if (password.length < 6) {
      return errorMsg.value = "Password is too short!";
    }

    // Validate username length
    if (username.length < 4) {
      return errorMsg.value = "Username is too short!";
    }

    // Validate email format
    if (!email.includes("@")) {
      return errorMsg.value = "Email is not valid!";
    }

    loading.value = true;

    // Check if user with the same username exists
    const { data: userWithUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    // Handle username already exists
    if (userWithUsername) {
      loading.value = false;
      return errorMsg.value = "User already exists";
    }

    errorMsg.value = "";

    // Sign up the user with email and password
    await supabase.auth.signUp({
      email,
      password,
    });

    // Insert the new user data into the database
    await supabase.from("users").insert({ username, email });

    // Retrieve the newly created user data from the database
    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    // Update the user data in the store
    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    };

    loading.value = false;
  };

  // Handle user logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  // Get user data
  const getUser = async () => {
    loadingUser.value = true;

    // Retrieve the authenticated user data from supabase
    const { data } = await supabase.auth.getUser();

    // If no user data found, reset the user value and stop loading
    if (!data.user) {
      loadingUser.value = false;
      return user.value = null;
    }

    // Retrieve the user data with email from the database
    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();

    // Update the user data in the store
    user.value = {
      username: userWithEmail.username,
      email: userWithEmail.email,
      id: userWithEmail.id
    };

    loadingUser.value = false;
  };

  // Clear error message
  const clearErrorMessage = () => {
    errorMsg.value = "";
  };

  // Return the store properties and methods
  return {
    user,
    errorMsg,
    loading,
    loadingUser,
    clearErrorMessage,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser
  };
});
