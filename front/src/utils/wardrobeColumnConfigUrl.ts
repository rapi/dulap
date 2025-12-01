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
 * Format: "F1S,SO,HD" (comma-separated template codes)
 * 
 * @example
 * encodeWardrobeColumnConfigs([
 *   { templateId: 'FULL_HANGING_WITH_1_SHELF', ... },
 *   { templateId: 'SHELVES_ONLY', ... }
 * ])
 * // Returns: "F1S,SO"
 */
export function encodeWardrobeColumnConfigs(
  configs: WardrobeColumnConfiguration[]
): string {
  return configs
    .map((config) => {
      if (config.templateId && TEMPLATE_TO_CODE[config.templateId]) {
        return TEMPLATE_TO_CODE[config.templateId]
      }
      // Default to FULL_HANGING_WITH_1_SHELF if no template or unknown template
      return 'F1S'
    })
    .join(',')
}

/**
 * Decode URL string to wardrobe column configurations
 * Returns template IDs only - the component will reconstruct full configs
 * 
 * @example
 * decodeWardrobeColumnConfigs("F1S,SO,HD")
 * // Returns: ["FULL_HANGING_WITH_1_SHELF", "SHELVES_ONLY", "HANGING_WITH_DRAWERS"]
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
      // Default to FULL_HANGING_WITH_1_SHELF for unknown codes
      results.push('FULL_HANGING_WITH_1_SHELF')
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
