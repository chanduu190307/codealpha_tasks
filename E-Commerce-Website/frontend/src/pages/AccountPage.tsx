import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Package, LogOut, Save, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn } from '@/utils'

type Tab = 'profile' | 'security' | 'orders'

export function AccountPage() {
  const { user, logout, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.title = 'My Account — E-commerce Store'
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameForm.name.trim()) {
      toast.error('Name cannot be empty')
      return
    }
    setIsSaving(true)
    try {
      await authApi.updateProfile({ name: nameForm.name.trim() })
      await refreshUser()
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwForm.current) {
      toast.error('Please enter your current password')
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (pwForm.next.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setIsSaving(true)
    try {
      await authApi.updateProfile({ currentPassword: pwForm.current, newPassword: pwForm.next })
      setPwForm({ current: '', next: '', confirm: '' })
      toast.success('Password changed successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={16} /> },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">{user?.name}</h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/15 text-primary-300 border border-primary-500/25">
                {user?.role === 'ADMIN' ? '🛡 Admin' : '🛒 Customer'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-3 space-y-1 border border-white/8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/8'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-white/8">
                <button
                  onClick={() => { logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass rounded-2xl p-6 border border-white/8">
                  <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                    <User size={18} className="text-primary-400" />
                    Personal Information
                  </h2>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <Input
                      label="Full Name"
                      value={nameForm.name}
                      onChange={e => setNameForm({ name: e.target.value })}
                      leftIcon={<User size={15} />}
                    />
                    <Input
                      label="Email address"
                      value={user?.email || ''}
                      disabled
                      leftIcon={<Mail size={15} />}
                      helperText="Email cannot be changed"
                    />
                    <div className="pt-2">
                      <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Save size={15} />}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass rounded-2xl p-6 border border-white/8">
                  <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                    <Shield size={18} className="text-primary-400" />
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordSave} className="space-y-4">
                    <Input
                      label="Current Password"
                      type={showPw ? 'text' : 'password'}
                      value={pwForm.current}
                      onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                      leftIcon={<Lock size={15} />}
                      rightIcon={
                        <button type="button" onClick={() => setShowPw(s => !s)} className="hover:text-white">
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                      required
                    />
                    <Input
                      label="New Password"
                      type={showPw ? 'text' : 'password'}
                      value={pwForm.next}
                      onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                      leftIcon={<Lock size={15} />}
                      helperText="Minimum 8 characters"
                      required
                    />
                    <Input
                      label="Confirm New Password"
                      type={showPw ? 'text' : 'password'}
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      leftIcon={<Lock size={15} />}
                      required
                    />
                    <div className="pt-2">
                      <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Save size={15} />}>
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass rounded-2xl p-6 border border-white/8 text-center">
                  <Package size={48} className="text-primary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">View Your Orders</h3>
                  <p className="text-slate-400 mb-6">Track your current orders and view past purchases.</p>
                  <Link to="/orders">
                    <Button variant="primary" leftIcon={<Package size={16} />}>
                      Go to Orders
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
