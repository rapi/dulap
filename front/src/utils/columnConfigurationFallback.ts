import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { isConfigurationValid } from '~/config/columnConstraints'
import { FurnitureProductType } from '~/hooks/useColumnConfigurationConstraints'

/**
 * Find the first available configuration when the current one becomes invalid
 * Simply returns the first valid configuration found
 * 
 * @param currentType The currently selected configuration that became invalid
 * @param dimensions The column dimensions to validate against
 * @param productType Optional product type for product-specific filtering (e.g., tv-stand excludes split doors)
 * @returns The first valid configuration, or null if none available
 */
export function findNearestAvailableConfiguration(
  currentType: ColumnConfigurationType,
  dimensions: { width: number; height: number; depth: number },
  productType?: FurnitureProductType
): ColumnConfigurationType | null {
  // Filter function for product-specific exclusions
  const isAllowedForProduct = (type: ColumnConfigurationType): boolean => {
    if (productType === 'tv-stand') {
      const metadata = getConfigurationMetadata(type)
      return metadata.doorCount !== 2 // Exclude split doors for TV stands
    }
    return true
  }

  // If current is still valid and allowed for product, return it
  if (isConfigurationValid(currentType, dimensions) && isAllowedForProduct(currentType)) {
    return currentType
  }

  // Find and return the first valid configuration that's allowed for this product
  const firstValid = Object.values(ColumnConfigurationType).find(
    type => isConfigurationValid(type, dimensions) && isAllowedForProduct(type)
  )
  
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
    const validConfig = findNearestAvailableConfiguration(config, dimensions, productType)
    if (!validConfig) {
      console.warn(`No valid configuration found for column with dimensions`, dimensions)
      // Return original if no valid alternative found (shouldn't happen with proper constraints)
      return config
    }
    return validConfig
  })
}
