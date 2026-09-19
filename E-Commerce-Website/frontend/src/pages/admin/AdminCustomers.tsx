import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/api/admin'
import type { User } from '@/types'
import { formatDate } from '@/utils'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

export function AdminCustomers() {
  const [customers, setCustomers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const limit = 20
  const totalPages = Math.ceil(total / limit)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const resp = await adminApi.getAllCustomers(page, limit)
      setCustomers(resp.data ?? [])
      setTotal(resp.pagination?.total ?? 0)
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    document.title = 'Customers — Admin'
    load()
  }, [load])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id)
    try {
      const updated = await adminApi.updateCustomerStatus(id, !currentStatus)
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: updated.is_active } : c))
      )
      toast.success(`Customer account ${!currentStatus ? 'activated' : 'deactivated'}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Customers</h1>
        <p className="text-slate-400 text-sm mt-1">{total} registered customers</p>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-slate-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-4">Customer</th>
                  <th className="text-left px-4 py-4 hidden md:table-cell">Email</th>
                  <th className="text-center px-4 py-4 hidden sm:table-cell">Status</th>
                  <th className="text-right px-4 py-4">Joined</th>
                  <th className="text-center px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-surface-700/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-500/15 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-primary-300">
                              {customer.name?.[0]?.toUpperCase() ?? '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <p className="text-xs text-slate-500 md:hidden">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400 hidden md:table-cell">
                      {customer.email}
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <span
                        className={cn(
                          'text-xs px-2.5 py-0.5 rounded-full border',
                          customer.is_active
                            ? 'text-green-400 bg-green-400/10 border-green-400/30'
                            : 'text-red-400 bg-red-400/10 border-red-400/30'
                        )}
                      >
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-slate-400">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant={customer.is_active ? 'outline' : 'primary'}
                        size="sm"
                        isLoading={updatingId === customer.id}
                        onClick={() => handleToggleStatus(customer.id, customer.is_active)}
                        className="text-xs py-1 px-3"
                      >
                        {customer.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
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
          <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
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
    </div>
  )
}
