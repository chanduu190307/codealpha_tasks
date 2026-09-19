import api from './client'
import type { Cart, ApiResponse } from '@/types'

export const cartApi = {
  getCart: () =>
    api.get<ApiResponse<Cart>>('/cart').then(r => r.data.data),

  addItem: (product_id: string, quantity = 1) =>
    api.post<ApiResponse<Cart>>('/cart/items', { product_id, quantity }).then(r => r.data.data),

  updateItem: (item_id: string, quantity: number) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${item_id}`, { quantity }).then(r => r.data.data),

  removeItem: (item_id: string) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${item_id}`).then(r => r.data.data),

  clearCart: () =>
    api.delete('/cart').then(r => r.data),
}
