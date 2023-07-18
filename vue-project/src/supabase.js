// Import the createClient function from the '@supabase/supabase-js' library
import { createClient } from '@supabase/supabase-js'

// Extract Supabase URL and key from environment variables
const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env

// Assign Supabase URL and key to variables
const supabaseUrl = VITE_SUPABASE_URL
const supabaseKey = VITE_SUPABASE_KEY

// Create a Supabase client instance with the provided URL and key
export const supabase = createClient(supabaseUrl, supabaseKey)
