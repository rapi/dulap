import { ColumnConfigurationType, ColumnConfigurationConstraint, getConfigurationMetadata } from '~/types/columnConfigurationTypes'

/**
 * Constraint definitions for TV STAND column configurations
 * 
 * TV Stand specific rules:
 * - Drawer heights: 30-40cm for 1 drawer, 45-60cm for 2 drawers
 * - Width > 50cm: only drawers available (no doors)
 * - Width <= 50cm: drawers AND single doors available
 * - NO split doors (double doors) allowed for TV stands
 */

export const TVSTAND_COLUMN_CONFIGURATION_CONSTRAINTS: ColumnConfigurationConstraint[] = [
  // ============ DRAWER CONSTRAINTS ============
  {
    configurationType: ColumnConfigurationType.DRAWERS_1,
    minWidth: 40,
    minHeight: 30,
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
  // For TV stands: doors only available when width <= 50cm
  {
    configurationType: ColumnConfigurationType.DOOR_1_SHELF,
    minWidth: 40,
    maxWidth: 50, // TV stand specific: max 50cm for doors
    minHeight: 25,
    maxHeight: 60,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_2_SHELVES,
    minWidth: 40,
    maxWidth: 50, // TV stand specific: max 50cm for doors
    minHeight: 45,
    maxHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_3_SHELVES,
    minWidth: 40,
    maxWidth: 50, // TV stand specific: max 50cm for doors
    minHeight: 80,
    maxHeight: 130,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_4_SHELVES,
    minWidth: 40,
    maxWidth: 50, // TV stand specific: max 50cm for doors
    minHeight: 105,
    minDepth: 25,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_5_SHELVES,
    minWidth: 40,
    maxWidth: 50, // TV stand specific: max 50cm for doors
    minHeight: 140,
    minDepth: 25,
  },

  // ============ SPLIT DOOR CONSTRAINTS ============
  // Note: Split doors are NOT allowed for TV stands at all
  // These constraints ensure they never pass validation
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_1_SHELF,
    minWidth: 999, // Impossible width - will never validate
    maxWidth: 0,
    minHeight: 999,
    maxHeight: 0,
    minDepth: 999,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES,
    minWidth: 999,
    maxWidth: 0,
    minHeight: 999,
    maxHeight: 0,
    minDepth: 999,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES,
    minWidth: 999,
    maxWidth: 0,
    minHeight: 999,
    maxHeight: 0,
    minDepth: 999,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES,
    minWidth: 999,
    maxWidth: 0,
    minHeight: 999,
    maxHeight: 0,
    minDepth: 999,
  },
  {
    configurationType: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES,
    minWidth: 999,
    maxWidth: 0,
    minHeight: 999,
    maxHeight: 0,
    minDepth: 999,
  },
]

/**
 * Helper function to check if a configuration meets TV stand constraints
 * Includes special rule: no split doors (doorCount === 2)
 */
export function isConfigurationValidForTVStand(
  configurationType: ColumnConfigurationType,
  dimensions: { width: number; height: number; depth: number }
): boolean {
  // TV stands don't allow split doors
  const metadata = getConfigurationMetadata(configurationType)
  if (metadata.doorCount === 2) {
    return false
  }

  const constraint = TVSTAND_COLUMN_CONFIGURATION_CONSTRAINTS.find(
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
 * Get all valid configurations for given dimensions (TV stand)
 */
export function getValidConfigurationsForTVStand(dimensions: {
  width: number
  height: number
  depth: number
}): ColumnConfigurationType[] {
  return Object.values(ColumnConfigurationType).filter((type) =>
    isConfigurationValidForTVStand(type, dimensions)
  )
}

/**
 * Get valid column counts for TV stand based on total width
 * 
 * Rules:
 * - 80-100 cm: 1-2 columns
 * - 101-120 cm: 2 columns
 * - 121-159 cm: 2-3 columns
 * - 160-200 cm: 2-3-4 columns
 * - 201-270 cm: 3-4 columns
 * 
 * @param totalWidth Total width of the TV stand in cm
 * @returns Object with column counts as keys and validity as boolean values
 */
export function getValidColumnCountsForTVStand(totalWidth: number): Record<number, boolean> {
  const validityMap: Record<number, boolean> = {
    1: false,
    2: false,
    3: false,
    4: false,
  }

  if (totalWidth >= 80 && totalWidth <= 100) {
    // 80-100 cm: 1-2 columns
    validityMap[1] = true
    validityMap[2] = true
  } else if (totalWidth >= 101 && totalWidth <= 120) {
    // 101-120 cm: 2 columns
    validityMap[2] = true
  } else if (totalWidth >= 121 && totalWidth <= 159) {
    // 121-159 cm: 2-3 columns
    validityMap[2] = true
    validityMap[3] = true
  } else if (totalWidth >= 160 && totalWidth <= 200) {
    // 160-200 cm: 2-3-4 columns
    validityMap[2] = true
    validityMap[3] = true
    validityMap[4] = true
  } else if (totalWidth >= 201 && totalWidth <= 270) {
    // 201-270 cm: 3-4 columns
    validityMap[3] = true
    validityMap[4] = true
  }

  return validityMap
}

