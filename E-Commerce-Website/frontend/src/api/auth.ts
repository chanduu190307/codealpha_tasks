import api from './client'
import type { User } from '@/types'

export interface LoginData { email: string; password: string }
export interface RegisterData { name: string; email: string; password: string }
export interface AuthResult { user: User; token: string }

export const authApi = {
  register: (data: RegisterData) =>
    api.post<{ success: boolean; data: AuthResult }>('/auth/register', data).then(r => r.data.data),

  login: (data: LoginData) =>
    api.post<{ success: boolean; data: AuthResult }>('/auth/login', data).then(r => r.data.data),

  getMe: () =>
    api.get<{ success: boolean; data: User }>('/auth/me').then(r => r.data.data),

  updateProfile: (data: Partial<User> & { newPassword?: string; currentPassword?: string }) =>
    api.put<{ success: boolean; data: User }>('/auth/profile', data).then(r => r.data.data),

  forgotPassword: (email: string) =>
    api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email }).then(r => r.data),

  resetPassword: (token: string, password: string) =>
    api.post<{ success: boolean; message: string }>('/auth/reset-password', { token, password }).then(r => r.data),
}
