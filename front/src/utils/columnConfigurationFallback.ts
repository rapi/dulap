import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { isConfigurationValid } from '~/config/columnConstraints'

/**
 * Find the first available configuration when the current one becomes invalid
 * Simply returns the first valid configuration found
 * 
 * @param currentType The currently selected configuration that became invalid
 * @param dimensions The column dimensions to validate against
 * @returns The first valid configuration, or null if none available
 */
export function findNearestAvailableConfiguration(
  currentType: ColumnConfigurationType,
  dimensions: { width: number; height: number; depth: number }
): ColumnConfigurationType | null {
  // If current is still valid, return it
  if (isConfigurationValid(currentType, dimensions)) {
    return currentType
  }

  // Find and return the first valid configuration
  const firstValid = Object.values(ColumnConfigurationType).find(
    type => isConfigurationValid(type, dimensions)
  )
  
  return firstValid || null
}

/**
 * Update column configurations array, replacing invalid configurations with first available alternatives
 * 
 * @param configurations Current column configurations
 * @param dimensions Column dimensions to validate against
 * @returns Updated configurations array with invalid configs replaced
 */
export function updateInvalidConfigurations(
  configurations: ColumnConfigurationType[],
  dimensions: { width: number; height: number; depth: number }
): ColumnConfigurationType[] {
  return configurations.map(config => {
    const validConfig = findNearestAvailableConfiguration(config, dimensions)
    if (!validConfig) {
      console.warn(`No valid configuration found for column with dimensions`, dimensions)
      // Return original if no valid alternative found (shouldn't happen with proper constraints)
      return config
    }
    return validConfig
  })
}
