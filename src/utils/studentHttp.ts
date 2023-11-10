import axios from 'axios'

export const studentHttp = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
