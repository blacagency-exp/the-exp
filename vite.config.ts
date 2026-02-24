import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL),
    'import.meta.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY),
    'import.meta.env.REACT_APP_PAYSTACK_PUBLIC_KEY': JSON.stringify(process.env.REACT_APP_PAYSTACK_PUBLIC_KEY),
    'import.meta.env.REACT_APP_SANITY_PROJECT_ID': JSON.stringify(process.env.REACT_APP_SANITY_PROJECT_ID),
  },
  server:{
      host:true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
