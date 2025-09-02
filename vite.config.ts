import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // By default, this plugin may only apply to .jsx and .tsx files.
    // We explicitly include .ts and .js files to ensure components
    // or files with hooks (like i18n.ts) are correctly processed.
    include: '**/*.{js,jsx,ts,tsx}',
  })],
})