import { ref } from 'vue'
import { defineStore } from 'pinia'
import {supabase} from "../supabase"

export const useUserStore = defineStore('users', () => {
  const user = ref(null);
  const errorMsg = ref("");
  const loading = ref(false)
  const loadingUser = ref(false)

  const handleLogin = async (credentials) => {
    const {email, password} = credentials

    if(!email.includes("@")) {
      return errorMsg.value = "Email is not valid!"
    }

    if(!password.length) {
      return errorMsg.value = "Password cannot be empty"
    }

    loading.value = true

   const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error) {
      loading.value = false;
      return errorMsg.value = error.message
    }

    const {data: existingUser} = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single()

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id
    }

    loading.value = false
    errorMsg.value = ""

  }

  const handleSignup = async (credentials) => {
    const {email, password, username} = credentials

    if(password.length < 6) {
      return errorMsg.value = "Password is too short!"
      
    }

    if(username.length < 4) {
      return errorMsg.value = "Username is too short!"
    }

    if(!email.includes("@")) {
      return errorMsg.value = "Email is not valid!"
    }

    loading.value=true;

    //validate if user exists
    const {data: userWithUsername} = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .single()

    if(userWithUsername) {
      loading.value = false
      return errorMsg.value = "User already exists"
    }

    errorMsg.value = "";

    await supabase.auth.signUp({
      email,
      password,
    })

    await supabase.from("users").insert({username, email})

    const {data: newUser} = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single()

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }

    loading.value = false
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const getUser = async() => {
    loadingUser.value = true;
    const {data} = await supabase.auth.getUser()

    if(!data.user) {
      loadingUser.value = false;
      return user.value = null
    }

    const {data: userWithEmail} = await supabase
    .from("users")
    .select()
    .eq("email", data.user.email)
    .single()

    user.value = {
      username: userWithEmail.username,
      email: userWithEmail.email,
      id: userWithEmail.id
    }

    loadingUser.value = false
  }

  const clearErrorMessage = () => {
    errorMsg.value = ""
  }

  return { user,errorMsg, loading, loadingUser, clearErrorMessage, handleLogin, handleSignup, handleLogout, getUser }
})
