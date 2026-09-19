import api from './client'
import type { Review, ApiResponse } from '@/types'

export const reviewsApi = {
  getReviews: (productId: string, page = 1, limit = 10) =>
    api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`, { params: { page, limit } }).then(r => r.data),

  createReview: (productId: string, data: { rating: number; comment?: string }) =>
    api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, data).then(r => r.data.data),

  updateReview: (productId: string, reviewId: string, data: { rating?: number; comment?: string }) =>
    api.put<ApiResponse<Review>>(`/products/${productId}/reviews/${reviewId}`, data).then(r => r.data.data),

  deleteReview: (productId: string, reviewId: string) =>
    api.delete(`/products/${productId}/reviews/${reviewId}`).then(r => r.data),
}
