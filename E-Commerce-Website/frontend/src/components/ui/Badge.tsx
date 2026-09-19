import { cn } from '@/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/30',
  success: 'bg-green-500/15 text-green-300 border border-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
  danger:  'bg-red-500/15 text-red-300 border border-red-500/30',
  info:    'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
  neutral: 'bg-white/10 text-slate-300 border border-white/10',
}

export function Badge({ children, variant = 'neutral', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function OrderStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeProps['variant']> = {
    PENDING:    'warning',
    CONFIRMED:  'info',
    PROCESSING: 'primary',
    SHIPPED:    'info',
    DELIVERED:  'success',
    CANCELLED:  'danger',
  }
  return <Badge variant={variantMap[status] || 'neutral'}>{status}</Badge>
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeProps['variant']> = {
    PENDING:  'warning',
    PAID:     'success',
    FAILED:   'danger',
    REFUNDED: 'neutral',
  }
  return <Badge variant={variantMap[status] || 'neutral'}>{status}</Badge>
}
