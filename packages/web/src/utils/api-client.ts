import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.browser ? '/api' : 'http://api:4100',
})
