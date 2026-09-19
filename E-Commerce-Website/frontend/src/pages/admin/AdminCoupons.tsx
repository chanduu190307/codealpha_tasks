import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Percent, IndianRupee, Calendar, RefreshCw } from 'lucide-react'
import { adminApi } from '@/api/admin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatPrice } from '@/utils'
import type { Coupon } from '@/types'
import toast from 'react-hot-toast'

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [minOrder, setMinOrder] = useState('0')
  const [maxDiscount, setMaxDiscount] = useState('')
  const [usageLimit, setUsageLimit] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const loadCoupons = async () => {
    setIsLoading(true)
    try {
      const res = await adminApi.getAllCoupons(1, 50)
      setCoupons(res.data || [])
    } catch (err: any) {
      toast.error(err.message || 'Failed to load coupons')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Coupons — Admin'
    loadCoupons()
  }, [])

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !discountValue) {
      toast.error('Please fill in required fields')
      return
    }

    setIsSubmitting(true)
    try {
      await adminApi.createCoupon({
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        min_order_amount: parseFloat(minOrder || '0'),
        max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
        usage_limit: usageLimit ? parseInt(usageLimit, 10) : null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        is_active: true,
      })
      toast.success('Coupon created successfully!')
      setIsModalOpen(false)
      // Reset form
      setCode('')
      setDiscountValue('')
      setMinOrder('0')
      setMaxDiscount('')
      setUsageLimit('')
      setExpiresAt('')
      await loadCoupons()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create coupon')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await adminApi.updateCoupon(coupon.id, { is_active: !coupon.is_active })
      toast.success(`Coupon ${coupon.is_active ? 'deactivated' : 'activated'}`)
      await loadCoupons()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update coupon')
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    try {
      await adminApi.deleteCoupon(id)
      toast.success('Coupon deleted')
      await loadCoupons()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete coupon')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Coupons & Promotions</h1>
          <p className="text-slate-400 text-sm">Manage discount codes, usage limits, and active promotions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadCoupons} leftIcon={<RefreshCw size={14} />}>
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={16} />}>
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-surface-800/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No coupons found. Click "Create Coupon" to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white flex items-center gap-2">
                      <Tag size={14} className="text-primary-400" />
                      {c.code}
                    </td>
                    <td className="px-6 py-4">
                      {c.discount_type === 'percentage' ? (
                        <span className="text-amber-400 font-medium">{c.discount_value}% OFF</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">{formatPrice(c.discount_value)} OFF</span>
                      )}
                      {c.max_discount && <span className="text-xs text-slate-500 ml-1">(max {formatPrice(c.max_discount)})</span>}
                    </td>
                    <td className="px-6 py-4">{c.min_order_amount > 0 ? formatPrice(c.min_order_amount) : 'None'}</td>
                    <td className="px-6 py-4">
                      {c.times_used} / {c.usage_limit ?? '∞'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          c.is_active
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {c.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {c.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Coupon">
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. SUMMER25"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Discount Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  discountType === 'percentage'
                    ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                    : 'bg-surface-700 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Percent size={14} /> Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  discountType === 'fixed'
                    ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                    : 'bg-surface-700 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <IndianRupee size={14} /> Fixed Amount (₹)
              </button>
            </div>
          </div>

          <Input
            label={discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
            type="number"
            min="1"
            max={discountType === 'percentage' ? '100' : '9999'}
            step="any"
            placeholder={discountType === 'percentage' ? '20' : '200'}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Order (₹)"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
            {discountType === 'percentage' && (
              <Input
                label="Maximum Discount (₹)"
                type="number"
                min="0"
                step="any"
                placeholder="Optional cap"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Usage Limit"
              type="number"
              min="1"
              placeholder="Unlimited if blank"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
            <Input
              label="Expiration Date"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
