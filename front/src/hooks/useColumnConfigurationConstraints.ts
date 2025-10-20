import { useMemo } from 'react'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { getValidConfigurations, isConfigurationValid } from '~/config/columnConstraints'

/**
 * Hook to evaluate column configuration constraints
 * 
 * Returns which configurations are valid for given column dimensions
 * 
 * @param columnWidth - Width of a single column
 * @param columnHeight - Height of the column
 * @param columnDepth - Depth of the column
 * @returns Object containing valid configurations and validation function
 */
export function useColumnConfigurationConstraints(
  columnWidth: number,
  columnHeight: number,
  columnDepth: number
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

  // Get all configurations (valid and invalid)
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

