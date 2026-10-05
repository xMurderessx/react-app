import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Las rutas relativas funcionan tanto en el artefacto de GitHub Actions
  // como en el respaldo publicado desde la rama principal.
  base: './',
  plugins: [react()],
})
