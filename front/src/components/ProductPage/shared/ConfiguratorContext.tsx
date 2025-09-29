import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Action types
type ConfiguratorAction = 
  | { type: 'SET_DIMENSION'; field: 'width' | 'height' | 'depth' | 'plintHeight'; value: number }
  | { type: 'SET_COLOR'; value: string }
  | { type: 'SET_SECTIONS'; value: number }
  | { type: 'SET_FURNITURE_OPTION'; field: string; value: string }
  | { type: 'RESET_CONFIGURATION' }
  | { type: 'LOAD_PRESET'; preset: Partial<ConfiguratorState> }

// State interface
export interface ConfiguratorState {
  dimensions: {
    width: number
    height: number
    depth: number
    plintHeight: number
  }
  appearance: {
    selectedColor: string
    imageColor: string
  }
  sections: {
    count: number
    arrangement: unknown[]
  }
  furniture: {
    guides: string
    hinges: string
    openingMethod: string
  }
  pricing: {
    basePrice: number
    totalPrice: number
  }
  validation: {
    isValid: boolean
    errors: string[]
  }
}

// Initial state
const initialState: ConfiguratorState = {
  dimensions: { width: 80, height: 70, depth: 40, plintHeight: 2 },
  appearance: { selectedColor: '#ded9d3', imageColor: 'Biege' },
  sections: { count: 1, arrangement: [] },
  furniture: { 
    guides: 'homepage.configurator.fittings.guides.options.1',
    hinges: 'standard',
    openingMethod: 'push'
  },
  pricing: { basePrice: 0, totalPrice: 0 },
  validation: { isValid: true, errors: [] }
}

// Reducer
function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction): ConfiguratorState {
  switch (action.type) {
    case 'SET_DIMENSION':
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          [action.field]: action.value
        }
      }
    case 'SET_COLOR':
      return {
        ...state,
        appearance: {
          ...state.appearance,
          selectedColor: action.value,
          imageColor: mapColorToImage(action.value)
        }
      }
    case 'RESET_CONFIGURATION':
      return initialState
    case 'LOAD_PRESET':
      return { ...state, ...action.preset }
    default:
      return state
  }
}

// Helper functions
function mapColorToImage(color: string): string {
  const colorMap: Record<string, string> = {
    'Biege': 'Biege',
    'White': 'White',
    'Light Grey': 'Light Grey',
    'Grey': 'Grey',
    '#ded9d3': 'Biege',
    '#fcfbf5': 'White',
    '#d6d6d6': 'Light Grey',
    '#9c9c9c': 'Grey',
  }
  return colorMap[color] || 'White'
}

// Context
const ConfiguratorContext = createContext<{
  state: ConfiguratorState
  dispatch: React.Dispatch<ConfiguratorAction>
} | undefined>(undefined)

// Provider
export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialState)

  return (
    <ConfiguratorContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

// Hook
export function useConfigurator() {
  const context = useContext(ConfiguratorContext)
  if (!context) {
    throw new Error('useConfigurator must be used within ConfiguratorProvider')
  }
  return context
}

// Selector hooks for performance
export function useDimensions() {
  const { state } = useConfigurator()
  return state.dimensions
}

export function useAppearance() {
  const { state } = useConfigurator()
  return state.appearance
}

export function usePricing() {
  const { state } = useConfigurator()
  return state.pricing
} 