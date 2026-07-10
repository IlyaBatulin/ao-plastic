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
  colorCode?: string // HEX-код цвета для АБС-пластиков (например, #ff0000)
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, colorCode?: string) => void
  updateQuantity: (productId: string, quantity: number, colorCode?: string) => void
  updateColorCode: (productId: string, colorCode: string) => void
  clearCart: () => void
  itemCount: number
}

/** Один товар с разными цветами — разные позиции корзины. */
function isSameCartLine(item: CartItem, productId: string, colorCode?: string): boolean {
  return item.productId === productId && (item.colorCode ?? "") === (colorCode ?? "")
}

/** Отбрасывает повреждённые записи из localStorage (не объект, нет productId, некорректное количество). */
function sanitizeStoredItems(parsed: unknown): CartItem[] {
  if (!Array.isArray(parsed)) return []
  return parsed.filter((item): item is CartItem => {
    if (!item || typeof item !== "object") return false
    const candidate = item as Partial<CartItem>
    if (typeof candidate.productId !== "string" || !candidate.productId) return false
    return typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity) && candidate.quantity > 0
  })
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Загружаем корзину из localStorage при монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart")
      if (saved) {
        setItems(sanitizeStoredItems(JSON.parse(saved)))
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
      // Один и тот же товар с разным цветом — разные позиции
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          (item.colorCode ?? "") === (newItem.colorCode ?? "")
      )
      
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

  const updateColorCode = (productId: string, colorCode: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, colorCode } : item
      )
    )
  }

  const removeItem = (productId: string, colorCode?: string) => {
    setItems((prev) => prev.filter((item) => !isSameCartLine(item, productId, colorCode)))
  }

  const updateQuantity = (productId: string, quantity: number, colorCode?: string) => {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      removeItem(productId, colorCode)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        isSameCartLine(item, productId, colorCode) ? { ...item, quantity } : item
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
        updateColorCode,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

const fallbackCartContext: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  updateColorCode: () => {},
  clearCart: () => {},
  itemCount: 0,
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    return fallbackCartContext
  }
  return context
}

