import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  ) //Verbindung zu eigener URL und Key

  return {
    provide: {
      supabase
    }
  } //macht $supabase global verfügbar
})