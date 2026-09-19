import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, ArrowLeft, Star, Package, Minus, Plus, Share2, Check, CheckCircle, Trash2 } from 'lucide-react'
import { productsApi } from '@/api/products'
import { reviewsApi } from '@/api/reviews'
import { Button } from '@/components/ui/Button'
import { RatingStars, InteractiveRating } from '@/components/ui/RatingStars'
import { Badge, OrderStatusBadge } from '@/components/ui/Badge'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/components/product/ProductCard'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, getDiscountPercent, formatDate } from '@/utils'
import type { Product, Review } from '@/types'
import toast from 'react-hot-toast'

export function ProductDetailPage() {
  const { id: slug } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const { user, isAuthenticated } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingCart, setIsAddingCart] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [tab, setTab] = useState<'description' | 'reviews'>('description')

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    productsApi.getProduct(slug).then(p => {
      setProduct(p)
      document.title = `${p.name} — CodeAlpha Store`
      // Fetch related products from same category
      if (p.category_id) {
        productsApi.getProducts({ category_id: p.category_id, limit: 4 })
          .then(r => setRelated(r.data.filter(x => x.id !== p.id).slice(0, 4)))
          .catch(() => {})
      }
      return reviewsApi.getReviews(p.id)
    }).then(res => {
      setReviews(res.data || [])
    }).catch(() => navigate('/shop')).finally(() => setIsLoading(false))
  }, [slug, navigate])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    if (!product) return
    setIsAddingCart(true)
    await addItem(product.id, quantity)
    setIsAddingCart(false)
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!product) return
    setIsAddingCart(true)
    await addItem(product.id, quantity)
    setIsAddingCart(false)
    navigate('/checkout')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to write a review'); return }
    if (!product) return
    setIsSubmittingReview(true)
    try {
      const review = await reviewsApi.createReview(product.id, reviewForm)
      setReviews(prev => [review, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      toast.success('Review submitted!')
    } catch (e: any) { toast.error(e.message || 'Failed to submit review') }
    finally { setIsSubmittingReview(false) }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!product || !window.confirm('Are you sure you want to delete this review?')) return
    try {
      await reviewsApi.deleteReview(product.id, reviewId)
      setReviews(prev => prev.filter(r => r.id !== reviewId))
      toast.success('Review deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete review')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (!product) return null

  const hasDiscount = !!product.discount_price
  const displayPrice = product.discount_price ?? product.price
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
  const inWishlist = isInWishlist(product.id)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          {product.category && <>
            <span>/</span>
            <Link to={`/shop?category_slug=${product.category.slug}`} className="hover:text-white transition-colors">
              {product.category.name}
            </Link>
          </>}
          <span>/</span>
          <span className="text-slate-300 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-surface-800 border border-white/10"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                    -{getDiscountPercent(product.price, product.discount_price!)}%
                  </span>
                </div>
              )}
              <button
                onClick={() => toggleItem(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center transition-colors ${inWishlist ? 'text-accent-400' : 'text-white hover:text-accent-400'}`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
              </button>
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-primary-500' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {product.category && (
                <span className="text-xs uppercase font-bold tracking-widest text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                  {product.category.name}
                </span>
              )}

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating ?? 0} size={16} />
                <span className="text-sm text-slate-400">
                  {product.rating?.toFixed(1) || '0.0'} ({product.review_count ?? 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-3xl text-white">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                <Package size={16} className={product.stock > 0 ? 'text-green-400' : 'text-red-400'} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                </span>
              </div>

              {/* Short description */}
              {product.description && (
                <p className="text-slate-400 leading-relaxed text-sm line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-300">Quantity</span>
                <div className="flex items-center glass rounded-xl border border-white/10">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  isLoading={isAddingCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  size="lg"
                  leftIcon={<ShoppingCart size={18} />}
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  variant="secondary"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mb-20">
          <div className="flex gap-2 border-b border-white/10 pb-4 mb-8">
            {(['description', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'reviews' ? `Reviews (${reviews.length})` : 'Description'}
              </button>
            ))}
          </div>

          {tab === 'description' ? (
            <div className="glass rounded-2xl p-8">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {product.description || 'No description available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review form */}
              {isAuthenticated && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Your Rating</label>
                      <InteractiveRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                    </div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={3}
                      className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 resize-none text-sm"
                    />
                    <Button type="submit" isLoading={isSubmittingReview} size="md">
                      Submit Review
                    </Button>
                  </form>
                </div>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Star size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="glass rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {review.user?.name?.[0] || '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white text-sm">{review.user?.name || 'Anonymous'}</p>
                            {review.is_verified_buyer && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                <CheckCircle size={10} /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RatingStars rating={review.rating} size={14} />
                        {user && (user.id === review.user_id || user.role === 'ADMIN') && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete review"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {review.comment && <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
