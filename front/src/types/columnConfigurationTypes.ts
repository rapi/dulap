/**
 * Column Configuration Type System
 * 
 * This file defines all possible column configurations for furniture products.
 * Each configuration specifies what appears inside a vertical column.
 */

/**
 * Enum defining all available column configuration types
 * 
 * Naming convention:
 * - DRAWERS_X: X number of pullout drawers
 * - DOOR_X_SHELVES: Single door with X fixed shelves inside
 * - DOOR_SPLIT_X_SHELVES: Two side-by-side doors with X fixed shelves inside
 */
export enum ColumnConfigurationType {
  // Drawer configurations (1-5 drawers)
  DRAWERS_1 = 'DRAWERS_1',
  DRAWERS_2 = 'DRAWERS_2',
  DRAWERS_3 = 'DRAWERS_3',
  DRAWERS_4 = 'DRAWERS_4',
  DRAWERS_5 = 'DRAWERS_5',

  // Single door with shelves (1-5 shelves)
  DOOR_1_SHELF = 'DOOR_1_SHELF',
  DOOR_2_SHELVES = 'DOOR_2_SHELVES',
  DOOR_3_SHELVES = 'DOOR_3_SHELVES',
  DOOR_4_SHELVES = 'DOOR_4_SHELVES',
  DOOR_5_SHELVES = 'DOOR_5_SHELVES',

  // Split doors (left-right) with shelves (1-5 shelves)
  DOOR_SPLIT_1_SHELF = 'DOOR_SPLIT_1_SHELF',
  DOOR_SPLIT_2_SHELVES = 'DOOR_SPLIT_2_SHELVES',
  DOOR_SPLIT_3_SHELVES = 'DOOR_SPLIT_3_SHELVES',
  DOOR_SPLIT_4_SHELVES = 'DOOR_SPLIT_4_SHELVES',
  DOOR_SPLIT_5_SHELVES = 'DOOR_SPLIT_5_SHELVES',
}

/**
 * Hinge positioning rules for door configurations
 */
export type HingePositionRule = 'even' | 'offset-middle'

/**
 * Metadata about each configuration type
 */
export interface ColumnConfigurationMetadata {
  type: ColumnConfigurationType
  label: string // Translation key
  description: string // Human-readable description
  hasDrawers: boolean
  hasDoors: boolean
  doorCount: 0 | 1 | 2 // 0 = no doors, 1 = single door, 2 = split doors
  shelfCount: number // Number of internal shelves/sections
  drawerCount: number // Number of pullout drawers
  hingeCount?: number // Number of hinges per door (undefined for drawer-only configs)
  hingePositionRule?: HingePositionRule // How to distribute hinges vertically
}

/**
 * Configuration metadata map for all types
 */
export const COLUMN_CONFIGURATION_METADATA: Record<ColumnConfigurationType, ColumnConfigurationMetadata> = {
  // Drawers
  [ColumnConfigurationType.DRAWERS_1]: {
    type: ColumnConfigurationType.DRAWERS_1,
    label: 'homepage.configurator.columnConfig.drawers1',
    description: '1 Drawer',
    hasDrawers: true,
    hasDoors: false,
    doorCount: 0,
    shelfCount: 0,
    drawerCount: 1,
  },
  [ColumnConfigurationType.DRAWERS_2]: {
    type: ColumnConfigurationType.DRAWERS_2,
    label: 'homepage.configurator.columnConfig.drawers2',
    description: '2 Drawers',
    hasDrawers: true,
    hasDoors: false,
    doorCount: 0,
    shelfCount: 0,
    drawerCount: 2,
  },
  [ColumnConfigurationType.DRAWERS_3]: {
    type: ColumnConfigurationType.DRAWERS_3,
    label: 'homepage.configurator.columnConfig.drawers3',
    description: '3 Drawers',
    hasDrawers: true,
    hasDoors: false,
    doorCount: 0,
    shelfCount: 0,
    drawerCount: 3,
  },
  [ColumnConfigurationType.DRAWERS_4]: {
    type: ColumnConfigurationType.DRAWERS_4,
    label: 'homepage.configurator.columnConfig.drawers4',
    description: '4 Drawers',
    hasDrawers: true,
    hasDoors: false,
    doorCount: 0,
    shelfCount: 0,
    drawerCount: 4,
  },
  [ColumnConfigurationType.DRAWERS_5]: {
    type: ColumnConfigurationType.DRAWERS_5,
    label: 'homepage.configurator.columnConfig.drawers5',
    description: '5 Drawers',
    hasDrawers: true,
    hasDoors: false,
    doorCount: 0,
    shelfCount: 0,
    drawerCount: 5,
  },

  // Single door with shelves
  [ColumnConfigurationType.DOOR_1_SHELF]: {
    type: ColumnConfigurationType.DOOR_1_SHELF,
    label: 'homepage.configurator.columnConfig.door1Shelf',
    description: '1 Door with 1 Shelf',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 1,
    shelfCount: 1,
    drawerCount: 0,
    hingeCount: 2,
    hingePositionRule: 'even',
  },
  [ColumnConfigurationType.DOOR_2_SHELVES]: {
    type: ColumnConfigurationType.DOOR_2_SHELVES,
    label: 'homepage.configurator.columnConfig.door2Shelves',
    description: '1 Door with 2 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 1,
    shelfCount: 2,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'even',
  },
  [ColumnConfigurationType.DOOR_3_SHELVES]: {
    type: ColumnConfigurationType.DOOR_3_SHELVES,
    label: 'homepage.configurator.columnConfig.door3Shelves',
    description: '1 Door with 3 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 1,
    shelfCount: 3,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'offset-middle',
  },
  [ColumnConfigurationType.DOOR_4_SHELVES]: {
    type: ColumnConfigurationType.DOOR_4_SHELVES,
    label: 'homepage.configurator.columnConfig.door4Shelves',
    description: '1 Door with 4 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 1,
    shelfCount: 4,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'even',
  },
  [ColumnConfigurationType.DOOR_5_SHELVES]: {
    type: ColumnConfigurationType.DOOR_5_SHELVES,
    label: 'homepage.configurator.columnConfig.door5Shelves',
    description: '1 Door with 5 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 1,
    shelfCount: 5,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'offset-middle',
  },

  // Split doors with shelves
  [ColumnConfigurationType.DOOR_SPLIT_1_SHELF]: {
    type: ColumnConfigurationType.DOOR_SPLIT_1_SHELF,
    label: 'homepage.configurator.columnConfig.doorSplit1Shelf',
    description: '2 Doors (Split) with 1 Shelf',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 2,
    shelfCount: 1,
    drawerCount: 0,
    hingeCount: 2,
    hingePositionRule: 'even',
  },
  [ColumnConfigurationType.DOOR_SPLIT_2_SHELVES]: {
    type: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES,
    label: 'homepage.configurator.columnConfig.doorSplit2Shelves',
    description: '2 Doors (Split) with 2 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 2,
    shelfCount: 2,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'even',
  },
  [ColumnConfigurationType.DOOR_SPLIT_3_SHELVES]: {
    type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES,
    label: 'homepage.configurator.columnConfig.doorSplit3Shelves',
    description: '2 Doors (Split) with 3 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 2,
    shelfCount: 3,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'offset-middle',
  },
  [ColumnConfigurationType.DOOR_SPLIT_4_SHELVES]: {
    type: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES,
    label: 'homepage.configurator.columnConfig.doorSplit4Shelves',
    description: '2 Doors (Split) with 4 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 2,
    shelfCount: 4,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'even',
  },
  [ColumnConfigurationType.DOOR_SPLIT_5_SHELVES]: {
    type: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES,
    label: 'homepage.configurator.columnConfig.doorSplit5Shelves',
    description: '2 Doors (Split) with 5 Shelves',
    hasDrawers: false,
    hasDoors: true,
    doorCount: 2,
    shelfCount: 5,
    drawerCount: 0,
    hingeCount: 3,
    hingePositionRule: 'offset-middle',
  },
}

/**
 * Helper function to get metadata for a configuration type
 */
export function getConfigurationMetadata(type: ColumnConfigurationType): ColumnConfigurationMetadata {
  return COLUMN_CONFIGURATION_METADATA[type]
}

/**
 * Helper function to get all configuration types
 */
export function getAllConfigurationTypes(): ColumnConfigurationType[] {
  return Object.values(ColumnConfigurationType)
}

/**
 * Helper function to check if a configuration has drawers
 */
export function hasDrawers(type: ColumnConfigurationType): boolean {
  return COLUMN_CONFIGURATION_METADATA[type].hasDrawers
}

/**
 * Helper function to check if a configuration has doors
 */
export function hasDoors(type: ColumnConfigurationType): boolean {
  return COLUMN_CONFIGURATION_METADATA[type].hasDoors
}

/**
 * Helper function to get drawer count
 */
export function getDrawerCount(type: ColumnConfigurationType): number {
  return COLUMN_CONFIGURATION_METADATA[type].drawerCount
}

/**
 * Helper function to get shelf count
 */
export function getShelfCount(type: ColumnConfigurationType): number {
  return COLUMN_CONFIGURATION_METADATA[type].shelfCount
}

/**
 * Future: Interface for mixed configurations (e.g., 1 drawer on top + 1 door on bottom)
 * This is prepared for future expansion but not implemented yet
 */
export interface MixedColumnConfiguration {
  id: string
  segments: Array<{
    type: 'drawer' | 'door' | 'shelf'
    count: number
    heightRatio: number // Proportion of column height (0-1)
  }>
}

/**
 * Type for column configuration constraint rule
 */
export interface ColumnConfigurationConstraint {
  configurationType: ColumnConfigurationType
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  minDepth?: number
  maxDepth?: number
  customRule?: (dimensions: { width: number; height: number; depth: number }) => boolean
}

