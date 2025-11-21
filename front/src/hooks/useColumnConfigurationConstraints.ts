import { useMemo } from 'react'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { getValidConfigurations, isConfigurationValid } from '~/config/columnConstraints'
import { getValidConfigurationsForStand, isConfigurationValidForStand } from '~/config/columnConstraints.stand'
import { getValidConfigurationsForTVStand, isConfigurationValidForTVStand } from '~/config/columnConstraints.tvstand'
import { getValidConfigurationsForBedside, isConfigurationValidForBedside } from '~/config/columnConstraints.bedside'

export type FurnitureProductType = 'stand' | 'bedside' | 'tv-stand'

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
 * Get the appropriate getValidConfigurations function based on product type
 */
function getValidConfigurationsFunction(productType?: FurnitureProductType) {
  switch (productType) {
    case 'stand':
      return getValidConfigurationsForStand
    case 'tv-stand':
      return getValidConfigurationsForTVStand
    case 'bedside':
      return getValidConfigurationsForBedside
    default:
      return getValidConfigurations
  }
}

/**
 * Hook to evaluate column configuration constraints
 * 
 * Returns which configurations are valid for given column dimensions
 * and product type (uses product-specific validators)
 * 
 * @param columnWidth - Width of a single column
 * @param columnHeight - Height of the column
 * @param columnDepth - Depth of the column
 * @param productType - Type of furniture product (optional, for product-specific validation)
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

  // Get all valid configurations for these dimensions using product-specific validator
  const validConfigurations = useMemo(
    () => {
      const getValidConfigs = getValidConfigurationsFunction(productType)
      return getValidConfigs(dimensions)
    },
    [dimensions, productType]
  )

  // Function to check if a specific configuration is valid using product-specific validator
  const isValid = useMemo(
    () => {
      const validate = getValidationFunction(productType)
      return (configurationType: ColumnConfigurationType) =>
        validate(configurationType, dimensions)
    },
    [dimensions, productType]
  )

  // Get all configurations (no filtering needed - validators handle product-specific rules)
  const allConfigurations = useMemo(
    () => Object.values(ColumnConfigurationType),
    []
  )

  return {
    validConfigurations,
    allConfigurations,
    isValid,
    dimensions,
  }
}

