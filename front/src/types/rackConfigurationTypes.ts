/**
 * Rack Configuration Type System
 *
 * Zone-based configuration system specifically designed for racks.
 * Racks focus on shelving with optional doors and drawers for versatile storage.
 */

/**
 * Types of zones available in a rack column
 */
export enum RackZoneType {
  // Open shelving
  SHELVES = 'SHELVES', // Open adjustable shelves
  SHELVES_FIXED = 'SHELVES_FIXED', // Fixed shelves

  // Storage zones
  DRAWERS = 'DRAWERS', // Pull-out drawers

  // Special zones
  EMPTY = 'EMPTY', // Open space
}

/**
 * Template definition for a zone (before calculation)
 * Uses proportions instead of fixed heights
 */
export interface RackZoneTemplate {
  type: RackZoneType
  heightProportion: number // 0-100, sum of all zones should be 100
  minHeight?: number // Minimum height in cm for this zone

  // For shelves
  shelfMinSpacing?: number // Minimum space between shelves
  shelfMaxSpacing?: number // Maximum space between shelves
  shelfOptimalSpacing?: number // Preferred spacing (default: average of min/max)

  // For drawers
  drawerMinHeight?: number // Minimum drawer height
  drawerMaxHeight?: number // Maximum drawer height
  drawerOptimalHeight?: number // Preferred drawer height (default: 20cm)
}

/**
 * Calculated zone configuration (after applying template to specific height)
 */
export interface RackZone {
  type: RackZoneType
  height: number // Calculated height in cm

  // Calculated properties for shelves
  shelfCount?: number // Number of shelves in zone
  shelfSpacing?: number // Distance between shelves

  // Calculated properties for drawers
  drawerCount?: number // Number of drawers
  drawerHeights?: number[] // Individual drawer heights
}

/**
 * Door configuration for zones
 */
export interface RackDoorConfig {
  zoneIndices: number[] // Which zones this door covers (0-based)
  type: 'single' | 'split' // Door type
  openingSide?: 'left' | 'right' // For single doors
}

/**
 * Complete configuration for a rack column
 */
export interface RackColumnConfiguration {
  zones: RackZone[]
  totalHeight: number // Internal height (excluding plinth)
  doors?: RackDoorConfig[] // Door configurations

  // Metadata
  templateId?: string // If based on a template
  customName?: string // User-given name
}

/**
 * Template definition for quick configuration
 */
export interface RackTemplate {
  id: string
  name: string // Display name
  description: string // Detailed description
  zones: RackZoneTemplate[] // Zone templates with proportions
  doors?: RackDoorConfig[] // Optional door configurations
  minHeight: number // Minimum column height required
  maxHeight?: number // Maximum column height (optional)
  minWidth: number // Minimum column width required
  maxWidth?: number // Maximum column width (optional)
  tags?: string[] // Categories like 'storage', 'display', 'office'
  icon?: string // Icon identifier for UI
  extraCost?: number // For price calculation
}

/**
 * Validation result for configurations
 */
export interface RackConfigValidation {
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
export interface RackColumnConfigurationExtended
  extends RackColumnConfiguration {
  zonePositions: ZonePosition[]
  isValid: boolean
  validationResult: RackConfigValidation
}
