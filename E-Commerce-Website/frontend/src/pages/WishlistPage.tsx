import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/utils'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function WishlistPage() {
  const { wishlist, isLoading, removeItem, toggleItem } = useWishlist()
  const { addItem: addToCart } = useCart()

  document.title = 'My Wishlist — E-commerce Store'

  const items = wishlist?.items ?? []

  const handleMoveToCart = async (productId: string) => {
    await addToCart(productId, 1)
    await removeItem(productId)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white flex items-center gap-3">
            <Heart className="text-accent-500 fill-accent-500" size={28} />
            My Wishlist
          </h1>
          <p className="text-slate-400 mt-1">
            {isLoading ? 'Loading...' : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-accent-500/10 flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-accent-500/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Discover Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Move All to Cart */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-400">{items.length} saved items</p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ShoppingCart size={14} />}
                onClick={() => items.forEach(item => handleMoveToCart(item.product_id))}
              >
                Move All to Cart
              </Button>
            </div>

            {/* Product grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {items.map(item => (
                <motion.div key={item.id} variants={itemVariants} className="relative group">
                  {item.product ? (
                    <ProductCard product={item.product} />
                  ) : (
                    <div className="glass rounded-2xl p-4 border border-white/5">
                      <div className="skeleton aspect-square rounded-xl mb-3" />
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-5 w-1/2 rounded" />
                      </div>
                    </div>
                  )}
                  {/* Quick remove */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-900/80 backdrop-blur-sm flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
