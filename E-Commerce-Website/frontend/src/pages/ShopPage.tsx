import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react'
import { productsApi } from '@/api/products'
import { categoriesApi } from '@/api/categories'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import type { Product, Category, ProductFilters } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  // Filter state — initialised from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [categorySlug, setCategorySlug] = useState(searchParams.get('category_slug') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === 'true')
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true' ? true : undefined as boolean | undefined)

  const debouncedSearch = useDebounce(search, 400)
  const limit = 12
  const totalPages = Math.ceil(total / limit)

  // Sync filter state → URL params whenever they change
  useEffect(() => {
    const params: Record<string, string> = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (sort && sort !== 'newest') params.sort = sort
    if (categorySlug) params.category_slug = categorySlug
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    if (inStockOnly) params.in_stock = 'true'
    if (featured) params.featured = 'true'
    if (page > 1) params.page = String(page)
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, sort, categorySlug, minPrice, maxPrice, inStockOnly, featured, page, setSearchParams])

  useEffect(() => {
    document.title = 'Shop — CodeAlpha Store'
    categoriesApi.getAll().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    const filters: ProductFilters = {
      page, limit,
      search: debouncedSearch || undefined,
      sort: sort as ProductFilters['sort'],
      category_slug: categorySlug || undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      in_stock: inStockOnly || undefined,
      featured,
    }
    setIsLoading(true)
    productsApi.getProducts(filters)
      .then(res => { setProducts(res.data || []); setTotal(res.pagination?.total || 0) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [debouncedSearch, sort, categorySlug, minPrice, maxPrice, inStockOnly, featured, page])

  const clearFilters = useCallback(() => {
    setSearch(''); setSort('newest'); setCategorySlug('')
    setMinPrice(''); setMaxPrice(''); setInStockOnly(false); setFeatured(undefined)
    setPage(1)
  }, [])

  const hasActiveFilters = !!(search || categorySlug || minPrice || maxPrice || inStockOnly || featured)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
          {featured ? '✨ Featured Products' : categorySlug ? `Category: ${categorySlug.replace(/-/g, ' ')}` : 'All Products'}
        </h1>
        <p className="text-slate-400">{total > 0 ? `${total} products found` : ''}</p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products..."
            className="w-full bg-surface-800 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="appearance-none bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 pr-8 text-sm text-white focus:outline-none focus:border-primary-500/50 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-surface-800">{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {/* Filters toggle */}
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<SlidersHorizontal size={16} />}
        >
          Filters {hasActiveFilters && '•'}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X size={14} />}>
            Clear
          </Button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Category</label>
                <select
                  value={categorySlug}
                  onChange={e => { setCategorySlug(e.target.value); setPage(1) }}
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="" className="bg-surface-800">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.slug} className="bg-surface-800">{c.name}</option>)}
                </select>
              </div>

              {/* Price range */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => { setMinPrice(e.target.value); setPage(1) }}
                  placeholder="₹0"
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(e.target.value); setPage(1) }}
                  placeholder="₹99999"
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                />
              </div>

              {/* Stock + Featured */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => { setInStockOnly(e.target.checked); setPage(1) }}
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-sm text-slate-300">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured === true}
                    onChange={e => { setFeatured(e.target.checked ? true : undefined); setPage(1) }}
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-sm text-slate-300">Featured Only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products grid */}
      {isLoading ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array(limit).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
        </motion.div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <Search size={64} className="text-slate-700 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
          <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map(p => (
              <motion.div key={p.id} variants={cardVariants}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-12"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        pageNum === page
                          ? 'bg-primary-500 text-white scale-110'
                          : 'bg-surface-800 text-slate-400 hover:text-white hover:bg-surface-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
