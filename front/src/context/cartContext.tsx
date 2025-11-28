// context/cartContext.tsx
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

/** ---- Types ---- */

// Sample payload stored in cart
export type SampleCartConfig = {
  id: string
  color?: string
  price?: number
  imageCarousel?: string[]
}

// Discriminated union for cart items
export type CartProductItem = {
  type: 'product'
  name: string
  config: CartProductComponent[]
  screenshot?: string // Base64 encoded screenshot data URL
}

export type CartSampleItem = {
  type: 'sample'
  name: string
  sample: SampleCartConfig
}

export type CartItem = CartProductItem | CartSampleItem

// Overloaded Cart API
export interface CartContextType {
  items: CartItem[]

  /** Add a PRODUCT (keeps predefined values logic) */
  addItem(
    name: string,
    config: CartProductComponent[],
    predefinedValues: CartPredefinedValue,
    screenshot?: string
  ): void

  /** Add a SAMPLE */
  addItem(name: string, sample: SampleCartConfig): void

  removeItem: (index: number) => void
  clearCart: () => void
  itemCount: number
}

/** ---- Context ---- */

const CartContext = createContext<CartContextType | undefined>(undefined)
const LS_KEY = 'cartItems'

/** ---- Provider ---- */

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Normalize legacy items ({ name, config }) to { type: 'product', ... }
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as Array<any>
      const normalized: CartItem[] = parsed.map((it) => {
        if (it && (it.type === 'product' || it.type === 'sample')) {
          return it as CartItem
        }
        // Legacy shape fallback
        return {
          type: 'product',
          name: it?.name ?? 'product',
          config: Array.isArray(it?.config) ? it.config : [],
        } as CartProductItem
      })
      setItems(normalized)
    } catch {
      // Corrupt storage → reset
      localStorage.removeItem(LS_KEY)
      setItems([])
    }
  }, [])

  // Implementation handles both overloads
  const addItem = useCallback(
    (
      name: string,
      second: CartProductComponent[] | SampleCartConfig,
      predefinedValues?: CartPredefinedValue
    ) => {
      let newItem: CartItem

      if (Array.isArray(second)) {
        // PRODUCT: apply predefined values per component.type
        const newConfig = second.map((component) => {
          // predefinedValues is a map keyed by component.type
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error index by discriminated union
          const pv = predefinedValues?.[component.type]
          return pv ? { ...component, predefinedValue: pv } : component
        })
        // Extract screenshot from predefinedValues if provided
        const screenshot = (predefinedValues as any)?.screenshot as string | undefined
        newItem = { type: 'product', name, config: newConfig, screenshot }
      } else {
        // SAMPLE
        newItem = { type: 'sample', name, sample: second }
      }

      const next = [...items, newItem]
      setItems(next)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
    },
    [items]
  ) as CartContextType['addItem'] // satisfy the overload type

  const removeItem = useCallback(
    (index: number) => {
      const next = items.filter((_, i) => i !== index)
      setItems(next)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
    },
    [items]
  )

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(LS_KEY)
  }, [])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, itemCount: items.length }}
    >
      {children}
    </CartContext.Provider>
  )
}

/** ---- Hook ---- */

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
