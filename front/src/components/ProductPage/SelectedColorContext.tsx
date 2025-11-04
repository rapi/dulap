import React, { createContext, useContext } from 'react'

export type SelectedColorContextValue = {
  color?: string
  setColor: (c: string) => void
}

const SelectedColorContext = createContext<SelectedColorContextValue | null>(
  null
)

export const SelectedColorProvider: React.FC<
  React.PropsWithChildren<SelectedColorContextValue>
> = ({ color, setColor, children }) => (
  <SelectedColorContext.Provider value={{ color, setColor }}>
    {children}
  </SelectedColorContext.Provider>
)

export const useSelectedColor = () => {
  const ctx = useContext(SelectedColorContext)
  if (!ctx) {
    throw new Error(
      'useSelectedColor must be used within SelectedColorProvider'
    )
  }
  return ctx
}
