import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShoppingBag, Star, Truck, Shield, RefreshCw, Headphones, Zap } from 'lucide-react'
import { productsApi } from '@/api/products'
import { categoriesApi } from '@/api/categories'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import type { Product, Category } from '@/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
}

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    document.title = 'E-commerce Store — Shop Premium Products'
    Promise.all([
      productsApi.getProducts({ featured: true, limit: 8 }),
      productsApi.getProducts({ sort: 'newest', limit: 8 }),
      categoriesApi.getAll(),
    ]).then(([featured, newest, cats]) => {
      setFeaturedProducts(featured.data || [])
      setNewArrivals(newest.data || [])
      setCategories(cats || [])
    }).finally(() => setIsLoading(false))
  }, [])

  const benefits = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹1,000' },
    { icon: Shield, title: 'Secure Payment', desc: 'Protected transactions' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
  ]

  return (
    <div className="min-h-screen">
      {/* ── HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/8 rounded-full blur-3xl" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-300 text-sm font-medium mb-8">
              <Zap size={14} className="text-primary-400" />
              Premium Shopping Experience
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display font-black text-5xl sm:text-6xl lg:text-8xl text-white leading-none mb-6"
          >
            Shop the
            <span className="block gradient-text">Future Today</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            Discover premium products curated for the modern lifestyle. Electronics, fashion, home, and more — all in one destination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/shop">
              <Button size="xl" variant="primary" rightIcon={<ArrowRight size={20} />}>
                Shop Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="xl" variant="outline">
                Browse Categories
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center justify-center gap-8 sm:gap-16 mt-16"
          >
            {[
              { value: '25+', label: 'Products' },
              { value: '6', label: 'Categories' },
              { value: '100%', label: 'Secure' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-3xl sm:text-4xl gradient-text">{stat.value}</p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-primary-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── CATEGORIES */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-slate-400">Find exactly what you're looking for</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))
            : categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/shop?category_slug=${cat.slug}`}
                    className="group block relative overflow-hidden rounded-2xl aspect-square bg-surface-800 border border-white/5 hover:border-primary-500/30 transition-all duration-300"
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-semibold text-center group-hover:text-primary-300 transition-colors">
                        {cat.name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-slate-400">Handpicked premium selections</p>
          </div>
          <Link to="/shop?featured=true">
            <Button variant="outline" rightIcon={<ArrowRight size={16} />}>View All</Button>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isLoading
            ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : featuredProducts.slice(0, 4).map(p => (
                <motion.div key={p.id} variants={itemVariants}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
        </motion.div>
      </section>

      {/* ── PROMO BANNER */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(79,99,255,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(79,99,255,0.15) 100%)',
            border: '1px solid rgba(79,99,255,0.3)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <span className="inline-block bg-accent-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              🎉 Limited Time Offer
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4">
              Free Shipping on Orders <span className="gradient-text">Over ₹1,000</span>
            </h2>
            <p className="text-slate-300 mb-8 text-lg">Shop premium products with confidence. No minimum order on featured items.</p>
            <Link to="/shop">
              <Button size="xl" variant="secondary" leftIcon={<ShoppingBag size={20} />}>
                Start Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── NEW ARRIVALS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
              New <span className="gradient-text">Arrivals</span>
            </h2>
            <p className="text-slate-400">Fresh from our collection</p>
          </div>
          <Link to="/shop?sort=newest">
            <Button variant="outline" rightIcon={<ArrowRight size={16} />}>View All</Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : newArrivals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── BENEFITS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center group hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/25 transition-colors">
                <Icon size={22} className="text-primary-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
