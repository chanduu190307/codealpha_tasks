import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; message: string; errors?: unknown[] }>) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth state
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.dispatchEvent(new Event('auth:logout'))
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    const enhanced = new Error(message) as Error & { status?: number; errors?: unknown[] }
    enhanced.status = error.response?.status
    enhanced.errors = error.response?.data?.errors
    return Promise.reject(enhanced)
  }
)

export default apiClient
