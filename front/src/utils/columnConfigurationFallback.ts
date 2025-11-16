import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
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
 * Find the first available configuration when the current one becomes invalid
 * Simply returns the first valid configuration found
 * 
 * @param currentType The currently selected configuration that became invalid
 * @param dimensions The column dimensions to validate against
 * @param productType Optional product type for product-specific validation (stand, tv-stand, etc.)
 * @param preferredDrawerCount Optional preferred drawer count to prioritize
 * @returns The first valid configuration, or null if none available
 */
export function findNearestAvailableConfiguration(
  currentType: ColumnConfigurationType,
  dimensions: { width: number; height: number; depth: number },
  productType?: FurnitureProductType,
  preferredDrawerCount?: number
): ColumnConfigurationType | null {
  const isValid = getValidationFunction(productType)

  // If current is still valid, return it
  if (isValid(currentType, dimensions)) {
    return currentType
  }

  const allTypes = Object.values(ColumnConfigurationType)

  // If preferred drawer count is specified, try to find a configuration with that drawer count first
  if (preferredDrawerCount !== undefined) {
    const preferredType = allTypes.find(type => {
      const metadata = getConfigurationMetadata(type)
      return metadata?.drawerCount === preferredDrawerCount && isValid(type, dimensions)
    })
    
    if (preferredType) {
      return preferredType
    }
  }

  // Find and return the first valid configuration
  const firstValid = allTypes.find(type => isValid(type, dimensions))
  
  return firstValid || null
}

/**
 * Update column configurations array, replacing invalid configurations with first available alternatives
 * 
 * @param configurations Current column configurations
 * @param dimensions Column dimensions to validate against
 * @param productType Optional product type for product-specific filtering
 * @returns Updated configurations array with invalid configs replaced
 */
export function updateInvalidConfigurations(
  configurations: ColumnConfigurationType[],
  dimensions: { width: number; height: number; depth: number },
  productType?: FurnitureProductType
): ColumnConfigurationType[] {
  return configurations.map(config => {
    // Get current drawer count to preserve it if possible
    const currentMetadata = getConfigurationMetadata(config)
    const currentDrawerCount = currentMetadata?.drawerCount
    
    const validConfig = findNearestAvailableConfiguration(config, dimensions, productType, currentDrawerCount)
    if (!validConfig) {
      console.warn(`No valid configuration found for column with dimensions`, dimensions)
      // Return original if no valid alternative found (shouldn't happen with proper constraints)
      return config
    }
    return validConfig
  })
}
