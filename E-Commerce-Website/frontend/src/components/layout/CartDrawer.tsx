import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils'

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, subtotal, itemCount } = useCart()
  const items = cart?.items || []
  const shipping = subtotal >= 1000 ? 0 : 99
  const total = subtotal + shipping

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary-400" />
                <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full py-16 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ShoppingBag size={64} className="text-slate-700 mb-4" />
                    </motion.div>
                    <p className="text-slate-400 font-medium mb-2">Your cart is empty</p>
                    <p className="text-sm text-slate-600 mb-6">Add some items to get started!</p>
                    <Link
                      to="/shop"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 text-sm font-medium transition-colors"
                    >
                      Continue Shopping <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-3 bg-surface-700/50 rounded-xl p-3 border border-white/5"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-600">
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.product?.name}</p>
                        <p className="text-sm text-primary-400 font-semibold mt-0.5">
                          {formatPrice((item.product?.discount_price ?? item.product?.price ?? 0) * item.quantity)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                            className="w-6 h-6 rounded-md bg-surface-600 hover:bg-surface-500 text-slate-300 flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm text-white font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-surface-600 hover:bg-surface-500 text-slate-300 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors p-1 self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-slate-600">Free shipping on orders over ₹1,000</p>
                  )}
                  <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-primary-400">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold text-sm transition-colors"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl border border-white/20 text-white hover:bg-white/10 font-medium text-sm transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
