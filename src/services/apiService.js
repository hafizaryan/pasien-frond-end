import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add Authorization header interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan otomatis logout pada error 401
    // Biarkan komponen yang menangani error ini
    return Promise.reject(error)
  }
)

export const patientService = {
  // Get all patients
  async getPatients() {
    try {
      const response = await api.get('/patients')
      return response.data
    } catch (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
  },

  // Get patient by ID
  async getPatient(id) {
    try {
      const response = await api.get(`/patients/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw error
    }
  },

  // Create new patient
  async createPatient(patientData) {
    try {
      const response = await api.post('/patients', patientData)
      return response.data
    } catch (error) {
      console.error('Error creating patient:', error)
      throw error
    }
  },

  // Update patient
  async updatePatient(id, patientData) {
    try {
      const response = await api.put(`/patients/${id}`, patientData)
      return response.data
    } catch (error) {
      console.error('Error updating patient:', error)
      throw error
    }
  },

  // Delete patient
  async deletePatient(id) {
    try {
      const response = await api.delete(`/patients/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  }
}

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      // Store token and user data sesuai dengan struktur response API
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user))
      }
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  },

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    // Periksa apakah token dan user data ada
    // Jangan logout otomatis, percayai localStorage
    return !!(token && userData)
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('auth_token')
  }
}

export default patientService
