import { ColumnConfigurationType, ColumnConfigurationConstraint } from '~/types/columnConfigurationTypes'

/**
 * Constraint definitions for column configurations
 * 
 * These rules determine which configurations are available based on
 * column dimensions (width, height, depth).
 * 
 * Add or modify constraints here to control configuration availability.
 */

export const COLUMN_CONFIGURATION_CONSTRAINTS: ColumnConfigurationConstraint[] = [
  // ============ DRAWER CONSTRAINTS ============
  {
    configurationType: ColumnConfigurationType.DRAWERS_1,
    minWidth: 40,
    minHeight: 20,
    maxHeight: 40,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DRAWERS_2,
    minWidth: 40,
    minHeight: 40,
    maxHeight: 60,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DRAWERS_3,
    minWidth: 40,
    minHeight: 60,
    maxHeight: 100,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DRAWERS_4,
    minWidth: 40,
    minHeight: 80,
    maxHeight: 130,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DRAWERS_5,
    minWidth: 40,
    minHeight: 100,
    minDepth: 25,
  },

  // ============ SINGLE DOOR CONSTRAINTS ============
  {
    configurationType: ColumnConfigurationType.DOOR_1_SHELF,
    minWidth: 40, // Doors need more width than drawers
    maxWidth: 60,
    minHeight: 25,
    maxHeight: 60,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_2_SHELVES,
    minWidth: 40,
    maxWidth: 60,
    minHeight: 45,
    maxHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_3_SHELVES,
    minWidth: 40,
    maxWidth: 60,
    minHeight: 80,
    maxHeight: 130,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_4_SHELVES,
    minWidth: 40,
    maxWidth: 60,
    minHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_5_SHELVES,
    minWidth: 40,
    maxWidth: 60,
    minHeight: 140,
    minDepth: 25,
  },

  // ============ SPLIT DOOR CONSTRAINTS ============
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_1_SHELF,
    minWidth: 61,
    maxWidth: 100,
    minHeight: 25,
    maxHeight: 60,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES,
    minWidth: 61,
    maxWidth: 100,
    minHeight: 45,
    maxHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES,
    minWidth: 61,
    maxWidth: 100,
    minHeight: 80,
    maxHeight: 130,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES,
    minWidth: 61,
    maxWidth: 100,
    minHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES,
    minWidth: 61,
    maxWidth: 100,
    minHeight: 140,
    minDepth: 25,
  },
]

/**
 * Helper function to check if a configuration meets its constraints
 */
export function isConfigurationValid(
  configurationType: ColumnConfigurationType,
  dimensions: { width: number; height: number; depth: number }
): boolean {
  const constraint = COLUMN_CONFIGURATION_CONSTRAINTS.find(
    (c) => c.configurationType === configurationType
  )

  if (!constraint) {
    // If no constraint defined, allow by default
    return true
  }

  const { width, height, depth } = dimensions

  // Check min/max width
  if (constraint.minWidth !== undefined && width < constraint.minWidth) {
    return false
  }
  if (constraint.maxWidth !== undefined && width > constraint.maxWidth) {
    return false
  }

  // Check min/max height
  if (constraint.minHeight !== undefined && height < constraint.minHeight) {
    return false
  }
  if (constraint.maxHeight !== undefined && height > constraint.maxHeight) {
    return false
  }

  // Check min/max depth
  if (constraint.minDepth !== undefined && depth < constraint.minDepth) {
    return false
  }
  if (constraint.maxDepth !== undefined && depth > constraint.maxDepth) {
    return false
  }

  // Check custom rule if defined
  if (constraint.customRule && !constraint.customRule(dimensions)) {
    return false
  }

  return true
}

/**
 * Get all valid configurations for given dimensions
 */
export function getValidConfigurations(dimensions: {
  width: number
  height: number
  depth: number
}): ColumnConfigurationType[] {
  return Object.values(ColumnConfigurationType).filter((type) =>
    isConfigurationValid(type, dimensions)
  )
}

/**
 * Get valid column counts for stand (chest of drawers) based on total width
 * 
 * Rules:
 * - 50-84 cm: 1 column
 * - 85-104 cm: 1-2 columns
 * - 105-149 cm: 2 columns
 * - 150-205 cm: 2-3 columns
 * - 206-270 cm: 3 columns
 * 
 * @param totalWidth Total width of the stand in cm
 * @returns Object with column counts as keys and validity as boolean values
 */
export function getValidColumnCountsForStand(totalWidth: number): Record<number, boolean> {
  const validityMap: Record<number, boolean> = {
    1: false,
    2: false,
    3: false,
    4: false,
  }

  if (totalWidth >= 50 && totalWidth <= 84) {
    // 50-84 cm: only 1 column
    validityMap[1] = true
  } else if (totalWidth >= 85 && totalWidth <= 104) {
    // 85-104 cm: 1-2 columns
    validityMap[1] = true
    validityMap[2] = true
  } else if (totalWidth >= 105 && totalWidth <= 149) {
    // 105-149 cm: 2 columns
    validityMap[2] = true
  } else if (totalWidth >= 150 && totalWidth <= 205) {
    // 150-205 cm: 2-3 columns
    validityMap[2] = true
    validityMap[3] = true
  } else if (totalWidth >= 206 && totalWidth <= 270) {
    // 206-270 cm: 3 columns
    validityMap[3] = true
  }

  return validityMap
}

