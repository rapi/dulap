// utils/wardrobeColumnConfigUrl.ts
import { WardrobeColumnConfiguration } from '~/types/wardrobeConfigurationTypes'

/**
 * Mapping between wardrobe template IDs and compact URL codes
 * Using short codes to keep URLs manageable
 */
const TEMPLATE_TO_CODE: Record<string, string> = {
  'FULL_HANGING': 'FH',
  'DOUBLE_HANGING': 'DH',
  'HANGING_WITH_DRAWERS': 'HD',
  'HANGING_WITH_SHELVES': 'HS',
  'SHELVES_ONLY': 'SO',
  'DRAWERS_ONLY': 'DO',
  'MIXED_STORAGE_COMPLEX': 'MS',
  'THREE_ZONE_COMBO': 'TZ',
  'SHOE_STORAGE': 'SS',
  'ACCESSORIES_ORGANIZER': 'AO',
}

const CODE_TO_TEMPLATE: Record<string, string> = Object.fromEntries(
  Object.entries(TEMPLATE_TO_CODE).map(([template, code]) => [code, template])
)

/**
 * Encode wardrobe column configurations to URL-friendly string
 * Format: "FH,SO,HD" (comma-separated template codes)
 * 
 * @example
 * encodeWardrobeColumnConfigs([
 *   { templateId: 'FULL_HANGING', ... },
 *   { templateId: 'SHELVES_ONLY', ... }
 * ])
 * // Returns: "FH,SO"
 */
export function encodeWardrobeColumnConfigs(
  configs: WardrobeColumnConfiguration[]
): string {
  return configs
    .map((config) => {
      if (config.templateId && TEMPLATE_TO_CODE[config.templateId]) {
        return TEMPLATE_TO_CODE[config.templateId]
      }
      // Default to SHELVES_ONLY if no template or unknown template
      return 'SO'
    })
    .join(',')
}

/**
 * Decode URL string to wardrobe column configurations
 * Returns template IDs only - the component will reconstruct full configs
 * 
 * @example
 * decodeWardrobeColumnConfigs("FH,SO,HD")
 * // Returns: ["FULL_HANGING", "SHELVES_ONLY", "HANGING_WITH_DRAWERS"]
 */
export function decodeWardrobeColumnConfigs(
  encoded: string
): string[] {
  if (!encoded || typeof encoded !== 'string') {
    return []
  }

  const results: string[] = []
  
  for (const code of encoded.split(',')) {
    const trimmedCode = code.trim()
    if (!trimmedCode) continue

    const templateId = CODE_TO_TEMPLATE[trimmedCode]
    if (!templateId) {
      console.warn(`Unknown wardrobe configuration code: ${trimmedCode}`)
      // Default to SHELVES_ONLY for unknown codes
      results.push('SHELVES_ONLY')
    } else {
      results.push(templateId)
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
