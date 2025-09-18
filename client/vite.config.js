import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/searchIngredient': 'http://localhost:5000',
      '/findRecipes': 'http://localhost:5000',
      '/getComments': 'http://localhost:5000',
      '/addComment': 'http://localhost:5000',
      '/deleteComment': 'http://localhost:5000'
    }
  }
})