import {
  BookcaseTemplate,
  BookcaseZoneType,
  BookcaseZone,
} from '~/types/bookcaseConfigurationTypes'

/**
 * Predefined bookcase column templates
 * Based on common bookcase configurations
 *
 * IMPORTANT: Zones are listed in TOP-TO-BOTTOM order
 * - First zone in array = top of bookcase
 * - Last zone in array = bottom of bookcase
 *
 * Heights are specified as proportions (sum = 100)
 * Actual dimensions are calculated dynamically based on available space
 */
export const BOOKCASE_TEMPLATES: Record<string, BookcaseTemplate> = {
  OPEN_SHELVES_ONLY: {
    id: 'OPEN_SHELVES_ONLY',
    name: 'Open Shelves Only',
    description: 'Multiple open shelves for books and display items',
    zones: [
      {
        type: BookcaseZoneType.SHELVES,
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
        type: BookcaseZoneType.SHELVES,
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
        type: BookcaseZoneType.SHELVES,
        heightProportion: 50,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: BookcaseZoneType.SHELVES,
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

  OPEN_SHELVES_AND_DRAWERS: {
    id: 'OPEN_SHELVES_AND_DRAWERS',
    name: 'Shelves with Drawers',
    description: 'Open shelves on top with drawers at bottom for storage',
    zones: [
      {
        type: BookcaseZoneType.SHELVES,
        heightProportion: 50,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: BookcaseZoneType.DRAWERS,
        heightProportion: 50,
        minHeight: 60, // Minimum for drawers
        drawerMinHeight: 15,
        drawerMaxHeight: 25,
        drawerOptimalHeight: 20,
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

  SHELVES_AND_CLOSED_DRAWERS: {
    id: 'SHELVES_AND_CLOSED_DRAWERS',
    name: 'Mixed Storage',
    description: 'Combination of open shelves and enclosed drawers',
    zones: [
      {
        type: BookcaseZoneType.SHELVES,
        heightProportion: 50,
        shelfMinSpacing: 28,
        shelfMaxSpacing: 32,
        shelfOptimalSpacing: 30,
      },
      {
        type: BookcaseZoneType.DRAWERS,
        heightProportion: 50,
        minHeight: 60, // Minimum for drawers
        drawerMinHeight: 15,
        drawerMaxHeight: 25,
        drawerOptimalHeight: 20,
      },
    ],
    doors: [
      {
        zoneIndices: [1], // Door covers drawer zone
        type: 'single',
      },
    ],
    minHeight: 0,
    maxHeight: 9999,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'drawers', 'storage'],
    icon: 'mixed',
    extraCost: 1800,
  },
};

/**
 * Get templates that fit within given dimensions
 */
export function getValidTemplates(
  width: number,
  height: number
): BookcaseTemplate[] {
  return Object.values(BOOKCASE_TEMPLATES).filter((template) => {
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
export function getTemplateById(id: string): BookcaseTemplate | undefined {
  return BOOKCASE_TEMPLATES[id]
}

/**
 * Get templates by tags
 */
export function getTemplatesByTags(tags: string[]): BookcaseTemplate[] {
  return Object.values(BOOKCASE_TEMPLATES).filter((template) =>
    template.tags?.some((tag) => tags.includes(tag))
  )
}

/**
 * Validate that template proportions sum to 100
 */
export function validateTemplate(template: BookcaseTemplate): boolean {
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
function calculateOptimalDrawerConfig(
  zoneHeight: number,
  minHeight: number,
  maxHeight: number,
  optimalHeight: number
): { count: number; heights: number[] } {
  // Account for margins in calculations
  const DRAWER_MARGIN = 1 // 1cm between drawers
  const BOTTOM_DRAWER_MARGIN = 2 // 2cm at bottom
  const TOP_SHELF_THICKNESS = 2 // 2cm for top shelf (if zone has door)
  
  // Available height for drawers (excluding margins)
  const marginOverhead = BOTTOM_DRAWER_MARGIN + TOP_SHELF_THICKNESS
  
  // Try optimal height first
  let count = 1
  let availableForDrawers = zoneHeight - marginOverhead
  
  // Calculate how many drawers fit with optimal height + margins
  while (count * optimalHeight + (count - 1) * DRAWER_MARGIN <= availableForDrawers) {
    count++
  }
  count-- // Go back one step
  
  if (count === 0) {
    count = 1 // At least one drawer
  }

  // Calculate actual height per drawer (distribute remaining space evenly)
  availableForDrawers = zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
  const avgHeight = availableForDrawers / count

  // Check if within bounds
  if (avgHeight >= minHeight && avgHeight <= maxHeight) {
    return {
      count,
      heights: Array(count).fill(avgHeight),
    }
  }

  // If too tall, try with more drawers using maxHeight
  count = Math.floor((zoneHeight - marginOverhead + DRAWER_MARGIN) / (maxHeight + DRAWER_MARGIN))
  if (count === 0) count = 1
  
  availableForDrawers = zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
  const heights = Array(count).fill(availableForDrawers / count)
  
  return { count, heights }
}

/**
 * Calculate zones from template with dynamic height calculation
 */
export function calculateZonesFromTemplate(
  template: BookcaseTemplate,
  availableHeight: number
): BookcaseZone[] {
  // Validate template first
  if (!validateTemplate(template)) {
    console.warn(`Template ${template.id} has invalid proportions (sum != 100)`)
  }

  return template.zones.map((zoneTemplate) => {
    // Calculate zone height from proportion
    const zoneHeight = Math.round(
      availableHeight * (zoneTemplate.heightProportion / 100)
    )

    // Check minimum height constraint
    if (zoneTemplate.minHeight && zoneHeight < zoneTemplate.minHeight) {
      console.warn(
        `Zone height ${zoneHeight}cm is below minimum ${zoneTemplate.minHeight}cm`
      )
    }

    // For shelves: calculate optimal shelf count and spacing
    if (zoneTemplate.type === BookcaseZoneType.SHELVES) {
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
    if (zoneTemplate.type === BookcaseZoneType.DRAWERS) {
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
  template: BookcaseTemplate,
  targetHeight: number
): BookcaseZone[] {
  return calculateZonesFromTemplate(template, targetHeight)
}
