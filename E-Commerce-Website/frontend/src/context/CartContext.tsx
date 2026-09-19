import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { cartApi } from '@/api/cart'
import type { Cart, CartItem } from '@/types'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }

interface CartContextType extends CartState {
  itemCount: number
  subtotal: number
  addItem: (product_id: string, quantity?: number) => Promise<void>
  updateItem: (item_id: string, quantity: number) => Promise<void>
  removeItem: (item_id: string) => Promise<void>
  clearCart: () => Promise<void>
  openCart: () => void
  closeCart: () => void
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':    return { ...state, cart: action.payload, isLoading: false }
    case 'SET_LOADING': return { ...state, isLoading: action.payload }
    case 'TOGGLE_DRAWER': return { ...state, isOpen: !state.isOpen }
    case 'OPEN_DRAWER':   return { ...state, isOpen: true }
    case 'CLOSE_DRAWER':  return { ...state, isOpen: false }
    default: return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { cart: null, isLoading: false, isOpen: false })

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { dispatch({ type: 'SET_CART', payload: null }); return }
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const cart = await cartApi.getCart()
      dispatch({ type: 'SET_CART', payload: cart })
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [isAuthenticated])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (product_id: string, quantity = 1) => {
    try {
      const cart = await cartApi.addItem(product_id, quantity)
      dispatch({ type: 'SET_CART', payload: cart })
      dispatch({ type: 'OPEN_DRAWER' })
      toast.success('Added to cart!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to add to cart')
    }
  }

  const updateItem = async (item_id: string, quantity: number) => {
    try {
      const cart = await cartApi.updateItem(item_id, quantity)
      dispatch({ type: 'SET_CART', payload: cart })
    } catch (e: any) {
      toast.error(e.message || 'Failed to update cart')
    }
  }

  const removeItem = async (item_id: string) => {
    try {
      const cart = await cartApi.removeItem(item_id)
      dispatch({ type: 'SET_CART', payload: cart })
      toast.success('Item removed')
    } catch (e: any) {
      toast.error(e.message || 'Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clearCart()
      dispatch({ type: 'SET_CART', payload: null })
    } catch {}
  }

  const items: CartItem[] = state.cart?.items || []
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => {
    const price = i.product?.discount_price ?? i.product?.price ?? 0
    return sum + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      ...state, itemCount, subtotal,
      addItem, updateItem, removeItem, clearCart,
      openCart: () => dispatch({ type: 'OPEN_DRAWER' }),
      closeCart: () => dispatch({ type: 'CLOSE_DRAWER' }),
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
