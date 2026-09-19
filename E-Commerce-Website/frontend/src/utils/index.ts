import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number, showDecimals: boolean = false): string => {
  const num = typeof price === 'number' && !isNaN(price) ? price : 0
  const hasDecimals = num % 1 !== 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals || hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export const formatShortDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export const getDiscountPercent = (price: number, discountPrice: number): number => {
  return Math.round(((price - discountPrice) / price) * 100)
}

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const getOrderStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    PENDING:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    CONFIRMED:  'text-blue-400 bg-blue-400/10 border-blue-400/30',
    PROCESSING: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    SHIPPED:    'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    DELIVERED:  'text-green-400 bg-green-400/10 border-green-400/30',
    CANCELLED:  'text-red-400 bg-red-400/10 border-red-400/30',
  }
  return map[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30'
}

export const getPaymentStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    PENDING:  'text-yellow-400 bg-yellow-400/10',
    PAID:     'text-green-400 bg-green-400/10',
    FAILED:   'text-red-400 bg-red-400/10',
    REFUNDED: 'text-gray-400 bg-gray-400/10',
  }
  return map[status] || 'text-gray-400 bg-gray-400/10'
}
