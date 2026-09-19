import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40',
  secondary: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white shadow-lg shadow-accent-500/25',
  outline: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/40',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/10',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-500/25',
}

const sizes = {
  sm:  'px-3 py-1.5 text-sm rounded-lg',
  md:  'px-5 py-2.5 text-sm rounded-xl',
  lg:  'px-6 py-3 text-base rounded-xl',
  xl:  'px-8 py-4 text-lg rounded-2xl',
}

export function Button({
  children, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, className, disabled, ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer select-none shine-on-hover',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  )
}
