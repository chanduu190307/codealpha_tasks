import api from './client'
import type { Product, ApiResponse, ProductFilters } from '@/types'

export const productsApi = {
  getProducts: (filters: ProductFilters = {}) =>
    api.get<ApiResponse<Product[]>>('/products', { params: filters }).then(r => r.data),

  getProduct: (idOrSlug: string) =>
    api.get<ApiResponse<Product>>(`/products/${idOrSlug}`).then(r => r.data.data),

  createProduct: (data: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/products', data).then(r => r.data.data),

  updateProduct: (id: string, data: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data).then(r => r.data.data),

  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`).then(r => r.data),
}
