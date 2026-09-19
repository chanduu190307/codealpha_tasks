import api from './client'
import type { Category, ApiResponse } from '@/types'

export const categoriesApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories').then(r => r.data.data),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`).then(r => r.data.data),

  create: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/categories', data).then(r => r.data.data),

  update: (id: string, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data).then(r => r.data.data),

  delete: (id: string) =>
    api.delete(`/categories/${id}`).then(r => r.data),
}
