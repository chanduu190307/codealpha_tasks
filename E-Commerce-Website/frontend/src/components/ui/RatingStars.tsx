import { Star } from 'lucide-react'
import { cn } from '@/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
  showValue?: boolean
  reviewCount?: number
}

export function RatingStars({ rating, maxRating = 5, size = 16, showValue, reviewCount }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <div key={i} className="relative">
              <Star
                size={size}
                className="text-surface-500 fill-surface-600"
              />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
                >
                  <Star size={size} className="text-amber-400 fill-amber-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm text-amber-400 font-medium">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  )
}

interface InteractiveRatingProps {
  value: number
  onChange: (rating: number) => void
  size?: number
}

export function InteractiveRating({ value, onChange, size = 28 }: InteractiveRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-600 fill-slate-700'
            )}
          />
        </button>
      ))}
    </div>
  )
}
