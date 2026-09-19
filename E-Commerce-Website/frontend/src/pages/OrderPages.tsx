import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowLeft, MapPin, Calendar, X } from 'lucide-react'
import { ordersApi } from '@/api/orders'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { OrderCardSkeleton } from '@/components/ui/Skeleton'
import { formatPrice, formatDate, formatShortDate } from '@/utils'
import type { Order } from '@/types'
import toast from 'react-hot-toast'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    document.title = 'My Orders — CodeAlpha Store'
    setIsLoading(true)
    ordersApi.getMyOrders(page).then(res => {
      setOrders(res.data || [])
      setTotal(res.pagination?.total || 0)
    }).finally(() => setIsLoading(false))
  }, [page])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Package size={28} className="text-primary-400" />
        <div>
          <h1 className="font-display font-bold text-3xl text-white">My Orders</h1>
          <p className="text-slate-400 mt-1">{total} orders total</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={80} className="text-slate-700 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-8">Start shopping to see your orders here</p>
          <Link to="/shop"><Button size="lg">Browse Products</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to={`/orders/${order.id}`}>
                <div className="glass rounded-2xl p-6 border border-white/5 hover:border-primary-500/30 transition-all duration-200 group">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Order ID</p>
                      <p className="font-mono font-medium text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.payment_status} />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatShortDate(order.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Package size={13} /> {order.items?.length || 0} items</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} /> {order.shipping_address?.city}, {order.shipping_address?.country}</span>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-2 mb-4">
                    {order.items?.slice(0, 4).map(item => item.image && (
                      <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden bg-surface-700">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {(order.items?.length || 0) > 4 && (
                      <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center text-xs text-slate-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-primary-400">{formatPrice(order.total_amount)}</span>
                    <span className="text-sm text-primary-300 group-hover:text-primary-200 transition-colors">View Details →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    ordersApi.getOrder(id).then(o => {
      setOrder(o)
      document.title = `Order #${o.id.slice(0, 8).toUpperCase()} — CodeAlpha Store`
    }).finally(() => setIsLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!order) return
    setIsCancelling(true)
    try {
      const updated = await ordersApi.cancelOrder(order.id)
      setOrder(updated)
      toast.success('Order cancelled')
    } catch (e: any) { toast.error(e.message || 'Failed to cancel order') }
    finally { setIsCancelling(false) }
  }

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!order) return null

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-slate-400 mt-1">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl overflow-hidden border border-white/5">
            <div className="p-5 border-b border-white/10">
              <h2 className="font-semibold text-white">Items ({order.items?.length})</h2>
            </div>
            <div className="divide-y divide-white/5">
              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  {item.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-700 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{item.name}</p>
                    <p className="text-sm text-slate-500">×{item.quantity} @ {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-primary-400" /> Shipping Address
            </h2>
            <div className="text-sm text-slate-300 space-y-1">
              <p className="font-medium text-white">{order.shipping_address?.name}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}{order.shipping_address?.state ? `, ${order.shipping_address.state}` : ''} {order.shipping_address?.zip}</p>
              <p>{order.shipping_address?.country}</p>
              {order.shipping_address?.phone && <p>{order.shipping_address.phone}</p>}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(order.subtotal ?? order.total_amount)}</span>
              </div>
              {order.discount_amount ? (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className={order.shipping_amount === 0 ? 'text-green-400 font-medium' : 'text-white'}>
                  {order.shipping_amount === 0 ? 'Free' : formatPrice(order.shipping_amount ?? 99)}
                </span>
              </div>
              {order.tax_amount ? (
                <div className="flex justify-between text-slate-400">
                  <span>Tax (8%)</span>
                  <span className="text-white">{formatPrice(order.tax_amount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-400">
                <span>Payment</span>
                <span className="text-white">{order.payment_method}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-primary-400">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {canCancel && (
            <Button
              fullWidth
              variant="danger"
              onClick={handleCancel}
              isLoading={isCancelling}
              leftIcon={<X size={16} />}
            >
              Cancel Order
            </Button>
          )}

          {order.notes && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <p className="text-xs text-slate-500 mb-1">Order Notes</p>
              <p className="text-sm text-slate-300">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
