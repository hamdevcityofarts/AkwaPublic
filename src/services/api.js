// src/services/api.js
import axios from 'axios'

// ⚠️ SUPPRIMEZ complètement import.meta.env et utilisez ceci :
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// OU si vous voulez utiliser le .env (optionnel) :
// const VITE_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('🔗 URL API:', VITE_API_BASE_URL)

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api