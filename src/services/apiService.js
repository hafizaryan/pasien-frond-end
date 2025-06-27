import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

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

export default patientService
