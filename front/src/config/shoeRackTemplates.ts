import {
  RackTemplate,
  RackZoneType,
  RackZone,
} from '~/types/rackConfigurationTypes'
import { FURNITURE_CONFIG } from '~/components/ThreeDModel/furnitureConfig'

/**
 * Predefined shoe rack column templates
 * Optimized for shoe storage with appropriate compartment heights
 *
 * IMPORTANT: Zones are listed in TOP-TO-BOTTOM order
 * - First zone in array = top of rack
 * - Last zone in array = bottom of rack
 *
 * Heights are specified as proportions (sum = 100)
 * Actual dimensions are calculated dynamically based on available space
 */
export const SHOE_RACK_TEMPLATES: Record<string, RackTemplate> = {
  ONE_ROW_EMPTY: {
    id: 'ONE_ROW_EMPTY',
    name: 'One Row Empty',
    description: 'One row of empty space for shoes',
    zones: [
      {
        type: RackZoneType.EMPTY,
        heightProportion: 100,
      },
    ],
    doors: [], // No doors
    minHeight: 29,
    maxHeight: 45,
    minWidth: 0,
    maxWidth: 1000,
    tags: ['display', 'shoes', 'open'],
    icon: 'shelves-open',
    extraCost: 150,
  },

  ONE_ROW_DOOR: {
    id: 'ONE_ROW_DOOR',
    name: 'One Row Door',
    description: 'One row of empty space for shoes with door',
    zones: [
      {
        type: RackZoneType.EMPTY,
        heightProportion: 100,
      },
    ],
    doors: [
      {
        zoneIndices: [0], // Cover all zones
        type: 'single',
      },
    ],
    minHeight: 29,
    maxHeight: 45,
    minWidth: 0,
    maxWidth: 1000,
    tags: ['display', 'shoes', 'open'],
    icon: 'shelves-open',
    extraCost: 150,
  },

  ONE_ROW_DRAWER: {
    id: 'ONE_ROW_DRAWER',
    name: 'One Row Drawer',
    description: 'One row of empty space for shoes with drawer',
    zones: [
      {
        type: RackZoneType.DRAWERS,
        heightProportion: 100,
        drawerMinHeight: 28,
      },
    ],
    doors: [],
    minHeight: 29,
    maxHeight: 45,
    minWidth: 0,
    maxWidth: 1000,
    tags: ['display', 'shoes', 'open'],
    icon: 'shelves-open',
    extraCost: 150,
  },

  TWO_ROWS_SHELVES: {
    id: 'TWO_ROWS_SHELVES',
    name: 'One Row Shelves',
    description: 'Column with 1 shelf in the middle for shoes',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 100,
        minShelfCount: 1, // Minimum number of shelves in a column
        maxShelfCount: 1, // Maximum number of shelves in a column
      },
    ],
    doors: [], // No doors
    minHeight: 46,
    maxHeight: 85,
    minWidth: 0,
    maxWidth: 1000,
    tags: ['display', 'shoes', 'open'],
    icon: 'shelves-open',
    extraCost: 150,
  },

  TWO_ROWS_DOOR: {
    id: 'TWO_ROWS_DOOR',
    name: 'Two Rows Door',
    description: 'Two rows of empty space for shoes with door',
    zones: [
      {
        type: RackZoneType.EMPTY,
        heightProportion: 100,
      },
    ],
    doors: [
      {
        zoneIndices: [0], // Cover all zones
        type: 'single',
      },
    ],
    minHeight: 46,
    maxHeight: 85,
    minWidth: 0,
    maxWidth: 1000,
    tags: ['display', 'shoes', 'open'],
    icon: 'shelves-open',
    extraCost: 150,
  },

  TWO_ROWS_DRAWER: {
    id: 'TWO_ROWS_DRAWER',
    name: 'Two Rows Drawer',
    description: 'Two rows of empty space for shoes with drawer',
    zones: [
      {
        type: RackZoneType.DRAWERS,
        heightProportion: 100,
        drawerMinCount: 2,
        drawerMaxCount: 2,
      },
    ],
    doors: [],
    minHeight: 46,
    maxHeight: 85,
    minWidth: 0,
    maxWidth: 1000,
    tags: ['display', 'shoes', 'open'],
    icon: 'shelves-open',
    extraCost: 150,
  },
  // OPEN_SHELVES_ONLY: {
  //   id: 'OPEN_SHELVES_ONLY',
  //   name: 'Open Shelves Only',
  //   description: 'Multiple open shelves optimized for shoe storage',
  //   zones: [
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 100,
  //       shelfMinSpacing: 18, // Minimum for flat shoes
  //       shelfMaxSpacing: 25, // Maximum for boots
  //       shelfOptimalSpacing: 20, // Optimal for most shoes
  //     },
  //   ],
  //   doors: [], // No doors
  //   minHeight: 0,
  //   maxHeight: 9999,
  //   minWidth: 30,
  //   maxWidth: 100,
  //   tags: ['display', 'shoes', 'open'],
  //   icon: 'shelves-open',
  //   extraCost: 150,
  // },

  SHELVES_WITH_FULL_DOOR: {
    id: 'SHELVES_WITH_FULL_DOOR',
    name: 'Shelves with Full Door',
    description: 'Shelves enclosed behind full-height door for clean look',
    zones: [
      {
        type: RackZoneType.SHELVES,
        heightProportion: 100,
        shelfMinSpacing: 18,
        shelfMaxSpacing: 25,
        shelfOptimalSpacing: 20,
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
    minWidth: 30,
    maxWidth: 100,
    tags: ['enclosed', 'storage', 'clean'],
    icon: 'shelves-door',
    extraCost: 700,
  },

  // HALF_OPEN_HALF_CLOSED: {
  //   id: 'HALF_OPEN_HALF_CLOSED',
  //   name: 'Half Open, Half Closed',
  //   description: 'Top shelves open for display, bottom shelves with door',
  //   zones: [
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 50,
  //       shelfMinSpacing: 18,
  //       shelfMaxSpacing: 25,
  //       shelfOptimalSpacing: 20,
  //     },
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 50,
  //       shelfMinSpacing: 18,
  //       shelfMaxSpacing: 25,
  //       shelfOptimalSpacing: 20,
  //     },
  //   ],
  //   doors: [
  //     {
  //       zoneIndices: [1], // Only bottom zone has door
  //       type: 'single',
  //     },
  //   ],
  //   minHeight: 0,
  //   maxHeight: 9999,
  //   minWidth: 30,
  //   maxWidth: 100,
  //   tags: ['mixed', 'display', 'storage'],
  //   icon: 'half-half',
  //   extraCost: 550,
  // },

  // OPEN_AND_BOTTOM_CLOSED: {
  //   id: 'OPEN_AND_BOTTOM_CLOSED',
  //   name: 'Open and Bottom Closed',
  //   description: 'Top shelves open for display, bottom section closed',
  //   zones: [
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 70,
  //       shelfMinSpacing: 18,
  //       shelfMaxSpacing: 25,
  //       shelfOptimalSpacing: 20,
  //     },
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 30,
  //       shelfMinSpacing: 18,
  //       shelfMaxSpacing: 25,
  //       shelfOptimalSpacing: 20,
  //     },
  //   ],
  //   doors: [
  //     {
  //       zoneIndices: [1], // Only bottom zone has door
  //       type: 'single',
  //     },
  //   ],
  //   minHeight: 60, // Requires adequate space for both zones
  //   maxHeight: 9999,
  //   minWidth: 30,
  //   maxWidth: 100,
  //   tags: ['mixed', 'display', 'storage'],
  //   icon: 'half-half',
  //   extraCost: 550,
  // },

  // OPEN_SHELVES_AND_DRAWERS: {
  //   id: 'OPEN_SHELVES_AND_DRAWERS',
  //   name: 'Shelves with Drawers',
  //   description: 'Open shelves on top with drawers at bottom for accessories',
  //   zones: [
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 60,
  //       shelfMinSpacing: 18,
  //       shelfMaxSpacing: 25,
  //       shelfOptimalSpacing: 20,
  //     },
  //     {
  //       type: RackZoneType.DRAWERS,
  //       heightProportion: 40,
  //       minHeight: 40, // Minimum for drawers
  //       drawerMinHeight: 12,
  //       drawerMaxHeight: 20,
  //       drawerOptimalHeight: 15,
  //     },
  //   ],
  //   doors: [], // No doors
  //   minHeight: 0,
  //   maxHeight: 9999,
  //   minWidth: 30,
  //   maxWidth: 100,
  //   tags: ['drawers', 'storage', 'versatile'],
  //   icon: 'drawers-shelves',
  //   extraCost: 1300,
  // },

  // DRAWERS_ONLY: {
  //   id: 'DRAWERS_ONLY',
  //   name: 'Drawers Only',
  //   description: 'Multiple drawers for organized shoe and accessory storage',
  //   zones: [
  //     {
  //       type: RackZoneType.DRAWERS,
  //       heightProportion: 100,
  //       minHeight: 40,
  //       drawerMinHeight: 12,
  //       drawerMaxHeight: 20,
  //       drawerOptimalHeight: 15,
  //     },
  //   ],
  //   doors: [],
  //   minHeight: 40,
  //   maxHeight: 9999,
  //   minWidth: 30,
  //   maxWidth: 100,
  //   tags: ['drawers', 'storage', 'organized'],
  //   icon: 'drawers-only',
  //   extraCost: 1500,
  // },

  // OPEN_SHELVES_AND_BOTTOM_DRAWERS: {
  //   id: 'OPEN_SHELVES_AND_BOTTOM_DRAWERS',
  //   name: 'Shelves with Bottom Drawers',
  //   description: 'Open shelves for shoes, bottom drawers for small items',
  //   zones: [
  //     {
  //       type: RackZoneType.SHELVES,
  //       heightProportion: 75,
  //       shelfMinSpacing: 18,
  //       shelfMaxSpacing: 25,
  //       shelfOptimalSpacing: 20,
  //     },
  //     {
  //       type: RackZoneType.DRAWERS,
  //       heightProportion: 25,
  //       minHeight: 30, // Minimum for drawers
  //       drawerMinHeight: 10,
  //       drawerMaxHeight: 15,
  //       drawerOptimalHeight: 12,
  //     },
  //   ],
  //   doors: [], // No doors
  //   minHeight: 0,
  //   maxHeight: 9999,
  //   minWidth: 30,
  //   maxWidth: 100,
  //   tags: ['drawers', 'storage', 'versatile'],
  //   icon: 'drawers-shelves',
  //   extraCost: 1200,
  // },
}

/**
 * Get templates that fit within given dimensions
 */
export function getValidShoeRackTemplates(
  width: number,
  height: number
): RackTemplate[] {
  return Object.values(SHOE_RACK_TEMPLATES).filter((template) => {
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
export function getShoeRackTemplateById(id: string): RackTemplate | undefined {
  return SHOE_RACK_TEMPLATES[id]
}

/**
 * Get templates by tags
 */
export function getShoeRackTemplatesByTags(tags: string[]): RackTemplate[] {
  return Object.values(SHOE_RACK_TEMPLATES).filter((template) =>
    template.tags?.some((tag) => tags.includes(tag))
  )
}

/**
 * Validate that template proportions sum to 100
 */
export function validateShoeRackTemplate(template: RackTemplate): boolean {
  if (!template) return false
  const totalProportion = template?.zones?.reduce(
    (sum, zone) => sum + zone?.heightProportion,
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
  optimalSpacing: number,
  minShelfCount?: number,
  maxShelfCount?: number
): { count: number; spacing: number } {
  // If both min and max shelf counts are specified and equal, use that exact count
  if (
    minShelfCount !== undefined &&
    maxShelfCount !== undefined &&
    minShelfCount === maxShelfCount
  ) {
    const count = minShelfCount
    const spacing = zoneHeight / count
    console.log(
      `[calculateOptimalShelfCount] Fixed shelf count: ${count}, spacing: ${spacing}cm`
    )
    return { count, spacing }
  }

  // Try optimal spacing first
  let count = Math.floor(zoneHeight / optimalSpacing)

  // Apply min/max shelf count constraints
  if (minShelfCount !== undefined && count < minShelfCount) {
    count = minShelfCount
  }
  if (maxShelfCount !== undefined && count > maxShelfCount) {
    count = maxShelfCount
  }

  let spacing = zoneHeight / count

  // Check if within bounds
  if (spacing >= minSpacing && spacing <= maxSpacing) {
    console.log(
      `[calculateOptimalShelfCount] Optimal count: ${count}, spacing: ${spacing}cm`
    )
    return { count, spacing }
  }

  // Try maximum spacing (fewer shelves)
  count = Math.floor(zoneHeight / maxSpacing)

  // Apply constraints again
  if (minShelfCount !== undefined && count < minShelfCount) {
    count = minShelfCount
  }
  if (maxShelfCount !== undefined && count > maxShelfCount) {
    count = maxShelfCount
  }

  spacing = zoneHeight / count

  if (spacing >= minSpacing && spacing <= maxSpacing) {
    console.log(
      `[calculateOptimalShelfCount] Max spacing count: ${count}, spacing: ${spacing}cm`
    )
    return { count, spacing }
  }

  // Try minimum spacing (more shelves)
  count = Math.floor(zoneHeight / minSpacing)

  // Apply constraints again
  if (minShelfCount !== undefined && count < minShelfCount) {
    count = minShelfCount
  }
  if (maxShelfCount !== undefined && count > maxShelfCount) {
    count = maxShelfCount
  }

  spacing = zoneHeight / count

  console.log(
    `[calculateOptimalShelfCount] Min spacing count: ${count}, spacing: ${spacing}cm`
  )
  return { count, spacing }
}

/**
 * Calculate optimal drawer configuration for a zone
 */
export function calculateOptimalShoeDrawerConfig(
  zoneHeight: number,
  minHeight: number,
  maxHeight: number,
  optimalHeight: number,
  drawerMinCount?: number,
  drawerMaxCount?: number
): { count: number; heights: number[] } {
  const DRAWER_MARGIN = FURNITURE_CONFIG.drawerMargin
  const BOTTOM_DRAWER_MARGIN = FURNITURE_CONFIG.drawerBottomMargin
  const PANEL_SPACING = FURNITURE_CONFIG.panelSpacing
  const TOP_SHELF_OVERLAP = FURNITURE_CONFIG.drawerTopShelfOverlap

  const marginOverhead = BOTTOM_DRAWER_MARGIN

  // If both min and max drawer counts are specified and equal, use that exact count
  if (
    drawerMinCount !== undefined &&
    drawerMaxCount !== undefined &&
    drawerMinCount === drawerMaxCount
  ) {
    const count = drawerMinCount
    const availableForDrawers =
      zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
    const avgHeight = availableForDrawers / count
    const baseHeight = Math.floor(avgHeight * 10) / 10
    const heights = Array(count).fill(baseHeight)

    const usedHeight =
      baseHeight * count + (count - 1) * DRAWER_MARGIN + marginOverhead
    const remaining = zoneHeight - usedHeight
    heights[count - 1] = baseHeight + remaining + TOP_SHELF_OVERLAP

    console.log(
      `[calculateOptimalShoeDrawerConfig] Fixed drawer count: ${count}, heights:`,
      heights.map((h) => h + PANEL_SPACING)
    )

    return {
      count,
      heights: heights.map((h) => h + PANEL_SPACING),
    }
  }

  let count = 1
  let availableForDrawers = zoneHeight - marginOverhead

  while (
    count * optimalHeight + (count - 1) * DRAWER_MARGIN <=
    availableForDrawers
  ) {
    count++
  }
  count--

  // Apply min/max drawer count constraints
  if (drawerMinCount !== undefined && count < drawerMinCount) {
    count = drawerMinCount
  }
  if (drawerMaxCount !== undefined && count > drawerMaxCount) {
    count = drawerMaxCount
  }

  if (count === 0) {
    count = 1
  }

  availableForDrawers =
    zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
  const avgHeight = availableForDrawers / count

  if (avgHeight >= minHeight && avgHeight <= maxHeight) {
    const baseHeight = Math.floor(avgHeight * 10) / 10
    const heights = Array(count).fill(baseHeight)

    const usedHeight =
      baseHeight * count + (count - 1) * DRAWER_MARGIN + marginOverhead
    const remaining = zoneHeight - usedHeight
    heights[count - 1] = baseHeight + remaining + TOP_SHELF_OVERLAP

    console.log(
      `[calculateOptimalShoeDrawerConfig] Optimal count: ${count}, heights:`,
      heights.map((h) => h + PANEL_SPACING)
    )

    return {
      count,
      heights: heights.map((h) => h + PANEL_SPACING),
    }
  }

  count = Math.floor(
    (zoneHeight - marginOverhead + DRAWER_MARGIN) / (maxHeight + DRAWER_MARGIN)
  )

  // Apply constraints again
  if (drawerMinCount !== undefined && count < drawerMinCount) {
    count = drawerMinCount
  }
  if (drawerMaxCount !== undefined && count > drawerMaxCount) {
    count = drawerMaxCount
  }

  if (count === 0) count = 1

  availableForDrawers =
    zoneHeight - marginOverhead - (count - 1) * DRAWER_MARGIN
  const baseHeight = Math.floor((availableForDrawers / count) * 10) / 10
  const heights = Array(count).fill(baseHeight)

  const usedHeight =
    baseHeight * count + (count - 1) * DRAWER_MARGIN + marginOverhead
  const remaining = zoneHeight - usedHeight
  heights[count - 1] = baseHeight + remaining + TOP_SHELF_OVERLAP

  console.log(
    `[calculateOptimalShoeDrawerConfig] Adjusted count: ${count}, heights:`,
    heights.map((h) => h + PANEL_SPACING)
  )

  return {
    count,
    heights: heights.map((h) => h + PANEL_SPACING),
  }
}

/**
 * Calculate zones from template with dynamic height calculation
 */
export function calculateShoeRackZonesFromTemplate(
  template: RackTemplate,
  availableHeight: number
): RackZone[] {
  if (!validateShoeRackTemplate(template)) {
    // Template has invalid proportions
    return []
  }

  const DEFAULT_MIN_DOOR_ZONE_HEIGHT = 40
  const MIN_SHELF_ZONE_HEIGHT = 18

  const initialHeights = template.zones.map((zoneTemplate) =>
    Math.round(availableHeight * (zoneTemplate.heightProportion / 100))
  )

  const doorZoneIndices = new Set<number>()
  if (template.doors) {
    for (const door of template.doors) {
      for (const zoneIndex of door.zoneIndices) {
        doorZoneIndices.add(zoneIndex)
      }
    }
  }

  const adjustedHeights = [...initialHeights]
  let heightDeficit = 0

  for (let i = 0; i < adjustedHeights.length; i++) {
    if (doorZoneIndices.has(i)) {
      const minDoorHeight =
        template.zones[i].minHeight ?? DEFAULT_MIN_DOOR_ZONE_HEIGHT

      if (adjustedHeights[i] < minDoorHeight) {
        const needed = minDoorHeight - adjustedHeights[i]
        heightDeficit += needed
        adjustedHeights[i] = minDoorHeight
      }
    }
  }

  if (heightDeficit > 0) {
    const nonDoorZones = template.zones
      .map((z, i) => ({
        index: i,
        height: adjustedHeights[i],
        hasMinConstraint: z.minHeight,
      }))
      .filter((z) => !doorZoneIndices.has(z.index))

    const availableToGive: { index: number; canGive: number }[] = []
    for (const zone of nonDoorZones) {
      const minRequired = zone.hasMinConstraint || MIN_SHELF_ZONE_HEIGHT
      const canGive = Math.max(0, zone.height - minRequired)
      if (canGive > 0) {
        availableToGive.push({ index: zone.index, canGive })
      }
    }

    const totalAvailable = availableToGive.reduce(
      (sum, z) => sum + z.canGive,
      0
    )

    if (totalAvailable >= heightDeficit) {
      for (const zone of availableToGive) {
        const takeFromThis = Math.round(
          (zone.canGive / totalAvailable) * heightDeficit
        )
        adjustedHeights[zone.index] -= takeFromThis
      }
    } else {
      for (const zone of availableToGive) {
        adjustedHeights[zone.index] -= zone.canGive
      }
    }
  }

  const totalAdjusted = adjustedHeights.reduce((sum, h) => sum + h, 0)
  if (totalAdjusted !== availableHeight) {
    const diff = availableHeight - totalAdjusted
    const nonDoorIndices = template.zones
      .map((_, i) => i)
      .filter((i) => !doorZoneIndices.has(i))

    if (nonDoorIndices.length > 0) {
      const largestNonDoor = nonDoorIndices.reduce((a, b) =>
        adjustedHeights[a] > adjustedHeights[b] ? a : b
      )
      adjustedHeights[largestNonDoor] += diff
    } else {
      const largest = adjustedHeights.reduce(
        (maxI, h, i, arr) => (h > arr[maxI] ? i : maxI),
        0
      )
      adjustedHeights[largest] += diff
    }
  }

  return template.zones.map((zoneTemplate, zoneIndex) => {
    const zoneHeight = adjustedHeights[zoneIndex]

    if (zoneTemplate.type === RackZoneType.SHELVES) {
      const minSpacing = zoneTemplate.shelfMinSpacing || 18
      const maxSpacing = zoneTemplate.shelfMaxSpacing || 25
      const optimalSpacing =
        zoneTemplate.shelfOptimalSpacing || (minSpacing + maxSpacing) / 2

      const { count, spacing } = calculateOptimalShelfCount(
        zoneHeight,
        minSpacing,
        maxSpacing,
        optimalSpacing,
        zoneTemplate.minShelfCount,
        zoneTemplate.maxShelfCount
      )

      console.log(
        `[calculateShoeRackZonesFromTemplate] Zone ${zoneIndex}: height=${zoneHeight}cm, shelves=${count}, spacing=${spacing}cm`
      )

      return {
        type: zoneTemplate.type,
        height: zoneHeight,
        shelfCount: count,
        shelfSpacing: spacing,
      }
    }

    if (zoneTemplate.type === RackZoneType.DRAWERS) {
      const minHeight = zoneTemplate.drawerMinHeight || 10
      const maxHeight = zoneTemplate.drawerMaxHeight || 20
      const optimalHeight = zoneTemplate.drawerOptimalHeight || 15

      const { count, heights } = calculateOptimalShoeDrawerConfig(
        zoneHeight,
        minHeight,
        maxHeight,
        optimalHeight,
        zoneTemplate.drawerMinCount,
        zoneTemplate.drawerMaxCount
      )

      console.log(
        `[calculateShoeRackZonesFromTemplate] Zone ${zoneIndex}: height=${zoneHeight}cm, drawers=${count}, heights=${heights.join(', ')}cm`
      )

      return {
        type: zoneTemplate.type,
        height: zoneHeight,
        drawerCount: count,
        drawerHeights: heights,
      }
    }

    return {
      type: zoneTemplate.type,
      height: zoneHeight,
    }
  })
}
