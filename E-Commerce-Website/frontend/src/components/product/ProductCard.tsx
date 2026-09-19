import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Eye, Star, Check } from 'lucide-react'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, getDiscountPercent, cn } from '@/utils'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const { isAuthenticated } = useAuth()
  const shouldReduce = useReducedMotion()

  const [imgLoaded, setImgLoaded] = useState(false)
  const [isAddingCart, setIsAddingCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 3D tilt — only when motion is OK
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], shouldReduce ? [0, 0] : [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], shouldReduce ? [0, 0] : [-6, 6]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    if (isAddingCart || justAdded) return
    setIsAddingCart(true)
    await addItem(product.id)
    setIsAddingCart(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to use wishlist'); return }
    if (isTogglingWishlist) return
    setIsTogglingWishlist(true)
    await toggleItem(product.id)
    setIsTogglingWishlist(false)
  }

  const inWishlist = isInWishlist(product.id)
  const hasDiscount = !!product.discount_price
  const displayPrice = product.discount_price ?? product.price
  const discountPct = hasDiscount ? getDiscountPercent(product.price, product.discount_price!) : 0
  const mainImage = product.images?.[0] || `https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop`

  return (
    // NOTE: No initial/animate here — parent StaggerList/stagger wrapper handles entrance
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: shouldReduce ? 1 : 1.01 }}
      className={cn('group relative', className)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative bg-surface-800 rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all duration-300 shadow-xl hover:shadow-primary-500/10 hover:shadow-2xl">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-surface-700">
            {!imgLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <motion.img
              src={mainImage}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className={cn(
                'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
                !imgLoaded && 'opacity-0'
              )}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {hasDiscount && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg"
                >
                  -{discountPct}%
                </motion.span>
              )}
              {product.featured && (
                <span className="bg-primary-500/80 text-white text-xs font-medium px-2 py-0.5 rounded-lg backdrop-blur-sm">
                  Featured
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-red-500/80 text-white text-xs font-medium px-2 py-0.5 rounded-lg">
                  Sold Out
                </span>
              )}
            </div>

            {/* Action buttons — slide in from right on hover */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              {/* Wishlist button with heart animation */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                disabled={isTogglingWishlist}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center glass border border-white/20 transition-colors',
                  inWishlist ? 'text-accent-400' : 'text-white hover:text-accent-400'
                )}
                aria-label="Toggle wishlist"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={inWishlist ? 'filled' : 'empty'}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Heart size={14} className={inWishlist ? 'fill-current' : ''} />
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={e => { e.preventDefault(); navigate(`/products/${product.slug}`) }}
                className="w-8 h-8 rounded-full flex items-center justify-center glass border border-white/20 text-white hover:text-primary-300 transition-colors"
                aria-label="Quick view"
              >
                <Eye size={14} />
              </motion.button>
            </div>

            {/* Quick add to cart — slides up from bottom on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingCart}
                whileTap={product.stock > 0 && !isAddingCart ? { scale: 0.97 } : {}}
                className={cn(
                  'w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200',
                  product.stock === 0
                    ? 'bg-surface-600 text-slate-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-primary-500 hover:bg-primary-400 text-white'
                )}
                aria-label="Add to cart"
              >
                <AnimatePresence mode="wait">
                  {isAddingCart ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"
                    />
                  ) : justAdded ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Check size={14} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ShoppingCart size={14} />
                    </motion.span>
                  )}
                </AnimatePresence>
                {product.stock === 0 ? 'Out of Stock' : justAdded ? 'Added!' : 'Add to Cart'}
              </motion.button>
            </div>
          </div>

          {/* Product info */}
          <div className="p-4">
            {product.category && (
              <p className="text-xs text-primary-400 font-medium mb-1 uppercase tracking-wide">
                {product.category.name}
              </p>
            )}
            <h3 className="text-white font-medium leading-snug mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={11}
                    className={s <= Math.round(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600 fill-slate-700'}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({product.review_count})</span>
            </div>

            {/* Price — animate when discount exists */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{formatPrice(displayPrice)}</span>
              {hasDiscount && (
                <span className="text-sm text-slate-500 line-through">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
