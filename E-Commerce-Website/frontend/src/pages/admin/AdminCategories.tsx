import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Tag, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/api/admin'
import type { Category } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const EMPTY_FORM = { name: '', slug: '', description: '', image: '' }

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getAllCategories()
      setCategories(data ?? [])
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Categories — Admin'
    load()
  }, [])

  const openCreate = () => {
    setEditCat(null)
    setForm({ ...EMPTY_FORM })
    setShowModal(true)
  }

  const openEdit = (c: Category) => {
    setEditCat(c)
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      image: c.image ?? '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await adminApi.deleteCategory(id)
      toast.success('Category deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editCat) {
        await adminApi.updateCategory(editCat.id, form)
        toast.success('Category updated')
      } else {
        await adminApi.createCategory(form)
        toast.success('Category created')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={openCreate}>
          Add Category
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Tag size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-36 bg-surface-700">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag size={32} className="text-slate-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent" />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">/{cat.slug}</p>
                    {cat.description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
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
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto glass rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  {editCat ? 'Edit Category' : 'New Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Name *</label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setForm((f) => ({
                        ...f,
                        name,
                        slug: editCat ? f.slug : slugify(name),
                      }))
                    }}
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Slug *</label>
                  <Input
                    required
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="category-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short description..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Image URL</label>
                  <Input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={saving} className="flex-1">
                    {editCat ? 'Save' : 'Create'}
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
