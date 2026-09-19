import api from './client'
import type { Wishlist, ApiResponse } from '@/types'

export const wishlistApi = {
  getWishlist: () =>
    api.get<ApiResponse<Wishlist>>('/wishlist').then(r => r.data.data),

  addItem: (product_id: string) =>
    api.post<ApiResponse<Wishlist>>('/wishlist', { product_id }).then(r => r.data.data),

  removeItem: (product_id: string) =>
    api.delete<ApiResponse<Wishlist>>(`/wishlist/${product_id}`).then(r => r.data.data),
}
