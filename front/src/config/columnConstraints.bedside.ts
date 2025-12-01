import { ColumnConfigurationType, ColumnConfigurationConstraint } from '~/types/columnConfigurationTypes'

/**
 * Constraint definitions for BEDSIDE (nightstand) column configurations
 * 
 * Bedside tables are compact furniture pieces:
 * - Width: 40-80 cm
 * - Height: 30-60 cm
 * - Depth: 35-50 cm
 * - Usually single column
 * - Typically 1-2 drawers or small doors
 */

export const BEDSIDE_COLUMN_CONFIGURATION_CONSTRAINTS: ColumnConfigurationConstraint[] = [
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
    minWidth: 40,
    maxWidth: 80, // Bedside max width
    minHeight: 25,
    maxHeight: 60,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_2_SHELVES,
    minWidth: 40,
    maxWidth: 80,
    minHeight: 60,
    maxHeight: 60, // Limited by bedside max height
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_3_SHELVES,
    minWidth: 40,
    maxWidth: 80,
    minHeight: 80,
    maxHeight: 130,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_4_SHELVES,
    minWidth: 40,
    maxWidth: 80,
    minHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_5_SHELVES,
    minWidth: 40,
    maxWidth: 80,
    minHeight: 140,
    minDepth: 25,
  },

  // ============ SPLIT DOOR CONSTRAINTS ============
  // Note: Split doors are generally not practical for bedside tables due to their compact size
  // But keeping them available with restrictive constraints
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_1_SHELF,
    minWidth: 61,
    maxWidth: 80, // Limited by bedside max width
    minHeight: 25,
    maxHeight: 60,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES,
    minWidth: 61,
    maxWidth: 80,
    minHeight: 45,
    maxHeight: 60, // Limited by bedside max height
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES,
    minWidth: 61,
    maxWidth: 80,
    minHeight: 80,
    maxHeight: 130,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES,
    minWidth: 61,
    maxWidth: 80,
    minHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES,
    minWidth: 61,
    maxWidth: 80,
    minHeight: 140,
    minDepth: 25,
  },
]

/**
 * Helper function to check if a configuration meets bedside constraints
 */
export function isConfigurationValidForBedside(
  configurationType: ColumnConfigurationType,
  dimensions: { width: number; height: number; depth: number }
): boolean {
  const constraint = BEDSIDE_COLUMN_CONFIGURATION_CONSTRAINTS.find(
    (c) => c.configurationType === configurationType
  )

  if (!constraint) {
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
 * Get all valid configurations for given dimensions (bedside)
 */
export function getValidConfigurationsForBedside(dimensions: {
  width: number
  height: number
  depth: number
}): ColumnConfigurationType[] {
  return Object.values(ColumnConfigurationType).filter((type) =>
    isConfigurationValidForBedside(type, dimensions)
  )
}

/**
 * Get valid column counts for bedside based on total width
 * 
 * Bedside tables are typically single column units, but can support multiple columns
 * 
 * Rules:
 * - 40-80 cm: 1 column (typical bedside)
 * - 81-120 cm: 1-2 columns (wider bedside or small dresser)
 * - 121-180 cm: 2 columns
 * - 181-240 cm: 2-3 columns
 * 
 * @param totalWidth Total width of the bedside in cm
 * @returns Object with column counts as keys and validity as boolean values
 */
export function getValidColumnCountsForBedside(totalWidth: number): Record<number, boolean> {
  const validityMap: Record<number, boolean> = {
    1: false,
    2: false,
    3: false,
    4: false,
  }

  if (totalWidth >= 40 && totalWidth <= 80) {
    // 40-80 cm: 1 column (standard bedside)
    validityMap[1] = true
  } else if (totalWidth >= 81 && totalWidth <= 120) {
    // 81-120 cm: 1-2 columns
    validityMap[1] = true
    validityMap[2] = true
  } else if (totalWidth >= 121 && totalWidth <= 180) {
    // 121-180 cm: 2 columns
    validityMap[2] = true
  } else if (totalWidth >= 181 && totalWidth <= 240) {
    // 181-240 cm: 2-3 columns
    validityMap[2] = true
    validityMap[3] = true
  }

  return validityMap
}

