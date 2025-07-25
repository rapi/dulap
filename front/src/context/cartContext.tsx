import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import {
  CartPredefinedValue,
  CartProductComponent,
} from '~/components/ProductPage/productTypeComponents/CartProductComponents'

export type CartItem = { name: string; config: CartProductComponent[] }

type CartContextType = {
  items: CartItem[]
  addItem: (
    name: string,
    config: CartProductComponent[],
    predefinedValues: CartPredefinedValue
  ) => void
  removeItem: (index: number) => void
  clearCart: () => void
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
      config: CartProductComponent[],
      predefinedValues: CartPredefinedValue
    ) => {
      const newConfig = config.map((component) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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

  const removeItem = useCallback(
    (index: number) => {
      const next = items.filter((_, i) => i !== index)
      setItems(next)
      localStorage.setItem('cartItems', JSON.stringify(next))
    },
    [items]
  )

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('cartItems')
  }, [])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, itemCount: items.length }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
