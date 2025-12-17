// utils/wardrobeColumnConfigUrl.ts
import { WardrobeColumnConfiguration } from '~/types/wardrobeConfigurationTypes'

/**
 * Mapping between wardrobe template IDs and compact URL codes
 * Using short codes to keep URLs manageable
 */
const TEMPLATE_TO_CODE: Record<string, string> = {
  'FULL_HANGING_WITH_1_SHELF': 'F1S',
  'FULL_HANGING_WITH_2_DRAWERS': 'F2D',
  'SHELVES_ONLY': 'SO',
  'MIXED_STORAGE_COMPLEX': 'MS',
  'HANGING_WITH_DRAWERS': 'HD',
  'DOUBLE_HANGING': 'DH',
  'ONE_TOP_SHELF': 'OTS',
}

const CODE_TO_TEMPLATE: Record<string, string> = Object.fromEntries(
  Object.entries(TEMPLATE_TO_CODE).map(([template, code]) => [code, template])
)

// Backward compatibility: Map old 'FH' code to new default template
CODE_TO_TEMPLATE['FH'] = 'FULL_HANGING_WITH_1_SHELF'

/**
 * Encode wardrobe column configurations to URL-friendly string
 * Format: "F1S,SO:0,HD" (comma-separated template codes with optional door state)
 * Door state: :0 = open (no door), omitted = closed (has door, default)
 * For backward compatibility, hasDoor=true (closed) is omitted to keep URLs shorter
 * 
 * @example
 * encodeWardrobeColumnConfigs([
 *   { templateId: 'FULL_HANGING_WITH_1_SHELF', hasDoor: true, ... },
 *   { templateId: 'SHELVES_ONLY', hasDoor: false, ... }
 * ])
 * // Returns: "F1S,SO:0"
 */
export function encodeWardrobeColumnConfigs(
  configs: WardrobeColumnConfiguration[]
): string {
  return configs
    .map((config) => {
      const templateCode = config.templateId && TEMPLATE_TO_CODE[config.templateId]
        ? TEMPLATE_TO_CODE[config.templateId]
        : 'F1S' // Default to FULL_HANGING_WITH_1_SHELF if no template or unknown template
      
      // hasDoor defaults to true, so we only encode it if it's false
      // For backward compatibility, we can omit :1 for closed doors
      const hasDoor = config.hasDoor !== false // Default to true
      return hasDoor ? templateCode : `${templateCode}:0`
    })
    .join(',')
}

/**
 * Decode URL string to wardrobe column configurations
 * Returns array of objects with templateId and hasDoor
 * Supports both old format (template codes only) and new format (template:doorState)
 * 
 * @example
 * decodeWardrobeColumnConfigs("F1S,SO:0,HD")
 * // Returns: [
 * //   { templateId: "FULL_HANGING_WITH_1_SHELF", hasDoor: true },
 * //   { templateId: "SHELVES_ONLY", hasDoor: false },
 * //   { templateId: "HANGING_WITH_DRAWERS", hasDoor: true }
 * // ]
 */
export function decodeWardrobeColumnConfigs(
  encoded: string
): Array<{ templateId: string; hasDoor: boolean }> {
  if (!encoded || typeof encoded !== 'string') {
    return []
  }

  const results: Array<{ templateId: string; hasDoor: boolean }> = []
  
  for (const code of encoded.split(',')) {
    const trimmedCode = code.trim()
    if (!trimmedCode) continue

    // Parse format: "TEMPLATE_CODE" or "TEMPLATE_CODE:doorState"
    const parts = trimmedCode.split(':')
    const templateCode = parts[0]
    const doorState = parts[1] // '0' = open (no door), '1' = closed (has door), undefined = default (has door)

    const templateId = CODE_TO_TEMPLATE[templateCode]
    if (!templateId) {
      console.warn(`Unknown wardrobe configuration code: ${templateCode}`)
      // Default to FULL_HANGING_WITH_1_SHELF for unknown codes
      results.push({ templateId: 'FULL_HANGING_WITH_1_SHELF', hasDoor: true })
    } else {
      // hasDoor defaults to true if not specified (backward compatibility)
      const hasDoor = doorState === undefined ? true : doorState === '1'
      results.push({ templateId, hasDoor })
    }
  }
  
  return results
}

/**
 * Validate if a wardrobe configuration code is valid
 */
export function isValidWardrobeConfigCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  return code in CODE_TO_TEMPLATE
}
