import api from './client'
import type { ApiResponse } from '@/types'

export interface ValidatedCouponResult {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  min_order_amount: number;
}

export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    api.post<ApiResponse<ValidatedCouponResult>>('/coupons/validate', { code, subtotal }).then(r => r.data.data),
}
