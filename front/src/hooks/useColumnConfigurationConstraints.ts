import { useMemo } from 'react'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { getValidConfigurations, isConfigurationValid } from '~/config/columnConstraints'

export type FurnitureProductType = 'stand' | 'bedside' | 'tv-stand'

/**
 * Hook to evaluate column configuration constraints
 * 
 * Returns which configurations are valid for given column dimensions
 * and product type (filters out split doors for TV stands)
 * 
 * @param columnWidth - Width of a single column
 * @param columnHeight - Height of the column
 * @param columnDepth - Depth of the column
 * @param productType - Type of furniture product (optional, for product-specific filtering)
 * @returns Object containing valid configurations and validation function
 */
export function useColumnConfigurationConstraints(
  columnWidth: number,
  columnHeight: number,
  columnDepth: number,
  productType?: FurnitureProductType
) {
  const dimensions = useMemo(
    () => ({
      width: columnWidth,
      height: columnHeight,
      depth: columnDepth,
    }),
    [columnWidth, columnHeight, columnDepth]
  )

  // Get all valid configurations for these dimensions
  const validConfigurations = useMemo(
    () => getValidConfigurations(dimensions),
    [dimensions]
  )

  // Function to check if a specific configuration is valid
  const isValid = useMemo(
    () => (configurationType: ColumnConfigurationType) =>
      isConfigurationValid(configurationType, dimensions),
    [dimensions]
  )

  // Get all configurations (valid and invalid), with product-specific filtering
  const allConfigurations = useMemo(
    () => {
      const allTypes = Object.values(ColumnConfigurationType)
      
      // For TV stands, exclude split door configurations (doorCount === 2)
      if (productType === 'tv-stand') {
        return allTypes.filter((type) => {
          const metadata = getConfigurationMetadata(type)
          return metadata.doorCount !== 2 // Exclude split doors
        })
      }
      
      return allTypes
    },
    [productType]
  )

  return {
    validConfigurations,
    allConfigurations,
    isValid,
    dimensions,
  }
}

