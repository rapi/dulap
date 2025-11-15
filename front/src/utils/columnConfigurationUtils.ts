import {
  ColumnConfigurationType,
  getConfigurationMetadata,
  hasDrawers,
  getDrawerCount,
} from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { findNearestAvailableConfiguration } from './columnConfigurationFallback'
import { isConfigurationValid } from '~/config/columnConstraints'
import { isConfigurationValidForStand } from '~/config/columnConstraints.stand'
import { isConfigurationValidForTVStand } from '~/config/columnConstraints.tvstand'
import { isConfigurationValidForBedside } from '~/config/columnConstraints.bedside'
import { FurnitureProductType } from '~/hooks/useColumnConfigurationConstraints'

/**
 * Get the appropriate validation function based on product type
 */
function getValidationFunction(productType?: FurnitureProductType) {
  switch (productType) {
    case 'stand':
      return isConfigurationValidForStand
    case 'tv-stand':
      return isConfigurationValidForTVStand
    case 'bedside':
      return isConfigurationValidForBedside
    default:
      return isConfigurationValid
  }
}

/**
 * Maps drawer count to corresponding ColumnConfigurationType
 */
export const DRAWER_TYPE_MAP: Record<number, ColumnConfigurationType> = {
  1: ColumnConfigurationType.DRAWERS_1,
  2: ColumnConfigurationType.DRAWERS_2,
  3: ColumnConfigurationType.DRAWERS_3,
  4: ColumnConfigurationType.DRAWERS_4,
  5: ColumnConfigurationType.DRAWERS_5,
}

/**
 * Gets the drawer count from existing columns with drawers
 * Returns the first found drawer count, or default (3) if none exist
 */
export function getTargetDrawerCountFromExisting(
  configurations: ColumnConfigurationWithOptions[],
  defaultCount: number = 3
): number {
  const existingDrawerColumns = configurations
    .filter((config) => config && hasDrawers(config.type))
    .map((config) => getDrawerCount(config!.type))

  return existingDrawerColumns.length > 0 ? existingDrawerColumns[0] : defaultCount
}

/**
 * Creates configuration for an existing column, preserving it if valid,
 * or finding the nearest valid alternative
 */
export function createConfigurationForExistingColumn(
  existingConfig: ColumnConfigurationWithOptions,
  dimensions: { width: number; height: number; depth: number },
  productType?: FurnitureProductType,
  columnIndex?: number,
  totalColumns?: number
): ColumnConfigurationWithOptions {
  const isValid = getValidationFunction(productType)
  
  // If still valid, preserve the configuration
  if (isValid(existingConfig.type, dimensions)) {
    const metadata = getConfigurationMetadata(existingConfig.type)
    // If it's a single door and doorOpeningSide is not set, apply the default based on position
    if (metadata?.doorCount === 1 && !existingConfig.doorOpeningSide && columnIndex !== undefined && totalColumns !== undefined) {
    return {
        ...existingConfig,
        doorOpeningSide: getDefaultDoorOpeningSide(columnIndex, totalColumns)
      }
    }
    
    return existingConfig
  }

  // Find nearest valid alternative
  const nearestType =
    findNearestAvailableConfiguration(existingConfig.type, dimensions, productType) ||
    existingConfig.type

  const metadata = getConfigurationMetadata(nearestType)
  
  // Calculate default door opening side based on column position
  const doorOpeningSide = metadata?.doorCount === 1
    ? (existingConfig.doorOpeningSide || 
       (columnIndex !== undefined && totalColumns !== undefined 
         ? getDefaultDoorOpeningSide(columnIndex, totalColumns)
         : 'left'))
    : undefined

  return { type: nearestType, doorOpeningSide }
}

/**
 * Creates configuration for a new column, syncing with existing drawer columns
 */
export function createConfigurationForNewColumn(
  existingConfigurations: ColumnConfigurationWithOptions[],
  dimensions: { width: number; height: number; depth: number },
  defaultDrawerCount: number = 3,
  productType?: FurnitureProductType,
  columnIndex?: number,
  totalColumns?: number
): ColumnConfigurationWithOptions {
  const targetDrawerCount = getTargetDrawerCountFromExisting(
    existingConfigurations,
    defaultDrawerCount
  )

  const defaultType = DRAWER_TYPE_MAP[targetDrawerCount] || ColumnConfigurationType.DRAWERS_3
  const nearestType =
    findNearestAvailableConfiguration(defaultType, dimensions, productType) || defaultType

  const metadata = getConfigurationMetadata(nearestType)
  
  // Calculate default door opening side based on column position for single door configurations
  const doorOpeningSide = metadata?.doorCount === 1 && columnIndex !== undefined && totalColumns !== undefined
    ? getDefaultDoorOpeningSide(columnIndex, totalColumns)
    : undefined

  return { type: nearestType, doorOpeningSide }
}

/**
 * Validates and updates invalid configurations when dimensions change
 * Preserves user's explicit doorOpeningSide choice, or applies position-based default
 */
export function validateAndUpdateConfigurations(
  configurations: ColumnConfigurationWithOptions[],
  dimensions: { width: number; height: number; depth: number },
  productType?: FurnitureProductType
): ColumnConfigurationWithOptions[] {
  const isValid = getValidationFunction(productType)
  
  const needsUpdate = configurations.some(
    (config) => !isValid(config.type, dimensions)
  )

  if (!needsUpdate) {
    return configurations
  }

  const totalColumns = configurations.length

  return configurations.map((config, columnIndex) => {
    const valid = isValid(config.type, dimensions)
    
    if (valid) {
      return config
    }

    const nearestType =
      findNearestAvailableConfiguration(config.type, dimensions, productType) || config.type

    const metadata = getConfigurationMetadata(nearestType)
    
    // Preserve user's choice, or use position-based default if not set
    const doorOpeningSide = metadata?.doorCount === 1 
      ? (config.doorOpeningSide || getDefaultDoorOpeningSide(columnIndex, totalColumns))
      : undefined

    return { type: nearestType, doorOpeningSide }
  })
}

/**
 * Calculates the default door opening side based on column position
 * Rules:
 * - First column (index 0): 'left' opening side (handle on right)
 * - Last column: 'right' opening side (handle on left)
 * - All other columns: 'right' opening side (handle on left)
 */
export function getDefaultDoorOpeningSide(
  columnIndex: number,
  totalColumns: number
): 'left' | 'right' {
  if (columnIndex === 0) {
    // First column: handle on right = 'left' opening side
    return 'left'
  } else if (columnIndex === totalColumns - 1) {
    // Last column: handle on left = 'right' opening side
    return 'right'
  }
  
  // All middle columns: handle on left = 'right' opening side
  return 'right'
}

/**
 * Synchronizes drawer counts across all columns with drawers
 * When a drawer configuration is selected, all other columns with drawers
 * are updated to match the selected drawer count
 * Preserves user's explicit doorOpeningSide choice, or applies position-based default
 */
export function synchronizeDrawerCounts(
  configurations: ColumnConfigurationWithOptions[],
  changedColumnIndex: number,
  newDrawerCount: number,
  isValid: (type: ColumnConfigurationType) => boolean
): ColumnConfigurationWithOptions[] {
  const targetType = DRAWER_TYPE_MAP[newDrawerCount]

  if (!targetType) {
    return configurations
  }

  const totalColumns = configurations.length

  return configurations.map((config, index) => {
    // Skip the column that was just changed
    if (index === changedColumnIndex) {
      return config
    }

    // Only update columns that have drawers
    if (!config || !hasDrawers(config.type)) {
      return config
    }

    // Only update if the target configuration is valid for this column
    if (!isValid(targetType)) {
      return config
    }

    const targetMetadata = getConfigurationMetadata(targetType)
    
    // Preserve user's choice, or use position-based default if not set
    const targetDoorOpeningSide = targetMetadata.doorCount === 1 
      ? (config.doorOpeningSide || getDefaultDoorOpeningSide(index, totalColumns))
      : undefined

    return { type: targetType, doorOpeningSide: targetDoorOpeningSide }
  })
}

