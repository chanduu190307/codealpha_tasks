import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, User, Menu, X, Search, ShoppingBag, LogOut, Settings, Package } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn } from '@/utils'

export function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { itemCount, openCart } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/shop', label: 'Shop' },
    { to: '/categories', label: 'Categories' },
  ]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
      isScrolled ? 'glass border-b border-white/10 shadow-2xl shadow-black/20' : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center shadow-md">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white hidden sm:block">
            E-commerce<span className="gradient-text">Store</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) => cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-primary-300 bg-primary-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden lg:flex">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Wishlist */}
          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {itemCount > 9 ? '9+' : itemCount}
              </motion.span>
            )}
          </button>

          {/* User menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 shadow-2xl z-20 py-1"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                        <User size={15} /> My Account
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                        <Package size={15} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-300 hover:text-primary-200 hover:bg-primary-500/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-500/90 hover:bg-primary-400 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50"
                  />
                </div>
              </form>
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive ? 'text-primary-300 bg-primary-500/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-500/90 hover:bg-primary-400 text-center transition-colors mt-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
