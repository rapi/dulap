/**
 * Centralized Furniture Constraints Configuration
 *
 * This file defines all dimension ranges, section rules, pricing formulas,
 * and validation logic for furniture products.
 *
 * Benefits:
 * - Single source of truth for all constraints
 * - Type-safe with TypeScript
 * - Easy to modify and test
 * - No magic numbers scattered in code
 */

import {
  ColumnConfigurationType,
  getDrawerCount,
} from '~/types/columnConfigurationTypes'

export interface DimensionConstraints {
  min: number
  max: number
  default: number
  unit?: string
}

export interface DimensionRanges {
  width: DimensionConstraints
  height: DimensionConstraints
  depth: DimensionConstraints
  plintHeight: DimensionConstraints
}

export interface DimensionSteps {
  widthStep?: number
  heightStep?: number
  depthStep?: number
}

export interface SectionConstraints {
  rule: 'height-based' | 'width-based' | 'auto' | 'fixed'
  min: number
  max: number
  default: number
  // Function that determines available sections based on dimensions
  getAvailableSections?: (dimensions: {
    width: number
    height: number
  }) => number[]
  // Function that auto-calculates sections (for auto rule)
  autoCalculate?: (dimensions: { width: number; height: number }) => number
}

export interface ColumnConstraints {
  min: number
  max: number
  default: number
  allowCustomConfiguration: boolean
  // Function that determines available columns based on dimensions
  getAvailableColumns?: (dimensions: {
    width: number
    height: number
  }) => number[]
}

export interface PricingFormula {
  basePrice: number
  perDrawer: number
  perCmWidth: number
  perCmHeightAbove: { threshold: number; rate: number }
  perCmDepthAbove: { threshold: number; rate: number }
  vatMultiplier: number
}

export interface ImageConstraints {
  heightThresholds: Array<{ maxHeight: number; imageDimension: number }>
  widthThresholds: Array<{ maxWidth: number; imageDimension: number }>
  plintHeightThresholds: Array<{
    maxPlintHeight: number
    imageDimension: number
  }>
}

export interface ProductConstraints {
  dimensions: DimensionRanges
  steps?: DimensionSteps
  sections: SectionConstraints
  columns: ColumnConstraints
  pricing: PricingFormula
  images: ImageConstraints
  colors: string[]
}

// ============================================================================
// STAND CONSTRAINTS
// ============================================================================

export const STAND_CONSTRAINTS: ProductConstraints = {
  dimensions: {
    width: { min: 50, max: 240, default: 80, unit: 'cm' },
    height: { min: 70, max: 130, default: 70, unit: 'cm' },
    depth: { min: 35, max: 50, default: 40, unit: 'cm' },
    plintHeight: { min: 2, max: 10, default: 2, unit: 'cm' },
  },

  steps: {
    heightStep: 5,
  },

  sections: {
    rule: 'height-based',
    min: 3,
    max: 5,
    default: 4,
    getAvailableSections: ({ height }) => {
      // Height >= 130cm: only 5 sections allowed
      // Height 105-130cm: 4-5 sections allowed
      // Height < 105cm: 3-4 sections allowed
      if (height >= 130) return [5]
      if (height >= 105) return [4, 5]
      return [3, 4]
    },
  },

  columns: {
    min: 1,
    max: 10,
    default: 1,
    allowCustomConfiguration: true,
    getAvailableColumns: ({ height }) => {
      // Height-based column limits for комод (stand)
      // 50-84 cm: 1 column
      // 85-104 cm: 1-2 columns
      // 105-149 cm: 2 columns
      // 150-205 cm: 2-3 columns
      // 206-270 cm: 3 columns
      if (height >= 50 && height <= 84) return [1]
      if (height >= 85 && height <= 104) return [1, 2]
      if (height >= 105 && height <= 149) return [2]
      if (height >= 150 && height <= 205) return [2, 3]
      if (height >= 206 && height <= 270) return [3]
      // Fallback for heights outside the range
      return [1]
    },
  },

  pricing: {
    basePrice: 1500,
    perDrawer: 600,
    perCmWidth: 20,
    perCmHeightAbove: { threshold: 70, rate: 4.5 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    vatMultiplier: 1.3,
  },

  images: {
    heightThresholds: [
      { maxHeight: 90, imageDimension: 700 },
      { maxHeight: 110, imageDimension: 900 },
      { maxHeight: Infinity, imageDimension: 1200 },
    ],
    widthThresholds: [
      { maxWidth: 80, imageDimension: 600 },
      { maxWidth: 100, imageDimension: 800 },
      { maxWidth: Infinity, imageDimension: 1000 },
    ],
    plintHeightThresholds: [
      { maxPlintHeight: 5, imageDimension: 20 },
      { maxPlintHeight: Infinity, imageDimension: 60 },
    ],
  },

  colors: ['White', 'Biege', 'Light Grey', 'Grey'],
}

// ============================================================================
// BEDSIDE CONSTRAINTS
// ============================================================================

export const BEDSIDE_CONSTRAINTS: ProductConstraints = {
  dimensions: {
    width: { min: 40, max: 80, default: 60, unit: 'cm' },
    height: { min: 30, max: 60, default: 40, unit: 'cm' },
    depth: { min: 35, max: 50, default: 40, unit: 'cm' },
    plintHeight: { min: 2, max: 10, default: 2, unit: 'cm' },
  },

  steps: {
    heightStep: 1,
  },

  sections: {
    rule: 'auto',
    min: 1,
    max: 2,
    default: 1,
    autoCalculate: ({ height }) => {
      // Auto-calculate based on height
      // Height > 35cm: 2 sections
      // Height <= 35cm: 1 section
      return height > 35 ? 2 : 1
    },
  },

  columns: {
    min: 1,
    max: 10,
    default: 1,
    allowCustomConfiguration: true,
  },

  pricing: {
    basePrice: 250,
    perDrawer: 600,
    perCmWidth: 20,
    perCmHeightAbove: { threshold: 30, rate: 10 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    vatMultiplier: 1.3,
  },

  images: {
    heightThresholds: [
      { maxHeight: 36, imageDimension: 300 },
      { maxHeight: Infinity, imageDimension: 400 },
    ],
    widthThresholds: [
      { maxWidth: 50, imageDimension: 500 },
      { maxWidth: 70, imageDimension: 600 },
      { maxWidth: Infinity, imageDimension: 800 },
    ],
    plintHeightThresholds: [
      { maxPlintHeight: 5, imageDimension: 20 },
      { maxPlintHeight: Infinity, imageDimension: 60 },
    ],
  },

  colors: ['White', 'Biege', 'Light Grey', 'Grey'],
}

// ============================================================================
// TV STAND CONSTRAINTS
// ============================================================================

export const TV_STAND_CONSTRAINTS: ProductConstraints = {
  dimensions: {
    width: { min: 80, max: 270, default: 160, unit: 'cm' },
    height: { min: 30, max: 60, default: 45, unit: 'cm' },
    depth: { min: 35, max: 50, default: 40, unit: 'cm' },
    plintHeight: { min: 2, max: 10, default: 2, unit: 'cm' },
  },

  steps: {
    heightStep: 1,
  },

  sections: {
    rule: 'width-based',
    min: 1,
    max: 4,
    default: 2,
    getAvailableSections: ({ width }) => {
      // Complex width-based logic
      if (width < 120) return [1, 2]
      if (width < 150) return [1, 2, 3]
      if (width < 190) return [2]
      return [2, 4]
    },
  },

  columns: {
    min: 1,
    max: 4,
    default: 2,
    allowCustomConfiguration: true,
  },

  pricing: {
    basePrice: 300, // Lower base price for TV stands
    perDrawer: 600,
    perCmWidth: 20,
    perCmHeightAbove: { threshold: 190, rate: 4.5 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    vatMultiplier: 1.3,
  },

  images: {
    heightThresholds: [
      { maxHeight: 45, imageDimension: 300 },
      { maxHeight: Infinity, imageDimension: 400 },
    ],
    widthThresholds: [
      { maxWidth: 100, imageDimension: 800 },
      { maxWidth: 120, imageDimension: 1000 },
      { maxWidth: 150, imageDimension: 1200 },
      { maxWidth: 190, imageDimension: 1600 },
      { maxWidth: Infinity, imageDimension: 2000 },
    ],
    plintHeightThresholds: [
      { maxPlintHeight: 5, imageDimension: 20 },
      { maxPlintHeight: Infinity, imageDimension: 60 },
    ],
  },

  colors: ['White', 'Biege', 'Light Grey', 'Grey'],
}

// ============================================================================
// WARDROBE CONSTRAINTS
// ============================================================================
export const WARDROBE_CONSTRAINTS: ProductConstraints = {
  dimensions: {
    width: { min: 40, max: 250, default: 200, unit: 'cm' },
    height: { min: 237, max: 270, default: 260, unit: 'cm' },
    depth: { min: 35, max: 60, default: 50, unit: 'cm' },
    plintHeight: { min: 2, max: 8, default: 2, unit: 'cm' },
  },

  steps: {
    heightStep: 1,
  },

  sections: {
    rule: 'width-based',
    min: 1,
    max: 5,
    default: 1,
    getAvailableSections: ({ width }) => {
      // Width-based sections for wardrobe
      if (width <= 60) return [1]
      if (width <= 100) return [1, 2]
      if (width <= 150) return [2, 3]
      if (width <= 200) return [2, 3]
      return [2, 3]
    },
  },

  columns: {
    min: 1,
    max: 10,
    default: 3,
    allowCustomConfiguration: true,
    getAvailableColumns: ({ width }) => {
      // Width-based column limits for wardrobe
      if (width <= 60) return [1]
      if (width <= 100) return [2]
      if (width <= 150) return [2, 3]
      if (width < 200) return [3, 4]
      if (width === 200) return [4, 5]
      return [4, 5]
    },
  },

  pricing: {
    basePrice: 1000,
    perDrawer: 600,
    perCmWidth: 29,
    perCmHeightAbove: { threshold: 190, rate: 4.5 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    vatMultiplier: 1.35,
  },

  images: {
    heightThresholds: [
      { maxHeight: 210, imageDimension: 2100 },
      { maxHeight: Infinity, imageDimension: 2400 },
    ],
    widthThresholds: [
      { maxWidth: 60, imageDimension: 50 },
      { maxWidth: 100, imageDimension: 80 },
      { maxWidth: 150, imageDimension: 120 },
      { maxWidth: 200, imageDimension: 160 },
      { maxWidth: Infinity, imageDimension: 200 },
    ],
    plintHeightThresholds: [
      { maxPlintHeight: 5, imageDimension: 20 },
      { maxPlintHeight: Infinity, imageDimension: 60 },
    ],
  },

  colors: ['White', 'Biege', 'Light Grey', 'Grey'],
}

// ============================================================================
// RACK CONSTRAINTS
// ============================================================================
export const RACK_CONSTRAINTS: ProductConstraints = {
  dimensions: {
    width: { min: 40, max: 250, default: 120, unit: 'cm' },
    height: { min: 90, max: 270, default: 200, unit: 'cm' },
    depth: { min: 25, max: 65, default: 35, unit: 'cm' },
    plintHeight: { min: 2, max: 8, default: 2, unit: 'cm' },
  },

  steps: {
    heightStep: 1,
    depthStep: 5,
  },

  sections: {
    rule: 'width-based',
    min: 1,
    max: 3,
    default: 1,
    getAvailableSections: ({ width }) => {
      // Width-based sections for rack
      if (width <= 80) return [1]
      if (width <= 160) return [1, 2]
      return [1, 2, 3]
    },
  },

  columns: {
    min: 1,
    max: 3,
    default: 2,
    allowCustomConfiguration: true,
    getAvailableColumns: ({ width }) => {
      // Width-based column limits for rack
      // 40-80cm: 1 column
      // 81-160cm: 2 columns
      // 161-250cm: 3 columns
      if (width <= 80) return [1]
      if (width <= 160) return [2]
      return [3]
    },
  },

  pricing: {
    basePrice: 800,
    perDrawer: 600,
    perCmWidth: 25,
    perCmHeightAbove: { threshold: 200, rate: 4 },
    perCmDepthAbove: { threshold: 30, rate: 7 },
    vatMultiplier: 1.35,
  },

  images: {
    heightThresholds: [
      { maxHeight: 150, imageDimension: 1500 },
      { maxHeight: 220, imageDimension: 2000 },
      { maxHeight: Infinity, imageDimension: 2400 },
    ],
    widthThresholds: [
      { maxWidth: 80, imageDimension: 80 },
      { maxWidth: 160, imageDimension: 120 },
      { maxWidth: Infinity, imageDimension: 180 },
    ],
    plintHeightThresholds: [
      { maxPlintHeight: 5, imageDimension: 20 },
      { maxPlintHeight: Infinity, imageDimension: 60 },
    ],
  },

  colors: ['White', 'Biege', 'Light Grey', 'Grey'],
}

// ============================================================================
// WARDROBE PRICE CALCULATION
// ============================================================================

export interface WardrobePriceParams {
  width: number
  height: number
  depth: number
  doors: number
  sectionsPrice: number
  templatesExtraCost: number
}

/**
 * Wardrobe-specific price calculation
 * Mirrors old logic from wardrobe.ts, but centralized
 */
export function calculateWardrobePrice(params: WardrobePriceParams): number {
  const { width, height, doors, sectionsPrice, templatesExtraCost } = params
  const { pricing } = getConstraints('wardrobe')

  // width * 29
  // + (height - 190) * 4.5 * doorsNr
  // + sectionsPrice
  // + guidesExtraPrice
  // + 350 * doorsNr
  // + 350
  // all * 1.35

  const extraHeightCm =
    height > pricing.perCmHeightAbove.threshold
      ? height - pricing.perCmHeightAbove.threshold
      : 0

  const basePerWidth = width * pricing.perCmWidth
  const heightDoorsPart = extraHeightCm * pricing.perCmHeightAbove.rate * doors

  // 350 * doorsNr + 350  == pricing.basePrice * doors + pricing.basePrice
  const doorsBase = pricing.basePrice * doors
  const wardrobeBase = pricing.basePrice

  const totalBeforeVat =
    basePerWidth +
    heightDoorsPart +
    sectionsPrice +
    doorsBase +
    wardrobeBase +
    templatesExtraCost

  const round10 = (n: number): number => Math.round(n / 10) * 10

  return round10(Math.round(totalBeforeVat * pricing.vatMultiplier))
}

// ============================================================================
// RACK PRICE CALCULATION
// ============================================================================

export interface RackPriceParams {
  width: number
  height: number
  depth: number
  columns: number
  templatesExtraCost: number
}

/**
 * Rack-specific price calculation
 * Similar to wardrobe but adjusted for rack specifics
 */
export function calculateRackPrice(params: RackPriceParams): number {
  const { width, height, depth, columns, templatesExtraCost } = params
  const { pricing } = getConstraints('rack')

  const extraHeightCm =
    height > pricing.perCmHeightAbove.threshold
      ? height - pricing.perCmHeightAbove.threshold
      : 0

  const extraDepthCm =
    depth > pricing.perCmDepthAbove.threshold
      ? depth - pricing.perCmDepthAbove.threshold
      : 0

  const basePerWidth = width * pricing.perCmWidth
  const heightPart = extraHeightCm * pricing.perCmHeightAbove.rate
  const depthPart = extraDepthCm * pricing.perCmDepthAbove.rate

  const columnsBase = pricing.basePrice * columns

  const totalBeforeVat =
    basePerWidth +
    heightPart +
    depthPart +
    columnsBase +
    templatesExtraCost

  const round10 = (n: number): number => Math.round(n / 10) * 10

  return round10(Math.round(totalBeforeVat * pricing.vatMultiplier))
}

// ============================================================================
// CONSTRAINT REGISTRY
// ============================================================================

export const FURNITURE_CONSTRAINTS = {
  stand: STAND_CONSTRAINTS,
  bedside: BEDSIDE_CONSTRAINTS,
  'tv-stand': TV_STAND_CONSTRAINTS,
  wardrobe: WARDROBE_CONSTRAINTS,
  rack: RACK_CONSTRAINTS,
} as const

export type FurnitureType = keyof typeof FURNITURE_CONSTRAINTS

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get constraints for a specific furniture type
 */
export function getConstraints(type: FurnitureType): ProductConstraints {
  return FURNITURE_CONSTRAINTS[type]
}

/**
 * Calculate price based on constraints and dimensions
 */

export function calculatePrice(
  type: FurnitureType,
  dimensions: { width: number; height: number; depth: number },
  columns: number,
  drawers: number = 3,
  columnConfigTypes?: ColumnConfigurationType[],
  isPushOpening?: boolean
): number {
  const { pricing } = getConstraints(type)

  // 1) Safe columns
  const safeColumns = Math.max(1, columns)

  // 2) Width per column (делим ширину только если > 1 колонки)
  const widthPerColumn =
    safeColumns > 1 ? dimensions.width / safeColumns : dimensions.width

  // 3) Surcharges only when above thresholds
  const extraHeightCm =
    dimensions.height > pricing.perCmHeightAbove.threshold
      ? dimensions.height - pricing.perCmHeightAbove.threshold
      : 0

  const extraDepthCm =
    dimensions.depth > pricing.perCmDepthAbove.threshold
      ? dimensions.depth - pricing.perCmDepthAbove.threshold
      : 0

  // 4) Base price per column (без ящиков)
  const perColumnBaseWithoutDrawers =
    pricing.basePrice +
    widthPerColumn * pricing.perCmWidth +
    extraHeightCm * pricing.perCmHeightAbove.rate +
    extraDepthCm * pricing.perCmDepthAbove.rate

  // 5) Drawer count:
  let totalDrawerCount: number

  if (
    (type === 'stand' || type === 'tv-stand' || type === 'bedside') &&
    columnConfigTypes &&
    columnConfigTypes.length > 0
  ) {
    totalDrawerCount = columnConfigTypes
      .slice(0, safeColumns)
      .reduce((sum, cfgType) => sum + getDrawerCount(cfgType), 0)
  } else {
    // backward compatible: как раньше
    totalDrawerCount = drawers * safeColumns
  }

  // 6) Drawer pricing (base + push-to-open surcharge)
  const basePerDrawer = pricing.perDrawer
  const pushExtraPerDrawer = isPushOpening ? 250 : 0
  const perDrawerTotal = basePerDrawer + pushExtraPerDrawer

  const totalDrawersPrice = totalDrawerCount * perDrawerTotal

  // 7) Total before VAT
  const totalBeforeVat =
    perColumnBaseWithoutDrawers * safeColumns + totalDrawersPrice

  const round10 = (n: number): number => Math.round(n / 10) * 10

  // 8) Apply VAT and final rounding
  return round10(Math.round(totalBeforeVat * pricing.vatMultiplier))
}

/**
 * Get available columns based on dimensions
 */
export function getAvailableColumns(
  type: FurnitureType,
  dimensions: { width: number; height: number }
): number[] {
  const { columns } = getConstraints(type)

  if (columns.getAvailableColumns) {
    return columns.getAvailableColumns(dimensions)
  }

  // Fallback: return all columns from min to max
  return Array.from(
    { length: columns.max - columns.min + 1 },
    (_, i) => columns.min + i
  )
}

/**
 * Get image dimension based on actual dimension
 */
export function getImageDimension(
  thresholds: Array<{
    maxHeight?: number
    maxWidth?: number
    maxPlintHeight?: number
    imageDimension: number
  }>,
  actualValue: number
): number {
  const threshold = thresholds.find((t) => {
    const max = t.maxHeight ?? t.maxWidth ?? t.maxPlintHeight ?? Infinity
    return actualValue < max
  })
  return (
    threshold?.imageDimension ??
    thresholds[thresholds.length - 1].imageDimension
  )
}

/**
 * Validate dimension against constraints
 */
export function validateDimension(
  type: FurnitureType,
  dimension: keyof DimensionRanges,
  value: number
): { valid: boolean; error?: string } {
  const constraints = getConstraints(type).dimensions[dimension]

  if (value < constraints.min) {
    return {
      valid: false,
      error: `${dimension} must be at least ${constraints.min}${constraints.unit}`,
    }
  }

  if (value > constraints.max) {
    return {
      valid: false,
      error: `${dimension} must be at most ${constraints.max}${constraints.unit}`,
    }
  }

  return { valid: true }
}

/**
 * Validate all dimensions at once
 */
export function validateAllDimensions(
  type: FurnitureType,
  dimensions: {
    width: number
    height: number
    depth: number
    plintHeight: number
  }
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  Object.entries(dimensions).forEach(([key, value]) => {
    const result = validateDimension(type, key as keyof DimensionRanges, value)
    if (!result.valid && result.error) {
      errors.push(result.error)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
