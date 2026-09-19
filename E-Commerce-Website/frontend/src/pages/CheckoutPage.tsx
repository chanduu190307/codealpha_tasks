import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MapPin, CreditCard, ArrowRight, ArrowLeft, Lock, Tag, X } from 'lucide-react'
import { ordersApi } from '@/api/orders'
import { couponsApi, type ValidatedCouponResult } from '@/api/coupons'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/utils'
import type { ShippingAddress, Order } from '@/types'
import toast from 'react-hot-toast'

type Step = 'shipping' | 'payment' | 'confirmation'

const STEPS: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'confirmation', label: 'Confirm', icon: Check },
]

export function CheckoutPage() {
  const { cart, subtotal, fetchCart, isLoading: cartLoading } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('shipping')
  const [isLoading, setIsLoading] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  const [address, setAddress] = useState<ShippingAddress>({
    name: '', address: '', city: '', state: '', country: 'US', zip: '', phone: '',
  })
  const [paymentMethod] = useState('MOCK')
  const [notes, setNotes] = useState('')

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCouponResult | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const items = cart?.items || []
  const discount = appliedCoupon ? appliedCoupon.discount_amount : 0
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const shipping = subtotal >= 1000 ? 0 : 99
  const total = Math.max(0, subtotal - discount + shipping + tax)

  useEffect(() => {
    document.title = 'Checkout — CodeAlpha Store'
    if (!cartLoading && (!cart || items.length === 0)) navigate('/cart')
  }, [cart, cartLoading, items.length, navigate])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    setIsApplyingCoupon(true)
    try {
      const res = await couponsApi.validate(couponCode.trim(), subtotal)
      setAppliedCoupon(res)
      toast.success(`Coupon "${res.code}" applied! Saved ${formatPrice(res.discount_amount)} 🎉`)
    } catch (e: any) {
      toast.error(e.message || 'Invalid or expired coupon')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    toast.success('Coupon removed')
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    try {
      const order = await ordersApi.createOrder({
        shipping_address: address,
        payment_method: paymentMethod,
        notes,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
      })
      setPlacedOrder(order)
      setStep('confirmation')
      await fetchCart()
      toast.success('Order placed successfully! 🎉')
    } catch (e: any) {
      toast.error(e.message || 'Failed to place order')
    } finally { setIsLoading(false) }
  }

  const stepIndex = STEPS.findIndex(s => s.id === step)

  if (step === 'confirmation' && placedOrder) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-400" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-3">Order Confirmed!</h1>
          <p className="text-slate-400 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="glass rounded-2xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Order ID</span>
              <span className="text-white font-mono">#{placedOrder.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total</span>
              <span className="text-primary-400 font-bold">{formatPrice(placedOrder.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400 font-medium">{placedOrder.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Payment</span>
              <span className="text-green-400">✓ {placedOrder.payment_status}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate(`/orders/${placedOrder.id}`)} rightIcon={<ArrowRight size={16} />}>
              View Order Details
            </Button>
            <Button variant="outline" onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <p className="text-xs text-amber-400 font-medium">⚠️ Test/Demo Mode</p>
            <p className="text-xs text-amber-300/70 mt-1">This is a demo payment. No real transaction was processed.</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-10">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done = i < stepIndex
          const active = i === stepIndex
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-primary-500 text-white' : 'bg-surface-700 text-slate-500'
                }`}>
                {done ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${active ? 'text-white' : done ? 'text-green-400' : 'text-slate-500'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < stepIndex ? 'bg-green-500' : 'bg-surface-600'}`} style={{ minWidth: 24 }} />}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-8 space-y-6">
              <h2 className="font-semibold text-white text-xl flex items-center gap-3">
                <MapPin size={20} className="text-primary-400" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} required placeholder="John Doe" className="sm:col-span-2" />
                <Input label="Street Address" value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} required placeholder="123 Main St" className="sm:col-span-2" />
                <Input label="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required placeholder="New York" />
                <Input label="State / Region" value={address.state || ''} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="NY" />
                <Input label="ZIP / Postal Code" value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} required placeholder="10001" />
                <Input label="Country" value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} required placeholder="US" />
                <Input label="Phone (optional)" value={address.phone || ''} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+1 234 567 8900" className="sm:col-span-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Order Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={3}
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 resize-none text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/cart')}>Back to Cart</Button>
                <Button
                  disabled={!address.name || !address.address || !address.city || !address.country || !address.zip}
                  onClick={() => setStep('payment')} rightIcon={<ArrowRight size={16} />} className="flex-1"
                >
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-8 space-y-6">
              <h2 className="font-semibold text-white text-xl flex items-center gap-3">
                <CreditCard size={20} className="text-primary-400" /> Payment Method
              </h2>

              {/* Mock payment notice */}
              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <p className="text-sm text-amber-300 font-medium flex items-center gap-2">
                  <Lock size={14} /> Secure Demo Payment Mode
                </p>
                <p className="text-xs text-amber-400/70 mt-1">
                  This application uses a test payment provider. No real payment will be processed.
                  To enable Stripe, set STRIPE_SECRET_KEY in your backend .env file.
                </p>
              </div>

              {/* Mock card UI */}
              <div className="relative p-6 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #3a45f5 0%, #ec4899 100%)' }}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="relative">
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Test Card</p>
                  <p className="text-white font-mono text-lg tracking-widest mb-4">4242 4242 4242 4242</p>
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Demo User</span>
                    <span>12/26</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep('shipping')}>Back</Button>
                <Button onClick={handlePlaceOrder} isLoading={isLoading} rightIcon={<Check size={16} />} className="flex-1">
                  Place Order — {formatPrice(total)}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="glass rounded-2xl p-6 border border-white/10 sticky top-24">
            <h2 className="font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-700 flex-shrink-0">
                    {item.product?.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{item.product?.name}</p>
                    <p className="text-xs text-slate-500">×{item.quantity}</p>
                  </div>
                  <p className="text-xs font-medium text-white">{formatPrice((item.product?.discount_price ?? item.product?.price ?? 0) * item.quantity)}</p>
                </div>
              ))}
              {items.length > 3 && <p className="text-xs text-slate-500">+{items.length - 3} more items</p>}
            </div>
            {/* Coupon input */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-2">Discount Coupon</label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-green-400 font-medium">
                    <Tag size={14} />
                    <span>{appliedCoupon.code}</span>
                    <span className="text-slate-400">(-{formatPrice(discount)})</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-white p-1" title="Remove coupon">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-surface-700 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    isLoading={isApplyingCoupon}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span className="flex items-center gap-1"><Tag size={12} /> Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
