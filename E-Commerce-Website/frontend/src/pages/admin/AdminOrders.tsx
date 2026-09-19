import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/api/admin'
import type { Order, OrderStatus } from '@/types'
import { formatPrice, formatShortDate, getOrderStatusColor, getPaymentStatusColor } from '@/utils'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED',
]

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [refundingId, setRefundingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const limit = 15
  const totalPages = Math.ceil(total / limit)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const resp = await adminApi.getAllOrders(page, limit, statusFilter || undefined)
      setOrders(resp.data ?? [])
      setTotal(resp.pagination?.total ?? 0)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    document.title = 'Orders — Admin'
    load()
  }, [load])

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const updated = await adminApi.updateOrderStatus(id, status)
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
      toast.success(`Order status → ${status}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRefund = async (id: string) => {
    const reason = window.prompt('Enter reason for issuing this refund:')
    if (reason === null) return
    setRefundingId(id)
    try {
      const updated = await adminApi.refundOrder(id, reason.trim() || 'Admin refund')
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
      toast.success('Order refunded successfully and stock restored')
    } catch (err: any) {
      toast.error(err.message || 'Failed to refund order')
    } finally {
      setRefundingId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">{total} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['', ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              statusFilter === s
                ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            )}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-slate-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-4">Order</th>
                  <th className="text-left px-4 py-4 hidden md:table-cell">Customer</th>
                  <th className="text-right px-4 py-4">Total</th>
                  <th className="text-center px-4 py-4 hidden sm:table-cell">Payment</th>
                  <th className="text-center px-4 py-4">Status</th>
                  <th className="text-center px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <>
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-surface-700/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-mono text-xs text-primary-400">#{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{formatShortDate(order.created_at)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div>
                          <p className="text-white font-medium">{order.user?.name ?? '—'}</p>
                          <p className="text-xs text-slate-500">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-white">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', getPaymentStatusColor(order.payment_status))}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={cn(
                            'text-xs px-2 py-1 rounded-lg border cursor-pointer bg-surface-800 transition-colors focus:outline-none',
                            getOrderStatusColor(order.status)
                          )}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
                        >
                          <ChevronDown
                            size={15}
                            className={cn('transition-transform', expandedId === order.id && 'rotate-180')}
                          />
                        </button>
                      </td>
                    </motion.tr>

                    {/* Expanded order items */}
                    {expandedId === order.id && (
                      <tr key={`${order.id}-expanded`}>
                        <td colSpan={6} className="px-6 pb-4">
                          <div className="bg-surface-800/60 rounded-xl p-4 space-y-3">
                            <p className="text-xs font-medium text-slate-400 mb-2">Order Items</p>
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                                  )}
                                  <span className="text-slate-300">{item.name}</span>
                                  <span className="text-slate-500">× {item.quantity}</span>
                                </div>
                                <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}

                            {/* Cost breakdown */}
                            <div className="pt-2 border-t border-white/10 space-y-1 text-xs text-slate-400">
                              {order.subtotal !== undefined && (
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span className="text-slate-300">{formatPrice(order.subtotal)}</span>
                                </div>
                              )}
                              {Boolean(order.discount_amount && order.discount_amount > 0) && (
                                <div className="flex justify-between text-emerald-400">
                                  <span>Discount ({order.coupon_code || 'Coupon'}):</span>
                                  <span>-{formatPrice(order.discount_amount!)}</span>
                                </div>
                              )}
                              {order.shipping_amount !== undefined && (
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span className="text-slate-300">
                                    {order.shipping_amount === 0 ? 'FREE' : formatPrice(order.shipping_amount)}
                                  </span>
                                </div>
                              )}
                              {order.tax_amount !== undefined && (
                                <div className="flex justify-between">
                                  <span>Estimated Tax (8%):</span>
                                  <span className="text-slate-300">{formatPrice(order.tax_amount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-1 font-semibold text-white text-sm">
                                <span>Total:</span>
                                <span>{formatPrice(order.total_amount)}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/10 flex justify-between text-sm items-center">
                              <div>
                                <span className="text-slate-400 text-xs">Shipping Address: </span>
                                <span className="text-slate-300 text-xs">
                                  {order.shipping_address?.address}, {order.shipping_address?.city}, {order.shipping_address?.country}
                                </span>
                              </div>

                              {/* Refund button */}
                              {order.payment_status === 'PAID' && order.status !== 'CANCELLED' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  isLoading={refundingId === order.id}
                                  onClick={() => handleRefund(order.id)}
                                >
                                  Refund Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              leftIcon={<ChevronLeft size={14} />}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              rightIcon={<ChevronRight size={14} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
