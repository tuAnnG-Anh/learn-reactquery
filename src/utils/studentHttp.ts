import axios from 'axios'

export const studentHttp = axios.create({
  baseURL: 'https://test-9lwd.onrender.com/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
