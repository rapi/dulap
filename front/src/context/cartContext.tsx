// cart-context.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'

type CartItem = { name: string; config: ProductComponent[] }

type CartContextType = {
  items: CartItem[]
  addItem: (name: string, config: ProductComponent[]) => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cartItems')
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  const addItem = useCallback(
    (name: string, config: ProductComponent[]) => {
      const newItems = [...items, { name, config }]
      setItems(newItems)
      localStorage.setItem('cartItems', JSON.stringify(newItems))
    },
    [items]
  )

  return (
    <CartContext.Provider value={{ items, addItem, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
