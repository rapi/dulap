import {
  RackTemplate,
  RackZoneType,
  RackZone,
} from '~/types/rackConfigurationTypes'
import { FURNITURE_CONFIG } from '~/components/ThreeDModel/furnitureConfig'

/**
 * Predefined rack column templates
 * Based on common rack configurations
 *
 * IMPORTANT: Zones are listed in TOP-TO-BOTTOM order
 * - First zone in array = top of rack
 * - Last zone in array = bottom of rack
 *
 * Heights are specified as proportions (sum = 100)
 * Actual dimensions are calculated dynamically based on available space
 */
export const RACK_TEMPLATES: Record<string, RackTemplate> = {
  OPEN_SHELVES_ONLY: {
    id: 'OPEN_SHELVES_ONLY',
    name: 'Open Shelves Only',
    description: 'Multiple open shelves for books and display items',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 100,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
    ],
    doors: [], // No doors
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['display', 'books', 'open'],
    icon: 'shelves-open',
    extraCost: 200,
  },

  SHELVES_WITH_FULL_DOOR: {
    id: 'SHELVES_WITH_FULL_DOOR',
    name: 'Shelves with Full Door',
    description: 'Shelves enclosed behind full-height door for clean look',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 100,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
    ],
    doors: [
      {
        zoneIndices: [0], // Cover all zones
        type: 'single',
      },
    ],
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['enclosed', 'storage', 'clean'],
    icon: 'shelves-door',
    extraCost: 800,
  },

  HALF_OPEN_HALF_CLOSED: {
    id: 'HALF_OPEN_HALF_CLOSED',
    name: 'Half Open, Half Closed',
    description: 'Top shelves open for display, bottom shelves with door',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 50,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: RackZoneType.SHELVES,
        heightProportion: 50,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
    ],
    doors: [
      {
        zoneIndices: [1], // Only bottom zone has door
        type: 'single',
      },
    ],
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'display', 'storage'],
    icon: 'half-half',
    extraCost: 600,
  },

  OPEN_AND_BOTTOM_CLOSED: {
    id: 'OPEN_AND_BOTTOM_CLOSED',
    name: 'Open and Bottom Closed',
    description: 'Top shelves open for display, bottom shelves closed',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 70,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: RackZoneType.SHELVES,
        heightProportion: 30,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
    ],
    doors: [
      {
        zoneIndices: [1], // Only bottom zone has door
        type: 'single',
      },
    ],
    minHeight: 140, // Requires at least 140cm to provide adequate space for both zones
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'display', 'storage'],
    icon: 'half-half',
    extraCost: 600,
  },

  OPEN_AND_SMALL_BOTTOM_CLOSED: {
    id: 'OPEN_AND_SMALL_BOTTOM_CLOSED',
    name: 'Open and Small Bottom Closed',
    description:
      'Top shelves open for display, only 1 shelf at the bottom closed',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 90,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: RackZoneType.SHELVES,
        heightProportion: 10,
        minHeight: 20, // Allow small door zone - just one shelf height
      },
    ],
    doors: [
      {
        zoneIndices: [1], // Only bottom zone has door
        type: 'single',
      },
    ],
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'display', 'storage'],
    icon: 'half-half',
    extraCost: 600,
  },

  OPEN_SHELVES_AND_DRAWERS: {
    id: 'OPEN_SHELVES_AND_DRAWERS',
    name: 'Shelves with Drawers',
    description: 'Open shelves on top with drawers at bottom for storage',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 50,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: RackZoneType.DRAWERS,
        heightProportion: 50,
        minHeight: 60, // Minimum for drawers
        drawerMinHeight: 15,
        drawerMaxHeight: 30,
        drawerOptimalHeight: 30,
      },
    ],
    doors: [], // No doors
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['drawers', 'storage', 'versatile'],
    icon: 'drawers-shelves',
    extraCost: 1500,
  },

  OPEN_SHELVES_AND_BOTTOM_DRAWERS: {
    id: 'OPEN_SHELVES_AND_BOTTOM_DRAWERS',
    name: 'Shelves with Bottom Drawers',
    description: 'Open shelves on top with drawers at bottom for storage',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 70,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: RackZoneType.DRAWERS,
        heightProportion: 30,
        minHeight: 60, // Minimum for drawers
        drawerMinHeight: 15,
        drawerMaxHeight: 30,
        drawerOptimalHeight: 30,
      },
    ],
    doors: [], // No doors
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['drawers', 'storage', 'versatile'],
    icon: 'drawers-shelves',
    extraCost: 1500,
  },
}

/**
 * Get templates that fit within given dimensions
 */
export function getValidTemplates(
  width: number,
  height: number
): RackTemplate[] {
  return Object.values(RACK_TEMPLATES).filter((template) => {
    const widthValid =
      width >= template.minWidth &&
      (!template.maxWidth || width <= template.maxWidth)
    const heightValid =
      height >= template.minHeight &&
      (!template.maxHeight || height <= template.maxHeight)
    return widthValid && heightValid
  })
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): RackTemplate | undefined {
  return RACK_TEMPLATES[id]
}

/**
 * Get templates by tags
 */
export function getTemplatesByTags(tags: string[]): RackTemplate[] {
  return Object.values(RACK_TEMPLATES).filter((template) =>
    template.tags?.some((tag) => tags.includes(tag))
  )
}

/**
 * Validate that template proportions sum to 100
 */
export function validateTemplate(template: RackTemplate): boolean {
  const totalProportion = template.zones.reduce(
    (sum, zone) => sum + zone.heightProportion,
    0
  )
  return Math.abs(totalProportion - 100) < 0.01 // Allow small floating point errors
}

/**
 * Calculate optimal shelf count for a zone
 */
function calculateOptimalShelfCount(
  zoneHeight: number,
  minSpacing: number,
  maxSpacing: number,
  optimalSpacing: number
): { count: number; spacing: number } {
  // Try optimal spacing first
  let count = Math.floor(zoneHeight / optimalSpacing)
  let spacing = zoneHeight / count

  // Check if within bounds
  if (spacing >= minSpacing && spacing <= maxSpacing) {
    return { count, spacing }
  }

  // Try maximum spacing (fewer shelves)
  count = Math.floor(zoneHeight / maxSpacing)
  spacing = zoneHeight / count

  if (spacing >= minSpacing && spacing <= maxSpacing) {
    return { count, spacing }
  }

  // Try minimum spacing (more shelves)
  count = Math.floor(zoneHeight / minSpacing)
  spacing = zoneHeight / count

  return { count, spacing }
}

/**
 * Calculate optimal drawer configuration for a zone
 */
export function calculateOptimalDrawerConfig(
  zoneHeight: number,
  minHeight: number,
  maxHeight: number,
  optimalHeight: number
): { count: number; heights: number[] } {
  // Use centralized constants from FURNITURE_CONFIG
  // These values are shared across all components for consistency
  const DRAWER_MARGIN = FURNITURE_CONFIG.drawerMargin
  const BOTTOM_DRAWER_MARGIN = FURNITURE_CONFIG.drawerBottomMargin
  const PANEL_SPACING = FURNITURE_CONFIG.panelSpacing
  const TOP_SHELF_OVERLAP = FURNITURE_CONFIG.drawerTopShelfOverlap
  // Note: Drawer component subtracts PANEL_SPACING from drawerHeight internally,
  // so we need to add it back to ensure drawers fill the available space

  // Available height for drawers (excluding margins)
  const marginOverhead = BOTTOM_DRAWER_MARGIN

  // Try optimal height first
  let count = 1
  let availableForDrawers = zoneHeight - marginOverhead

  // Calculate how many drawers fit with optimal height + margins
  while (
    count * optimalHeight + (count - 1) * DRAWER_MARGIN <=
    availableForDrawers
  ) {
    count++
  }
  count-- // Go back one step

  if (count === 0) {
    count = 1 // At least one drawer
  }

  // Calculate actual height per drawer (distribute remaining space evenly)
  availableForDrawers =
    zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
  const avgHeight = availableForDrawers / count

  // Check if within bounds
  if (avgHeight >= minHeight && avgHeight <= maxHeight) {
    // Make the TOP drawer slightly taller to fill any rounding gaps
    const baseHeight = Math.floor(avgHeight * 10) / 10 // Round down to 0.1cm
    const heights = Array(count).fill(baseHeight)

    // Calculate remaining space and add it to the top drawer
    const usedHeight =
      baseHeight * count + (count - 1) * DRAWER_MARGIN + marginOverhead
    const remaining = zoneHeight - usedHeight
    heights[count - 1] = baseHeight + remaining + TOP_SHELF_OVERLAP // Top drawer gets extra space + overlap

    // Add PANEL_SPACING to each drawer height to compensate for internal subtraction
    // This ensures drawers fill the visual space correctly
    return {
      count,
      heights: heights.map((h) => h + PANEL_SPACING),
    }
  }

  // If too tall, try with more drawers using maxHeight
  count = Math.floor(
    (zoneHeight - marginOverhead + DRAWER_MARGIN) / (maxHeight + DRAWER_MARGIN)
  )
  if (count === 0) count = 1

  availableForDrawers =
    zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
  const baseHeight = Math.floor((availableForDrawers / count) * 10) / 10
  const heights = Array(count).fill(baseHeight)

  // Add remaining space to top drawer
  const usedHeight =
    baseHeight * count + (count - 1) * DRAWER_MARGIN + marginOverhead
  const remaining = zoneHeight - usedHeight
  heights[count - 1] = baseHeight + remaining + TOP_SHELF_OVERLAP // Add overlap to top drawer

  // Add PANEL_SPACING to each drawer height to compensate for internal subtraction
  return {
    count,
    heights: heights.map((h) => h + PANEL_SPACING),
  }
}

/**
 * Calculate zones from template with dynamic height calculation
 *
 * KEY CONSTRAINTS:
 * - Zones with doors must be at least MIN_DOOR_ZONE_HEIGHT (60cm)
 * - Shelves must have at least MIN_SHELF_SPACING (28cm) between them
 * - If proportions result in too-small door zones, we redistribute height
 */
export function calculateZonesFromTemplate(
  template: RackTemplate,
  availableHeight: number
): RackZone[] {
  // Validate template first
  if (!validateTemplate(template)) {
    // Template has invalid proportions
  }

  // CRITICAL CONSTRAINT: Minimum height for zones with doors
  const DEFAULT_MIN_DOOR_ZONE_HEIGHT = 60 // Default minimum for doors
  const MIN_SHELF_ZONE_HEIGHT = 28 // At least one shelf section

  // Step 1: Calculate initial zone heights from proportions
  const initialHeights = template.zones.map((zoneTemplate) =>
    Math.round(availableHeight * (zoneTemplate.heightProportion / 100))
  )

  // Step 2: Identify zones with doors and check if they need height adjustments
  const doorZoneIndices = new Set<number>()
  if (template.doors) {
    for (const door of template.doors) {
      for (const zoneIndex of door.zoneIndices) {
        doorZoneIndices.add(zoneIndex)
      }
    }
  }

  // Step 3: Calculate adjusted heights ensuring door zones meet minimum
  const adjustedHeights = [...initialHeights]
  let heightDeficit = 0

  // First pass: Identify how much extra height door zones need
  for (let i = 0; i < adjustedHeights.length; i++) {
    if (doorZoneIndices.has(i)) {
      // Use zone's explicit minHeight if provided, otherwise use default
      const minDoorHeight =
        template.zones[i].minHeight ?? DEFAULT_MIN_DOOR_ZONE_HEIGHT

      if (adjustedHeights[i] < minDoorHeight) {
        const needed = minDoorHeight - adjustedHeights[i]
        heightDeficit += needed
        adjustedHeights[i] = minDoorHeight
      }
    }
  }

  // Second pass: Take height from non-door zones to compensate
  if (heightDeficit > 0) {
    // Find non-door zones that can give up height
    const nonDoorZones = template.zones
      .map((z, i) => ({
        index: i,
        height: adjustedHeights[i],
        hasMinConstraint: z.minHeight,
      }))
      .filter((z) => !doorZoneIndices.has(z.index))

    // Calculate how much each non-door zone can give (keeping minimum)
    const availableToGive: { index: number; canGive: number }[] = []
    for (const zone of nonDoorZones) {
      const minRequired = zone.hasMinConstraint || MIN_SHELF_ZONE_HEIGHT
      const canGive = Math.max(0, zone.height - minRequired)
      if (canGive > 0) {
        availableToGive.push({ index: zone.index, canGive })
      }
    }

    // Distribute the deficit proportionally among non-door zones
    const totalAvailable = availableToGive.reduce(
      (sum, z) => sum + z.canGive,
      0
    )

    if (totalAvailable >= heightDeficit) {
      // We can satisfy the deficit
      for (const zone of availableToGive) {
        const takeFromThis = Math.round(
          (zone.canGive / totalAvailable) * heightDeficit
        )
        adjustedHeights[zone.index] -= takeFromThis
      }
    } else {
      // Not enough to satisfy - continue with best effort
      for (const zone of availableToGive) {
        adjustedHeights[zone.index] -= zone.canGive
      }
    }
  }

  // Ensure total still matches available height (adjust for rounding)
  const totalAdjusted = adjustedHeights.reduce((sum, h) => sum + h, 0)
  if (totalAdjusted !== availableHeight) {
    const diff = availableHeight - totalAdjusted
    // Add/subtract from the largest non-door zone
    const nonDoorIndices = template.zones
      .map((_, i) => i)
      .filter((i) => !doorZoneIndices.has(i))

    if (nonDoorIndices.length > 0) {
      const largestNonDoor = nonDoorIndices.reduce((a, b) =>
        adjustedHeights[a] > adjustedHeights[b] ? a : b
      )
      adjustedHeights[largestNonDoor] += diff
    } else {
      // All zones have doors - add to largest
      const largest = adjustedHeights.reduce(
        (maxI, h, i, arr) => (h > arr[maxI] ? i : maxI),
        0
      )
      adjustedHeights[largest] += diff
    }
  }

  // Step 4: Create zone objects with adjusted heights
  return template.zones.map((zoneTemplate, zoneIndex) => {
    const zoneHeight = adjustedHeights[zoneIndex]

    // For shelves: calculate optimal shelf count and spacing
    if (zoneTemplate.type === RackZoneType.SHELVES) {
      const minSpacing = zoneTemplate.shelfMinSpacing || 28
      const maxSpacing = zoneTemplate.shelfMaxSpacing || 32
      const optimalSpacing =
        zoneTemplate.shelfOptimalSpacing || (minSpacing + maxSpacing) / 2

      const { count, spacing } = calculateOptimalShelfCount(
        zoneHeight,
        minSpacing,
        maxSpacing,
        optimalSpacing
      )

      return {
        type: zoneTemplate.type,
        height: zoneHeight,
        shelfCount: count,
        shelfSpacing: spacing,
      }
    }

    // For drawers: calculate optimal drawer count and heights
    if (zoneTemplate.type === RackZoneType.DRAWERS) {
      const minHeight = zoneTemplate.drawerMinHeight || 15
      const maxHeight = zoneTemplate.drawerMaxHeight || 25
      const optimalHeight = zoneTemplate.drawerOptimalHeight || 20

      const { count, heights } = calculateOptimalDrawerConfig(
        zoneHeight,
        minHeight,
        maxHeight,
        optimalHeight
      )

      return {
        type: zoneTemplate.type,
        height: zoneHeight,
        drawerCount: count,
        drawerHeights: heights,
      }
    }

    // For other zone types (EMPTY, etc.)
    return {
      type: zoneTemplate.type,
      height: zoneHeight,
    }
  })
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use calculateZonesFromTemplate instead
 */
export function calculateTemplateAdjustment(
  template: RackTemplate,
  targetHeight: number
): RackZone[] {
  return calculateZonesFromTemplate(template, targetHeight)
}
