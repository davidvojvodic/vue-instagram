import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ofudapiypjyfggrdiwwk.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdWRhcGl5cGp5ZmdncmRpd3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNjQ4NzYsImV4cCI6MjAwNDc0MDg3Nn0.Nw0S03t3crfJF_XTq7X72ma9D_-iJhgsR1h1QtYxDmY"

export const supabase = createClient(supabaseUrl, supabaseKey)