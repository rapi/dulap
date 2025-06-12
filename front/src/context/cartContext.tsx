// cart-context.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import {
  PredefinedValue,
  ProductComponent,
} from '~/components/ProductPage/WardrobeProductPage'

type CartItem = { name: string; config: ProductComponent[] }

type CartContextType = {
  items: CartItem[]
  addItem: (
    name: string,
    config: ProductComponent[],
    predefinedValues: PredefinedValue
  ) => void
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
    (
      name: string,
      config: ProductComponent[],
      predefinedValues: PredefinedValue
    ) => {
      const newConfig = config.map((component) => {
        const predefinedValue = predefinedValues[component.type]
        if (predefinedValue) {
          return {
            ...component,
            predefinedValue,
          }
        }
        return component
      })
      const newItems = [...items, { name, config: newConfig }]
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
