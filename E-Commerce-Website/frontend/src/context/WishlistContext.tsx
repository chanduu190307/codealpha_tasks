import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { wishlistApi } from '@/api/wishlist'
import type { Wishlist } from '@/types'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface WishlistContextType {
  wishlist: Wishlist | null
  isLoading: boolean
  itemCount: number
  isInWishlist: (productId: string) => boolean
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  toggleItem: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) { setWishlist(null); return }
    setIsLoading(true)
    try {
      const wl = await wishlistApi.getWishlist()
      setWishlist(wl)
    } catch {}
    finally { setIsLoading(false) }
  }, [isAuthenticated])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  const isInWishlist = (productId: string) =>
    wishlist?.items?.some(i => i.product_id === productId) ?? false

  const addItem = async (productId: string) => {
    try {
      const wl = await wishlistApi.addItem(productId)
      setWishlist(wl)
      toast.success('Added to wishlist ♡')
    } catch (e: any) { toast.error(e.message || 'Failed') }
  }

  const removeItem = async (productId: string) => {
    try {
      const wl = await wishlistApi.removeItem(productId)
      setWishlist(wl)
      toast.success('Removed from wishlist')
    } catch (e: any) { toast.error(e.message || 'Failed') }
  }

  const toggleItem = async (productId: string) => {
    if (isInWishlist(productId)) await removeItem(productId)
    else await addItem(productId)
  }

  return (
    <WishlistContext.Provider value={{
      wishlist, isLoading,
      itemCount: wishlist?.items?.length ?? 0,
      isInWishlist, addItem, removeItem, toggleItem,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
