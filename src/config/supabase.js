import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mhaazlogdgrknknbqarh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oYWF6bG9nZGdya25rbmJxYXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDI2OTIsImV4cCI6MjA5NDM3ODY5Mn0.sOfOSyxNfnZud0mx5h5aqmD2zcfsNmOLEDgIqmV3zA0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
