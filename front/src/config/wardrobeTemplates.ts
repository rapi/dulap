import {
  WardrobeTemplate,
  WardrobeZoneType,
  WardrobeZone,
} from '~/types/wardrobeConfigurationTypes'

/**
 * Wardrobe constants
 * Standard wardrobe height: 200 cm total (196 cm internal)
 * Structural panels: 2 cm (top) + 2 cm (bottom) = 4 cm
 *
 * Note: Templates are designed for 196 cm but will scale proportionally
 * to fit any wardrobe height >= 170 cm
 */
export const WARDROBE_STANDARD_TOTAL_HEIGHT = 200
export const WARDROBE_STANDARD_INTERNAL_HEIGHT = 196
export const WARDROBE_MIN_HEIGHT = 170

/**
 * Standardized bottom sections for modular wardrobe composition
 * These can be combined with different top sections for flexibility
 */
export const STANDARD_BOTTOM_SECTIONS = {
  // 2 drawers - compact bottom section
  TWO_DRAWERS: {
    type: WardrobeZoneType.DRAWERS,
    height: 38,
    drawerCount: 2,
    drawerHeights: [15, 15],
  } as WardrobeZone,

  // 4 drawers - larger bottom section
  FOUR_DRAWERS: {
    type: WardrobeZoneType.DRAWERS,
    height: 78,
    drawerCount: 4,
    drawerHeights: [15, 15, 15, 15],
  } as WardrobeZone,

  // Empty section - open space
  EMPTY_38: {
    type: WardrobeZoneType.EMPTY,
    height: 38,
  } as WardrobeZone,
} as const

/**
 * Predefined wardrobe column templates
 * Based on common wardrobe configurations and user sketches
 *
 * IMPORTANT: Zones are listed in TOP-TO-BOTTOM order
 * - First zone in array = top of wardrobe
 * - Last zone in array = bottom of wardrobe
 *
 * All templates are designed for 196 cm but scale to fit available height
 */
export const WARDROBE_TEMPLATES: Record<string, WardrobeTemplate> = {
  FULL_HANGING_WITH_1_SHELF: {
    id: 'FULL_HANGING_WITH_1_SHELF',
    name: 'Full Hanging with 1 Shelf',
    description:
      'Full-height hanging space for long dresses and coats with 1 shelf at bottom',
    zones: [
      {
        type: WardrobeZoneType.HANGING_LONG,
        height: 156,
        rodHeight: 148,
      },
      {
        type: WardrobeZoneType.SHELVES_FIXED,
        height: 40,
        shelfCount: 1,
        shelfSpacing: 40,
      },
    ],
    minHeight: 200,
    minWidth: 40,
    maxWidth: 100,
    tags: ['dresses', 'coats', 'womens'],
    icon: 'hanging-long',
    extraCost: 450,
  },

  FULL_HANGING_WITH_2_DRAWERS: {
    id: 'FULL_HANGING_WITH_2_DRAWERS',
    name: 'Full Hanging with 2 Drawers',
    description:
      'Full-height hanging space for long dresses and coats with 2 drawers at bottom',
    zones: [
      {
        type: WardrobeZoneType.HANGING_LONG,
        height: 156,
        rodHeight: 148,
      },
      {
        type: WardrobeZoneType.DRAWERS,
        height: 40,
        drawerCount: 2,
        drawerHeights: [15, 15],
        addShelfAtTheTop: true,
      },
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['dresses', 'coats', 'womens'],
    icon: 'hanging-long',
    extraCost: 1000,
  },

  SHELVES_ONLY: {
    id: 'SHELVES_ONLY',
    name: 'Shelves Only',
    description: 'Multiple adjustable shelves for folded items',
    zones: [
      {
        type: WardrobeZoneType.SHELVES,
        height: 200,
        shelfCount: 4,
      },
    ],
    minHeight: 170,
    minWidth: 40,
    maxWidth: 100,
    tags: ['storage', 'folded', 'organized'],
    icon: 'shelves',
    extraCost: 600,
  },

  MIXED_STORAGE_COMPLEX: {
    id: 'MIXED_STORAGE_COMPLEX',
    name: 'Mixed Storage',
    description: 'Combination of shelves and drawers with varied heights',
    zones: [
      {
        type: WardrobeZoneType.SHELVES,
        height: 120,
        shelfCount: 2,
      },
      {
        type: WardrobeZoneType.DRAWERS,
        height: 80,
        drawerCount: 4,
        drawerHeights: [15, 15, 15, 15],
        addShelfAtTheTop: true,
      },
    ],
    minHeight: 170,
    minWidth: 40,
    maxWidth: 100,
    tags: ['complex', 'custom', 'versatile'],
    icon: 'mixed-complex',
    extraCost: 2300,
  },

  HANGING_WITH_DRAWERS: {
    id: 'HANGING_WITH_DRAWERS',
    name: 'Hanging + Drawers',
    description: 'Hanging space on top with drawer storage below',
    zones: [
      {
        type: WardrobeZoneType.HANGING_LONG,
        height: 120,
        rodHeight: 109,
      },
      {
        type: WardrobeZoneType.DRAWERS,
        height: 80,
        drawerCount: 4,
        drawerHeights: [15, 15, 15, 15],
        addShelfAtTheTop: true,
      },
    ],
    minHeight: 160,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'versatile'],
    icon: 'hanging-drawers',
    extraCost: 2300,
  },

  DOUBLE_HANGING: {
    id: 'DOUBLE_HANGING',
    name: 'Double Hanging',
    description: 'Two hanging rods for shirts and folded pants',
    zones: [
      {
        type: WardrobeZoneType.HANGING_MEDIUM,
        height: 100,
        rodHeight: 89,
      },
      {
        type: WardrobeZoneType.HANGING_MEDIUM,
        height: 100,
        rodHeight: 89,
      },
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['shirts', 'pants', 'mens', 'organized'],
    icon: 'hanging-double',
    extraCost: 600,
  },

  ONE_TOP_SHELF: {
    id: 'ONE_TOP_SHELF',
    name: 'One top Shelf',
    description: 'One top shelf',
    zones: [
      {
        type: WardrobeZoneType.SHELVES_FIXED,
        height: 80,
        shelfCount: 1,
        shelfSpacing: 40,
      },
      {
        type: WardrobeZoneType.EMPTY,
        height: 120,
      },
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['shirts', 'pants', 'mens', 'organized'],
    icon: 'hanging-double',
    extraCost: 0,
  },
}

/**
 * Get templates that fit within given dimensions
 */
export function getValidTemplates(
  width: number,
  height: number
): WardrobeTemplate[] {
  return Object.values(WARDROBE_TEMPLATES).filter((template) => {
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
export function getTemplateById(id: string): WardrobeTemplate | undefined {
  return WARDROBE_TEMPLATES[id]
}

/**
 * Get templates by tags
 */
export function getTemplatesByTags(tags: string[]): WardrobeTemplate[] {
  return Object.values(WARDROBE_TEMPLATES).filter((template) =>
    template.tags?.some((tag) => tags.includes(tag))
  )
}

/**
 * Calculate if a template fits exactly or needs adjustment
 */
export function calculateTemplateAdjustment(
  template: WardrobeTemplate,
  targetHeight: number
): WardrobeZone[] {
  const templateHeight = template.zones.reduce(
    (sum, zone) => sum + zone.height,
    0
  )

  if (templateHeight === targetHeight) {
    return template.zones
  }

  // Proportionally adjust zone heights
  const ratio = targetHeight / templateHeight
  return template.zones.map((zone) => ({
    ...zone,
    height: Math.round(zone.height * ratio),
  }))
}
