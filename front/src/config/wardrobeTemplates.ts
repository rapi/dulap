import { 
  WardrobeTemplate, 
  WardrobeZoneType,
  WardrobeZone
} from '~/types/wardrobeConfigurationTypes'

/**
 * Predefined wardrobe column templates
 * Based on common wardrobe configurations and user sketches
 */
export const WARDROBE_TEMPLATES: Record<string, WardrobeTemplate> = {
  // ============ HANGING FOCUSED ============
  FULL_HANGING: {
    id: 'FULL_HANGING',
    name: 'Full Hanging',
    description: 'Full-height hanging space for long dresses and coats',
    zones: [
      {
        type: WardrobeZoneType.HANGING_LONG,
        height: 170,
        rodHeight: 160
      }
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['dresses', 'coats', 'womens'],
    icon: 'hanging-long'
  },

  DOUBLE_HANGING: {
    id: 'DOUBLE_HANGING', 
    name: 'Double Hanging',
    description: 'Two hanging rods for shirts and folded pants',
    zones: [
      {
        type: WardrobeZoneType.HANGING_MEDIUM,
        height: 90,
        rodHeight: 80
      },
      {
        type: WardrobeZoneType.HANGING_MEDIUM,
        height: 90,
        rodHeight: 80
      }
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['shirts', 'pants', 'mens', 'organized'],
    icon: 'hanging-double'
  },

  // ============ MIXED CONFIGURATIONS ============
  HANGING_WITH_DRAWERS: {
    id: 'HANGING_WITH_DRAWERS',
    name: 'Hanging + Drawers',
    description: 'Hanging space on top with drawer storage below',
    zones: [
      {
        type: WardrobeZoneType.HANGING_MEDIUM,
        height: 120,
        rodHeight: 110
      },
      {
        type: WardrobeZoneType.DRAWERS,
        height: 38,
        drawerCount: 2,
        drawerHeights: [19, 19]
      }
    ],
    minHeight: 160,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'versatile'],
    icon: 'hanging-drawers'
  },

  HANGING_WITH_SHELVES: {
    id: 'HANGING_WITH_SHELVES',
    name: 'Hanging + Shelves',
    description: 'Hanging rod with shelf storage below',
    zones: [
      {
        type: WardrobeZoneType.HANGING_SHORT,
        height: 75,
        rodHeight: 70
      },
      {
        type: WardrobeZoneType.SHELVES,
        height: 105,
        shelfCount: 4,
        shelfSpacing: 26
      }
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['mixed', 'flexible'],
    icon: 'hanging-shelves'
  },

  // ============ STORAGE FOCUSED ============
  SHELVES_ONLY: {
    id: 'SHELVES_ONLY',
    name: 'Shelves Only',
    description: 'Multiple adjustable shelves for folded items',
    zones: [
      {
        type: WardrobeZoneType.SHELVES,
        height: 170,
        shelfCount: 6,
        shelfSpacing: 28
      }
    ],
    minHeight: 170,
    minWidth: 40,
    maxWidth: 100,
    tags: ['storage', 'folded', 'organized'],
    icon: 'shelves'
  },

  DRAWERS_ONLY: {
    id: 'DRAWERS_ONLY',
    name: 'Drawers Only',
    description: 'Multiple drawers for organized storage',
    zones: [
      {
        type: WardrobeZoneType.DRAWERS,
        height: 170,
        drawerCount: 5,
        drawerHeights: [34, 34, 34, 34, 34]
      }
    ],
    minHeight: 170,
    minWidth: 40,
    maxWidth: 100,
    tags: ['storage', 'underwear', 'organized'],
    icon: 'drawers'
  },

  // ============ COMPLEX CONFIGURATIONS (from user sketches) ============
  MIXED_STORAGE_COMPLEX: {
    id: 'MIXED_STORAGE_COMPLEX',
    name: 'Mixed Storage',
    description: 'Combination of shelves and drawers with varied heights',
    zones: [
      {
        type: WardrobeZoneType.SHELVES,
        height: 35,
        shelfCount: 1
      },
      {
        type: WardrobeZoneType.SHELVES,
        height: 34,
        shelfCount: 1
      },
      {
        type: WardrobeZoneType.SHELVES,
        height: 34,
        shelfCount: 1
      },
      {
        type: WardrobeZoneType.SHELVES,
        height: 38,
        shelfCount: 1
      },
      {
        type: WardrobeZoneType.DRAWERS,
        height: 36,
        drawerCount: 2,
        drawerHeights: [18, 18]
      }
    ],
    minHeight: 177,
    minWidth: 40,
    maxWidth: 100,
    tags: ['complex', 'custom', 'versatile'],
    icon: 'mixed-complex'
  },

  THREE_ZONE_COMBO: {
    id: 'THREE_ZONE_COMBO',
    name: 'Three Zone Combo',
    description: 'Hanging, shelves, and drawers in one column',
    zones: [
      {
        type: WardrobeZoneType.HANGING_SHORT,
        height: 70,
        rodHeight: 65
      },
      {
        type: WardrobeZoneType.SHELVES,
        height: 60,
        shelfCount: 2,
        shelfSpacing: 30
      },
      {
        type: WardrobeZoneType.DRAWERS,
        height: 50,
        drawerCount: 2,
        drawerHeights: [25, 25]
      }
    ],
    minHeight: 180,
    minWidth: 40,
    maxWidth: 100,
    tags: ['versatile', 'complete'],
    icon: 'three-zone'
  },

  // ============ SPECIALIZED ============
  SHOE_STORAGE: {
    id: 'SHOE_STORAGE',
    name: 'Shoe Storage',
    description: 'Optimized for shoe storage with angled racks',
    zones: [
      {
        type: WardrobeZoneType.SHELVES,
        height: 40,
        shelfCount: 1
      },
      {
        type: WardrobeZoneType.SHOE_RACK,
        height: 130,
      }
    ],
    minHeight: 170,
    minWidth: 40,
    maxWidth: 60,
    tags: ['shoes', 'specialized'],
    icon: 'shoe-rack'
  },

  ACCESSORIES_ORGANIZER: {
    id: 'ACCESSORIES_ORGANIZER',
    name: 'Accessories',
    description: 'Specialized storage for accessories and small items',
    zones: [
      {
        type: WardrobeZoneType.ACCESSORIES,
        height: 30,
        accessories: ['ties', 'belts']
      },
      {
        type: WardrobeZoneType.DRAWERS_WITH_DIVIDERS,
        height: 60,
        drawerCount: 3,
        drawerHeights: [20, 20, 20]
      },
      {
        type: WardrobeZoneType.SHELVES,
        height: 80,
        shelfCount: 3
      }
    ],
    minHeight: 170,
    minWidth: 40,
    maxWidth: 80,
    tags: ['accessories', 'organized', 'specialized'],
    icon: 'accessories'
  }
}

/**
 * Get templates that fit within given dimensions
 */
export function getValidTemplates(
  width: number, 
  height: number
): WardrobeTemplate[] {
  return Object.values(WARDROBE_TEMPLATES).filter(template => {
    const widthValid = width >= template.minWidth && 
                      (!template.maxWidth || width <= template.maxWidth)
    const heightValid = height >= template.minHeight && 
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
  return Object.values(WARDROBE_TEMPLATES).filter(template =>
    template.tags?.some(tag => tags.includes(tag))
  )
}

/**
 * Calculate if a template fits exactly or needs adjustment
 */
export function calculateTemplateAdjustment(
  template: WardrobeTemplate,
  targetHeight: number
): WardrobeZone[] {
  const templateHeight = template.zones.reduce((sum, zone) => sum + zone.height, 0)
  
  if (templateHeight === targetHeight) {
    return template.zones
  }
  
  // Proportionally adjust zone heights
  const ratio = targetHeight / templateHeight
  return template.zones.map(zone => ({
    ...zone,
    height: Math.round(zone.height * ratio)
  }))
}
