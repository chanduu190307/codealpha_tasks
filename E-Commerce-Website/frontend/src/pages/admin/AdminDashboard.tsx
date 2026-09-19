import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { adminApi } from '@/api/admin'
import type { DashboardMetrics } from '@/types'
import { formatPrice, formatShortDate, getOrderStatusColor } from '@/utils'
import { cn } from '@/utils'
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  sub?: string
}) {
  return (
    <motion.div variants={item} className="glass rounded-2xl p-6 hover:border-primary-500/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', color)}>
          <Icon size={20} className="text-white" />
        </div>
        <TrendingUp size={16} className="text-green-400 opacity-60" />
      </div>
      <p className="text-2xl font-bold text-white font-display mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl p-3 border border-white/10 text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-semibold">{formatPrice(payload[0]?.value ?? 0)}</p>
        <p className="text-slate-500">{payload[1]?.value ?? 0} orders</p>
      </div>
    )
  }
  return null
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Dashboard — Admin'
    adminApi.getDashboard()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="p-8 text-center text-slate-400">
        Failed to load dashboard metrics.
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(metrics.totalRevenue),
      icon: IndianRupee,
      color: 'bg-green-500/20 border border-green-500/30',
      sub: 'From paid orders',
    },
    {
      label: 'Total Orders',
      value: metrics.totalOrders,
      icon: ShoppingBag,
      color: 'bg-primary-500/20 border border-primary-500/30',
      sub: `${metrics.pendingOrders} pending`,
    },
    {
      label: 'Customers',
      value: metrics.totalCustomers,
      icon: Users,
      color: 'bg-accent-500/20 border border-accent-500/30',
    },
    {
      label: 'Products',
      value: metrics.totalProducts,
      icon: Package,
      color: 'bg-yellow-500/20 border border-yellow-500/30',
      sub: `${metrics.lowStock} low stock`,
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Alerts */}
      {(metrics.pendingOrders > 0 || metrics.lowStock > 0) && (
        <div className="flex flex-wrap gap-3">
          {metrics.pendingOrders > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
              <Clock size={14} />
              {metrics.pendingOrders} pending order{metrics.pendingOrders !== 1 ? 's' : ''}
            </div>
          )}
          {metrics.lowStock > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle size={14} />
              {metrics.lowStock} product{metrics.lowStock !== 1 ? 's' : ''} low on stock
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </motion.div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Revenue (7 days)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Daily sales performance</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={metrics.salesChart} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f63ff"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.recentOrders.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No orders yet</p>
            )}
            {metrics.recentOrders.map((order) => (
              <Link
                key={order.id}
                to="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/50 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {order.user?.name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatShortDate(order.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                  <p className="text-sm font-semibold text-white">{formatPrice(order.total_amount)}</p>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', getOrderStatusColor(order.status))}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
