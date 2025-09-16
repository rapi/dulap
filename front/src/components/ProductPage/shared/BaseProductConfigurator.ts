import { useState, useEffect, useMemo } from 'react'

// Shared types and interfaces
export interface BaseProductState {
  width: number
  height: number
  depth: number
  plintHeight: number
  selectedColor: string
  imageColor: string
  guides: string
  openingOption: string
}

export interface ProductConstraints {
  widthRange: [number, number]
  heightRange: [number, number]
  depthRange: [number, number]
  plintHeightRange: [number, number]
  colors: string[]
  defaultValues: Partial<BaseProductState>
}

export interface PricingConfig {
  baseCost: number
  sectionCost: number
  widthMultiplier: number
  heightMultiplier: number
  depthMultiplier: number
  fittingsCost: number
  markup: number
}

// Color mapping utility (centralized)
export const COLOR_TO_IMAGE_MAP: Record<string, string> = {
  'Biege': 'Biege',
  'White': 'White',
  'Light Grey': 'Light Grey',
  'Grey': 'Grey',
  '#ded9d3': 'Biege',
  '#fcfbf5': 'White',
  '#d6d6d6': 'Light Grey',
  '#9c9c9c': 'Grey',
}

// Base configurator hook
export function useBaseProductConfigurator(
  constraints: ProductConstraints,
  pricingConfig: PricingConfig
) {
  // Base state
  const [width, setWidth] = useState(constraints.defaultValues.width ?? 80)
  const [height, setHeight] = useState(constraints.defaultValues.height ?? 70)
  const [depth, setDepth] = useState(constraints.defaultValues.depth ?? 40)
  const [plintHeight, setPlintHeight] = useState(constraints.defaultValues.plintHeight ?? 2)
  const [selectedColor, setSelectedColor] = useState(constraints.defaultValues.selectedColor ?? '#ded9d3')
  const [guides, setGuides] = useState(constraints.defaultValues.guides ?? 'homepage.configurator.fittings.guides.options.1')
  const [openingOption, setOpeningOption] = useState(constraints.defaultValues.openingOption ?? 'push')
  
  // Derived state
  const [imageColor, setImageColor] = useState('White')
  const [imageWidth, setImageWidth] = useState(1000)
  const [imageHeight, setImageHeight] = useState(900)
  const [imagePlintHeight, setImagePlintHeight] = useState(20)

  // Centralized color mapping
  useEffect(() => {
    const mappedColor = COLOR_TO_IMAGE_MAP[selectedColor] || 'White'
    setImageColor(mappedColor)
  }, [selectedColor])

  // Centralized plinth height mapping
  useEffect(() => {
    setImagePlintHeight(plintHeight >= 2 && plintHeight < 5 ? 20 : 60)
  }, [plintHeight])

  // Base price calculation
  const basePrice = useMemo(() => {
    const fittingsPrice = guides === 'homepage.configurator.fittings.guides.options.2' 
      ? pricingConfig.fittingsCost 
      : 0
    
    return Math.round((
      pricingConfig.baseCost +
      width * pricingConfig.widthMultiplier +
      (height - 190) * pricingConfig.heightMultiplier +
      (depth - 30) * pricingConfig.depthMultiplier +
      fittingsPrice
    ) * pricingConfig.markup)
  }, [width, height, depth, guides, pricingConfig])

  return {
    // State
    width, setWidth,
    height, setHeight,
    depth, setDepth,
    plintHeight, setPlintHeight,
    selectedColor, setSelectedColor,
    guides, setGuides,
    openingOption, setOpeningOption,
    
    // Derived state
    imageColor,
    imageWidth, setImageWidth,
    imageHeight, setImageHeight,
    imagePlintHeight,
    
    // Computed values
    basePrice,
    
    // Constraints
    constraints,
  }
}

// Utility functions
export function createDimensionsComponent(state: ReturnType<typeof useBaseProductConfigurator>) {
  return {
    type: 'dimensions' as const,
    widthRange: state.constraints.widthRange,
    heightRange: state.constraints.heightRange,
    depthRange: state.constraints.depthRange,
    plintHeightRange: state.constraints.plintHeightRange,
    width: state.width,
    setWidth: state.setWidth,
    height: state.height,
    setHeight: state.setHeight,
    depth: state.depth,
    setDepth: state.setDepth,
    plintHeight: state.plintHeight,
    setPlintHeight: state.setPlintHeight,
  }
}

export function createColorsComponent(state: ReturnType<typeof useBaseProductConfigurator>) {
  return {
    type: 'colors' as const,
    colors: state.constraints.colors,
    selectedColor: state.selectedColor,
    setSelectedColor: state.setSelectedColor,
  }
}

export function createPriceComponent(price: number) {
  return {
    type: 'price' as const,
    price,
  }
} 