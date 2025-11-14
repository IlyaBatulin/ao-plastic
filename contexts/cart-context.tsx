"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type CartItem = {
  productId: string
  productName: string
  productImage?: string
  categoryId: string
  subcategoryId?: string
  quantity: number
  price?: number
  isPackages?: boolean // true если заказ в упаковках (хозтовары)
  packageQuantity?: number // количество штук в одной упаковке
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Загружаем корзину из localStorage при монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart")
      if (saved) {
        const parsed = JSON.parse(saved)
        setItems(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
      setItems([])
    }
  }, [])

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    try {
      if (items.length > 0) {
        localStorage.setItem("cart", JSON.stringify(items))
      } else {
        localStorage.removeItem("cart")
      }
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === newItem.productId)
      
      if (existingIndex >= 0) {
        // Обновляем количество
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        }
        return updated
      }
      
      // Добавляем новый товар
      return [...prev, newItem]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

