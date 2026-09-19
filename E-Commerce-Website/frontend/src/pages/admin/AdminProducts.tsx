import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/api/admin'
import { categoriesApi } from '@/api/categories'
import type { Product, Category } from '@/types'
import { formatPrice, getDiscountPercent } from '@/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDebounce } from '@/hooks/useDebounce'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '',
  sku: '',
  category_id: '',
  images: '',
  featured: false,
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const debouncedSearch = useDebounce(search, 400)
  const limit = 15
  const totalPages = Math.ceil(total / limit)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const resp = await adminApi.getAllProducts(page, limit, debouncedSearch || undefined)
      setProducts(resp.data ?? [])
      setTotal(resp.pagination?.total ?? 0)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch])

  useEffect(() => {
    document.title = 'Products — Admin'
    categoriesApi.getAll().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditProduct(null)
    setForm({ ...EMPTY_FORM })
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      discount_price: p.discount_price ? String(p.discount_price) : '',
      stock: String(p.stock),
      sku: p.sku ?? '',
      category_id: p.category_id ?? '',
      images: p.images?.join(', ') ?? '',
      featured: p.featured,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await adminApi.deleteProduct(id)
      toast.success('Product deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        stock: parseInt(form.stock),
        images: form.images
          ? form.images.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      }
      if (editProduct) {
        await adminApi.updateProduct(editProduct.id, data)
        toast.success('Product updated')
      } else {
        await adminApi.createProduct(data)
        toast.success('Product created')
      }
      setShowModal(false)
      load()
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{total} total products</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={openCreate}>
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <Package size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-slate-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-4">Product</th>
                  <th className="text-left px-4 py-4 hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-4">Price</th>
                  <th className="text-right px-4 py-4 hidden sm:table-cell">Stock</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-surface-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-700 overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[160px]">{p.name}</p>
                          {p.featured && (
                            <span className="text-xs text-primary-400">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-slate-400">
                      {p.category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col items-end">
                        {p.discount_price ? (
                          <>
                            <span className="font-semibold text-white">{formatPrice(p.discount_price)}</span>
                            <span className="text-xs text-slate-500 line-through">{formatPrice(p.price)}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-white">{formatPrice(p.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right hidden sm:table-cell">
                      <span className={p.stock <= 5 ? 'text-red-400' : p.stock <= 20 ? 'text-yellow-400' : 'text-green-400'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              leftIcon={<ChevronLeft size={14} />}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              rightIcon={<ChevronRight size={14} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-8 bottom-8 z-50 max-w-2xl mx-auto glass rounded-2xl border border-white/10 overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 glass">
                <h2 className="font-semibold text-white text-lg">
                  {editProduct ? 'Edit Product' : 'New Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">Name *</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Price (₹) *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Discount Price (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.discount_price}
                      onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Stock *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">SKU</label>
                    <Input
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">Category</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                    >
                      <option value="">— No category —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Product description..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Image URLs <span className="text-slate-600">(comma-separated)</span>
                    </label>
                    <Input
                      value={form.images}
                      onChange={(e) => setForm({ ...form, images: e.target.value })}
                      placeholder="https://example.com/img1.jpg, https://..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-4 h-4 rounded accent-primary-500"
                      />
                      <span className="text-sm text-slate-300">Featured product</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={saving} className="flex-1">
                    {editProduct ? 'Save Changes' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
