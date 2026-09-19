import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const BrandLogo = () => (
  <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center shadow-lg glow-primary">
      <ShoppingBag size={20} className="text-white" />
    </div>
    <span className="font-display font-bold text-2xl text-white">
      E-commerce<span className="gradient-text">Store</span>
    </span>
  </Link>
)

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animated-gradient">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/4 w-48 h-48 bg-primary-400/8 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <BrandLogo />
          <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to continue shopping</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
              autoComplete="email"
              leftIcon={<Mail size={16} />}
            />
            <div>
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Your password"
                required
                autoComplete="current-password"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="hover:text-white transition-colors"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div className="text-right mt-1.5">
                <Link to="/forgot-password" className="text-xs text-primary-300 hover:text-primary-200 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2.5 border border-red-400/20"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-2"
              rightIcon={<ArrowRight size={16} />}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-300 hover:text-primary-200 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        {/* Benefits reminder */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span>🔒 Secure checkout</span>
          <span>🚚 Free shipping</span>
          <span>↩️ Easy returns</span>
        </div>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (@$!%*?&)')
      return
    }

    setIsLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (e: any) {
      setError(e.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animated-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <BrandLogo />
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-slate-400 mt-1 text-sm">Join thousands of happy shoppers</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
              required
              leftIcon={<User size={16} />}
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
              leftIcon={<Mail size={16} />}
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min 8 chars, mixed case, number, symbol"
              required
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="hover:text-white transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              helperText="At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character (@$!%*?&)"
            />
            <Input
              label="Confirm Password"
              type={showPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Repeat your password"
              required
              leftIcon={<Lock size={16} />}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2.5 border border-red-400/20"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-2"
              rightIcon={<ArrowRight size={16} />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-300 hover:text-primary-200 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-600 mt-3">
            By creating an account, you agree to our{' '}
            <span className="text-slate-500">Terms of Service</span> and{' '}
            <span className="text-slate-500">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    try {
      const res = await authApi.forgotPassword(email)
      setSuccess(res.message || 'If an account exists with this email, a password reset link has been sent.')
    } catch (e: any) {
      setError(e.message || 'Failed to send reset link.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animated-gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <BrandLogo />
          <h1 className="font-display font-bold text-2xl text-white">Reset Password</h1>
          <p className="text-slate-400 mt-1 text-sm">Enter your email to receive a password reset link</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} />
              </div>
              <p className="text-sm text-slate-300">{success}</p>
              <Link to="/login" className="inline-block mt-4 text-sm text-primary-300 hover:text-primary-200">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                leftIcon={<Mail size={16} />}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2.5 border border-red-400/20"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="mt-2"
                rightIcon={<ArrowRight size={16} />}
              >
                Send Reset Link
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing password reset token.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.')
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (e: any) {
      setError(e.message || 'Failed to reset password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animated-gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <BrandLogo />
          <h1 className="font-display font-bold text-2xl text-white">Create New Password</h1>
          <p className="text-slate-400 mt-1 text-sm">Enter your new secure password below</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} />
              </div>
              <p className="text-sm text-slate-300">
                Password reset successfully! Redirecting you to login...
              </p>
              <Link to="/login" className="inline-block mt-4 text-sm text-primary-300 hover:text-primary-200">
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="New password"
                required
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="hover:text-white transition-colors"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                helperText="Min 8 characters, uppercase, lowercase, number, and symbol"
              />
              <Input
                label="Confirm New Password"
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                required
                leftIcon={<Lock size={16} />}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2.5 border border-red-400/20"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="mt-2"
                rightIcon={<ArrowRight size={16} />}
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
