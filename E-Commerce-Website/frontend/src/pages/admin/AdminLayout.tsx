import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Users,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
  Percent,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Percent },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        'flex flex-col h-full',
        mobile ? 'p-4' : 'p-6'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center shadow-lg glow-primary">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm">CodeAlpha</p>
          <p className="text-xs text-primary-400 font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-surface-700/60'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                {label}
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-primary-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-300 text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 glass border-r border-white/8">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/8 z-50 lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700"
                >
                  <X size={18} />
                </button>
              </div>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-white/8 glass flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">Admin Panel</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
