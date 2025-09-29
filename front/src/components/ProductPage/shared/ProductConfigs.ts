import { ProductConstraints, PricingConfig } from './BaseProductConfigurator'

// Stand Configuration
export const STAND_CONSTRAINTS: ProductConstraints = {
  widthRange: [50, 120],
  heightRange: [30, 130],
  depthRange: [35, 50],
  plintHeightRange: [2, 10],
  colors: ['Biege', 'White', 'Light Grey', 'Grey'],
  defaultValues: {
    width: 80,
    height: 70,
    depth: 40,
    plintHeight: 2,
    selectedColor: '#ded9d3',
    guides: 'homepage.configurator.fittings.guides.options.1',
    openingOption: 'push'
  }
}

export const STAND_PRICING: PricingConfig = {
  baseCost: 600,
  sectionCost: 600,
  widthMultiplier: 20,
  heightMultiplier: 4.5,
  depthMultiplier: 8,
  fittingsCost: 390,
  markup: 1.3
}

// TV Stand Configuration
export const TV_STAND_CONSTRAINTS: ProductConstraints = {
  widthRange: [100, 200],
  heightRange: [30, 60],
  depthRange: [35, 50],
  plintHeightRange: [2, 10],
  colors: ['Biege', 'White', 'Light Grey', 'Grey'],
  defaultValues: {
    width: 160,
    height: 45,
    depth: 40,
    plintHeight: 2,
    selectedColor: '#ded9d3',
    guides: 'homepage.configurator.fittings.guides.options.1',
    openingOption: 'push'
  }
}

export const TV_STAND_PRICING: PricingConfig = {
  baseCost: 300,
  sectionCost: 600,
  widthMultiplier: 20,
  heightMultiplier: 4.5,
  depthMultiplier: 8,
  fittingsCost: 390,
  markup: 1.3
}

// Bedside Configuration
export const BEDSIDE_CONSTRAINTS: ProductConstraints = {
  widthRange: [40, 80],
  heightRange: [30, 60],
  depthRange: [30, 50],
  plintHeightRange: [2, 8],
  colors: ['Biege', 'White', 'Light Grey', 'Grey'],
  defaultValues: {
    width: 60,
    height: 40,
    depth: 40,
    plintHeight: 2,
    selectedColor: '#ded9d3',
    guides: 'homepage.configurator.fittings.guides.options.1',
    openingOption: 'push'
  }
}

export const BEDSIDE_PRICING: PricingConfig = {
  baseCost: 600,
  sectionCost: 600,
  widthMultiplier: 20,
  heightMultiplier: 4.5,
  depthMultiplier: 8,
  fittingsCost: 390,
  markup: 1.3
}

// Wardrobe Configuration
export const WARDROBE_CONSTRAINTS: ProductConstraints = {
  widthRange: [40, 250],
  heightRange: [190, 270],
  depthRange: [35, 60],
  plintHeightRange: [2, 8],
  colors: ['Biege', 'White', 'Light Grey', 'Grey'],
  defaultValues: {
    width: 200,
    height: 260,
    depth: 50,
    plintHeight: 2,
    selectedColor: '#ded9d3',
    guides: 'standard',
    openingOption: 'maner'
  }
}

export const WARDROBE_PRICING: PricingConfig = {
  baseCost: 350,
  sectionCost: 0, // Wardrobe uses complex section pricing
  widthMultiplier: 29,
  heightMultiplier: 4.5,
  depthMultiplier: 0,
  fittingsCost: 0, // Calculated separately
  markup: 1.35
}

// Storage Configuration
export const STORAGE_CONSTRAINTS: ProductConstraints = {
  widthRange: [60, 120],
  heightRange: [60, 120],
  depthRange: [30, 60],
  plintHeightRange: [60, 120],
  colors: ['#eeeeee', '#b5b5b5', '#d7d0c5'],
  defaultValues: {
    width: 80,
    height: 80,
    depth: 40,
    plintHeight: 60,
    selectedColor: '#eeeeee',
    guides: 'homepage.configurator.fittings.guides.options.1',
    openingOption: 'maner'
  }
}

export const STORAGE_PRICING: PricingConfig = {
  baseCost: 500,
  sectionCost: 400,
  widthMultiplier: 15,
  heightMultiplier: 3,
  depthMultiplier: 6,
  fittingsCost: 200,
  markup: 1.25
}

// Green Wall Configuration
export const GREEN_WALL_CONSTRAINTS: ProductConstraints = {
  widthRange: [50, 200],
  heightRange: [50, 200],
  depthRange: [10, 30],
  plintHeightRange: [0, 10],
  colors: ['Green', 'Dark Green', 'Light Green'],
  defaultValues: {
    width: 100,
    height: 100,
    depth: 15,
    plintHeight: 0,
    selectedColor: 'Green',
    guides: 'none',
    openingOption: 'none'
  }
}

export const GREEN_WALL_PRICING: PricingConfig = {
  baseCost: 200,
  sectionCost: 100,
  widthMultiplier: 8,
  heightMultiplier: 8,
  depthMultiplier: 2,
  fittingsCost: 0,
  markup: 1.2
}

// Office Table Configuration
export const OFFICE_TABLE_CONSTRAINTS: ProductConstraints = {
  widthRange: [100, 200],
  heightRange: [70, 80],
  depthRange: [60, 100],
  plintHeightRange: [0, 5],
  colors: ['White', 'Black', 'Wood', 'Grey'],
  defaultValues: {
    width: 140,
    height: 75,
    depth: 80,
    plintHeight: 0,
    selectedColor: 'White',
    guides: 'none',
    openingOption: 'none'
  }
}

export const OFFICE_TABLE_PRICING: PricingConfig = {
  baseCost: 400,
  sectionCost: 0,
  widthMultiplier: 12,
  heightMultiplier: 5,
  depthMultiplier: 8,
  fittingsCost: 0,
  markup: 1.4
} 