import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Grid3X3, ChevronRight, Tag, ArrowLeft, Package, Search } from 'lucide-react'
import { categoriesApi } from '@/api/categories'
import { productsApi } from '@/api/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import type { Category, Product } from '@/types'

// Category icon mapping by slug keyword
const CATEGORY_ICONS: Record<string, string> = {
  electronics: '💻',
  fashion: '👗',
  'home-living': '🏠',
  'sports-fitness': '🏋️',
  books: '📚',
  'beauty-health': '✨',
  gaming: '🎮',
  automotive: '🚗',
  toys: '🧸',
  grocery: '🛒',
  travel: '✈️',
  jewelry: '💎',
  default: '🏷️',
}

const getCategoryIcon = (slug: string) => {
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (slug.includes(key)) return CATEGORY_ICONS[key]
  }
  return CATEGORY_ICONS.default
}

const CATEGORY_GRADIENTS = [
  'from-blue-500/20 to-primary-500/20',
  'from-pink-500/20 to-accent-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-orange-500/20 to-amber-500/20',
  'from-purple-500/20 to-indigo-500/20',
  'from-cyan-500/20 to-sky-500/20',
  'from-rose-500/20 to-pink-500/20',
  'from-lime-500/20 to-green-500/20',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

// ─── CATEGORIES LIST PAGE ───────────────────────────────────────────────────
export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Categories — E-commerce Store'
    categoriesApi.getAll()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden animated-gradient">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto pt-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary-500/30 text-primary-300 text-sm font-medium mb-6">
            <Grid3X3 size={14} />
            All Categories
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-4">
            Browse by <span className="gradient-text">Category</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Explore our wide selection of products across {isLoading ? '...' : categories.length} categories.
          </p>
        </motion.div>
      </section>

      {/* Category Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No categories yet</h2>
            <p className="text-slate-400 mb-6">Categories will appear here once added.</p>
            <Link to="/shop">
              <Button variant="primary">Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {categories.map((cat, i) => (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  to={`/categories/${cat.slug}`}
                  className="group block glass rounded-2xl overflow-hidden hover:border-primary-500/30 border border-white/5 transition-all duration-300 card-hover"
                >
                  {/* Image or gradient */}
                  <div className="relative h-40 overflow-hidden">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length]}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/30 to-transparent" />
                    <div className="absolute top-4 left-4 text-3xl">
                      {getCategoryIcon(cat.slug)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-lg group-hover:text-primary-300 transition-colors">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}

// ─── SINGLE CATEGORY PAGE ────────────────────────────────────────────────────
export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoadingCat, setIsLoadingCat] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const limit = 16

  useEffect(() => {
    if (!slug) return
    setIsLoadingCat(true)
    categoriesApi.getAll()
      .then(cats => {
        const found = cats.find(c => c.slug === slug)
        if (!found) {
          setNotFound(true)
        } else {
          setCategory(found)
          document.title = `${found.name} — E-commerce Store`
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoadingCat(false))
  }, [slug])

  useEffect(() => {
    if (!slug) return
    setIsLoadingProducts(true)
    productsApi.getProducts({ category_slug: slug, page, limit })
      .then(res => {
        setProducts(res.data || [])
        setTotal(res.pagination?.total ?? (res as any).total ?? 0)
      })
      .catch(console.error)
      .finally(() => setIsLoadingProducts(false))
  }, [slug, page])

  if (!isLoadingCat && notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        <Tag size={64} className="text-slate-700 mb-6" />
        <h1 className="font-display font-bold text-3xl text-white mb-3">Category not found</h1>
        <p className="text-slate-400 mb-8">
          The category "<span className="text-white">{slug}</span>" doesn't exist.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />}>
            Go Back
          </Button>
          <Link to="/categories">
            <Button variant="primary">All Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden animated-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/8 rounded-full blur-3xl" />
          {category?.image && (
            <img
              src={category.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
          )}
        </div>
        <div className="relative max-w-7xl mx-auto pt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <ChevronRight size={14} />
            <span className="text-white">{isLoadingCat ? '...' : category?.name}</span>
          </div>

          {isLoadingCat ? (
            <div className="space-y-3">
              <div className="skeleton h-10 w-64 rounded-xl" />
              <div className="skeleton h-5 w-96 rounded-lg" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{getCategoryIcon(slug || '')}</div>
                <div>
                  <h1 className="font-display font-black text-4xl sm:text-5xl text-white">
                    {category?.name}
                  </h1>
                  {category?.description && (
                    <p className="text-slate-400 mt-2 text-lg">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  {total} {total === 1 ? 'product' : 'products'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(limit).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No products yet</h2>
            <p className="text-slate-400 mb-6">This category doesn't have any products yet.</p>
            <Link to="/shop">
              <Button variant="primary" leftIcon={<Search size={16} />}>Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {products.map(p => (
                <motion.div key={p.id} variants={itemVariants}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? 'bg-primary-500 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-surface-700'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
