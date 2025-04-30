import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Replace 'your-repo-name' with the actual name of your GitHub repository
export default defineConfig({
  base: '/Midterm/', 
  plugins: [react()],
})
