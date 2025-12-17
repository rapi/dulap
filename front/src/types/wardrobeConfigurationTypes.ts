/**
 * Wardrobe Configuration Type System
 *
 * Zone-based configuration system specifically designed for wardrobes.
 * Unlike stands/dressers that focus on drawers and shelves,
 * wardrobes are designed around functional zones for different clothing types.
 */

/**
 * Types of zones available in a wardrobe column
 */
export enum WardrobeZoneType {
  // Hanging zones
  HANGING_LONG = 'HANGING_LONG', // 170cm+ for dresses, coats
  HANGING_MEDIUM = 'HANGING_MEDIUM', // 90-120cm for jackets, shirts
  HANGING_SHORT = 'HANGING_SHORT', // 70-90cm for folded pants
  HANGING_DOUBLE = 'HANGING_DOUBLE', // Two rods stacked

  // Storage zones
  SHELVES = 'SHELVES', // Adjustable shelves
  SHELVES_FIXED = 'SHELVES_FIXED', // Fixed shelves
  DRAWERS = 'DRAWERS', // Pull-out drawers
  DRAWERS_WITH_DIVIDERS = 'DRAWERS_WITH_DIVIDERS', // Drawers with organizers

  // Special zones
  SHOE_RACK = 'SHOE_RACK', // Angled shoe storage
  ACCESSORIES = 'ACCESSORIES', // Ties, belts, jewelry organizers
  EMPTY = 'EMPTY', // Open space
}

/**
 * Configuration for a single zone within a column
 */
export interface WardrobeZone {
  type: WardrobeZoneType
  height: number // Height in cm

  // Optional zone-specific properties
  rodHeight?: number // Distance from zone bottom to hanging rod
  shelfCount?: number // Number of shelves in zone
  shelfSpacing?: number // Distance between shelves
  addShelfAtTheTop?: boolean // Add a shelf at the top of the zone
  drawerCount?: number // Number of drawers
  drawerHeights?: number[] // Individual drawer heights
  accessories?: string[] // Types of accessories (ties, belts, etc.)
}

/**
 * Complete configuration for a wardrobe column
 */
export interface WardrobeColumnConfiguration {
  zones: WardrobeZone[]
  totalHeight: number // Internal height (excluding plinth)
  doorType: 'single' | 'split'
  doorOpeningSide?: 'left' | 'right' // For single doors
  hasDoor?: boolean // If false, column is open (no doors). Defaults to true.

  // Metadata
  templateId?: string // If based on a template
  customName?: string // User-given name
}

/**
 * Template definition for quick configuration
 */
export interface WardrobeTemplate {
  id: string
  name: string // Display name
  description: string // Detailed description
  zones: WardrobeZone[]
  minHeight: number // Minimum column height required
  maxHeight?: number // Maximum column height (optional)
  minWidth: number // Minimum column width required
  maxWidth?: number // Maximum column width (optional)
  tags?: string[] // Categories like 'mens', 'womens', 'kids'
  icon?: string // Icon identifier for UI
  extraCost?: number // For priceCalculation
}

/**
 * Validation result for configurations
 */
export interface WardrobeConfigValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Helper type for zone position calculations
 */
export interface ZonePosition {
  zoneIndex: number
  startY: number // Y position from bottom
  endY: number // Y position top
  centerY: number // Center position for elements
}

/**
 * Extended configuration with calculated properties
 */
export interface WardrobeColumnConfigurationExtended
  extends WardrobeColumnConfiguration {
  zonePositions: ZonePosition[]
  isValid: boolean
  validationResult: WardrobeConfigValidation
}
