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
}

export interface PricingFormula {
  basePrice: number
  perSection: number
  perCmWidth: number
  perCmHeightAbove: { threshold: number; rate: number }
  perCmDepthAbove: { threshold: number; rate: number }
  premiumGuidesPerSection: number
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
    width: { min: 50, max: 120, default: 80, unit: 'cm' },
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
      // Height >= 110cm: only 5 sections allowed
      // Height < 110cm: 3-4 sections allowed
      return height >= 110 ? [5] : [3, 4]
    },
  },

  columns: {
    min: 1,
    max: 10,
    default: 1,
    allowCustomConfiguration: true,
  },

  pricing: {
    basePrice: 600,
    perSection: 600,
    perCmWidth: 20,
    perCmHeightAbove: { threshold: 190, rate: 4.5 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    premiumGuidesPerSection: 390,
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
    basePrice: 600,
    perSection: 600,
    perCmWidth: 20,
    perCmHeightAbove: { threshold: 190, rate: 4.5 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    premiumGuidesPerSection: 390,
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
    width: { min: 80, max: 240, default: 160, unit: 'cm' },
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
    max: 10,
    default: 2,
    allowCustomConfiguration: true,
  },

  pricing: {
    basePrice: 300, // Lower base price for TV stands
    perSection: 600,
    perCmWidth: 20,
    perCmHeightAbove: { threshold: 190, rate: 4.5 },
    perCmDepthAbove: { threshold: 30, rate: 8 },
    premiumGuidesPerSection: 390,
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
// CONSTRAINT REGISTRY
// ============================================================================

export const FURNITURE_CONSTRAINTS = {
  stand: STAND_CONSTRAINTS,
  bedside: BEDSIDE_CONSTRAINTS,
  'tv-stand': TV_STAND_CONSTRAINTS,
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
  sections: number,
  hasPremiumGuides: boolean = false
): number {
  const { pricing } = getConstraints(type)

  const fittingsPrice = hasPremiumGuides
    ? sections * pricing.premiumGuidesPerSection
    : 0

  const round10 = (n: number): number => Math.round(n / 10) * 10

  return round10(
    Math.round(
      (pricing.basePrice +
        sections * pricing.perSection +
        dimensions.width * pricing.perCmWidth +
        (dimensions.height - pricing.perCmHeightAbove.threshold) *
          pricing.perCmHeightAbove.rate +
        (dimensions.depth - pricing.perCmDepthAbove.threshold) *
          pricing.perCmDepthAbove.rate +
        fittingsPrice) *
        pricing.vatMultiplier
    )
  )
}

/**
 * Get available sections based on dimensions
 */
export function getAvailableSections(
  type: FurnitureType,
  dimensions: { width: number; height: number }
): number[] {
  const { sections } = getConstraints(type)

  if (sections.rule === 'auto') {
    // For auto rule, return the single calculated value
    const calculated = sections.autoCalculate?.(dimensions) ?? sections.default
    return [calculated]
  }

  if (sections.getAvailableSections) {
    return sections.getAvailableSections(dimensions)
  }

  // Fallback: return all sections from min to max
  return Array.from(
    { length: sections.max - sections.min + 1 },
    (_, i) => sections.min + i
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
