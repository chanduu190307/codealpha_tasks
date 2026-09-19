'use strict';
import api from './client'
import type { DashboardMetrics, Order, User, Product, Category, Coupon, AuditLog, ApiResponse } from '@/types'

export const adminApi = {
  getDashboard: () =>
    api.get<ApiResponse<DashboardMetrics>>('/admin/dashboard').then(r => r.data.data),

  // Orders
  getAllOrders: (page = 1, limit = 20, status?: string) =>
    api.get<ApiResponse<Order[]>>('/admin/orders', { params: { page, limit, status } }).then(r => r.data),

  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/admin/orders/${id}`).then(r => r.data.data),

  updateOrderStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }).then(r => r.data.data),

  refundOrder: (id: string, reason?: string) =>
    api.post<ApiResponse<Order>>(`/admin/orders/${id}/refund`, { reason }).then(r => r.data.data),

  // Customers
  getAllCustomers: (page = 1, limit = 20) =>
    api.get<ApiResponse<User[]>>('/admin/customers', { params: { page, limit } }).then(r => r.data),

  updateCustomerStatus: (id: string, is_active: boolean) =>
    api.patch<ApiResponse<User>>(`/admin/customers/${id}/status`, { is_active }).then(r => r.data.data),

  // Coupons
  getAllCoupons: (page = 1, limit = 20) =>
    api.get<ApiResponse<Coupon[]>>('/admin/coupons', { params: { page, limit } }).then(r => r.data),

  createCoupon: (data: Partial<Coupon>) =>
    api.post<ApiResponse<Coupon>>('/admin/coupons', data).then(r => r.data.data),

  updateCoupon: (id: string, data: Partial<Coupon>) =>
    api.put<ApiResponse<Coupon>>(`/admin/coupons/${id}`, data).then(r => r.data.data),

  deleteCoupon: (id: string) =>
    api.delete(`/admin/coupons/${id}`).then(r => r.data),

  // Audit Logs
  getAuditLogs: (page = 1, limit = 50) =>
    api.get<ApiResponse<AuditLog[]>>('/admin/audit-logs', { params: { page, limit } }).then(r => r.data),

  // Products
  getAllProducts: (page = 1, limit = 20, search?: string) =>
    api.get<ApiResponse<Product[]>>('/admin/products', { params: { page, limit, search } }).then(r => r.data),

  createProduct: (data: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/admin/products', data).then(r => r.data.data),

  updateProduct: (id: string, data: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/admin/products/${id}`, data).then(r => r.data.data),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then(r => r.data),

  // Categories
  getAllCategories: () =>
    api.get<ApiResponse<Category[]>>('/admin/categories').then(r => r.data.data),

  createCategory: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/admin/categories', data).then(r => r.data.data),

  updateCategory: (id: string, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data).then(r => r.data.data),

  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}`).then(r => r.data),
}
