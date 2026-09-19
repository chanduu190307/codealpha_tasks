import { cn } from '@/utils'

interface SkeletonProps {
  className?: string
  height?: string | number
  width?: string | number
  rounded?: boolean
}

export function Skeleton({ className, height, width, rounded }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', rounded && 'rounded-full', className)}
      style={{ height, width }}
      role="status"
      aria-label="Loading..."
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-800 rounded-2xl overflow-hidden border border-white/5">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-3" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>
        <Skeleton className="w-full h-9 rounded-xl" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <div className="space-y-6">
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-1/2 h-5" />
        <Skeleton className="w-1/3 h-8" />
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <Skeleton className="w-48 h-4" />
      <Skeleton className="w-24 h-6" />
    </div>
  )
}
