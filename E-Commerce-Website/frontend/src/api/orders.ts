import api from './client'
import type { Order, ApiResponse, ShippingAddress } from '@/types'

export interface CreateOrderData {
  shipping_address: ShippingAddress
  payment_method?: string
  notes?: string
  coupon_code?: string
}

export const ordersApi = {
  createOrder: (data: CreateOrderData) =>
    api.post<ApiResponse<Order>>('/orders', data).then(r => r.data.data),

  getMyOrders: (page = 1, limit = 10) =>
    api.get<ApiResponse<Order[]>>('/orders', { params: { page, limit } }).then(r => r.data),

  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`).then(r => r.data.data),

  cancelOrder: (id: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`).then(r => r.data.data),
}
