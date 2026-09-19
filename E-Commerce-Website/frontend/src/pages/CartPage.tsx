import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Plus, Minus, Trash2, RefreshCw } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/utils'

export function CartPage() {
  const { cart, updateItem, removeItem, clearCart, subtotal, itemCount, isLoading } = useCart()
  const { isAuthenticated } = useAuth()
  const items = cart?.items || []
  const shipping = subtotal >= 1000 ? 0 : 99
  const total = subtotal + shipping

  useEffect(() => { document.title = 'Cart — CodeAlpha Store' }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to view your cart</h2>
          <Link to="/login"><Button variant="primary" rightIcon={<ArrowRight size={16} />}>Sign In</Button></Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <h1 className="font-display font-bold text-3xl text-white mb-8">
        Shopping Cart {itemCount > 0 && <span className="text-slate-500 font-normal text-xl">({itemCount} items)</span>}
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={80} className="text-slate-700 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Discover amazing products and add them to your cart</p>
          <Link to="/shop"><Button size="lg" rightIcon={<ArrowRight size={18} />}>Continue Shopping</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="sm" onClick={clearCart} leftIcon={<Trash2 size={14} />}>Clear Cart</Button>
            </div>
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-2xl p-5 border border-white/5 flex gap-5"
              >
                <Link to={`/products/${item.product?.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-surface-700 flex-shrink-0">
                  {item.product?.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product?.slug}`} className="font-medium text-white hover:text-primary-300 transition-colors line-clamp-2">
                    {item.product?.name}
                  </Link>
                  {item.product?.category && <p className="text-xs text-primary-400 mt-0.5">{item.product.category.name}</p>}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-surface-700 rounded-xl p-1 border border-white/10">
                      <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} className="w-7 h-7 rounded-lg hover:bg-surface-600 text-white flex items-center justify-center transition-colors" aria-label="Decrease">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg hover:bg-surface-600 text-white flex items-center justify-center transition-colors" aria-label="Increase">
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">
                        {formatPrice((item.product?.discount_price ?? item.product?.price ?? 0) * item.quantity)}
                      </span>
                      <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 transition-colors" aria-label="Remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 border border-white/10 sticky top-24 space-y-4">
              <h2 className="font-semibold text-white text-lg">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400"><span>Subtotal ({itemCount} items)</span><span className="text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && <p className="text-xs text-slate-600">Add {formatPrice(1000 - subtotal)} more for free shipping</p>}
                <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span className="text-primary-400">{formatPrice(total)}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button fullWidth size="lg" rightIcon={<ArrowRight size={16} />}>Proceed to Checkout</Button>
              </Link>
              <Link to="/shop">
                <Button fullWidth variant="outline" leftIcon={<RefreshCw size={14} />}>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
