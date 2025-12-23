import {
  ColumnConfigurationType,
  ColumnConfigurationConstraint,
} from '~/types/columnConfigurationTypes'

/**
 * Constraint definitions for column configurations
 *
 * These rules determine which configurations are available based on
 * column dimensions (width, height, depth).
 *
 * Add or modify constraints here to control configuration availability.
 */

export const COLUMN_CONFIGURATION_CONSTRAINTS: ColumnConfigurationConstraint[] =
  [
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
      minWidth: 60,
      minHeight: 25,
      maxHeight: 60,
      minDepth: 25,
    },
    {
      configurationType: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES,
      minWidth: 60,
      minHeight: 45,
      maxHeight: 105,
      minDepth: 25,
    },
    {
      configurationType: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES,
      minWidth: 60,
      minHeight: 80,
      maxHeight: 130,
      minDepth: 25,
    },
    {
      configurationType: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES,
      minWidth: 60,
      minHeight: 105,
      minDepth: 25,
    },
    {
      configurationType: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES,
      minWidth: 60,
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
