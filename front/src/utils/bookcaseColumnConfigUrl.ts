// utils/bookcaseColumnConfigUrl.ts
import { BookcaseColumnConfiguration } from '~/types/bookcaseConfigurationTypes'

/**
 * Mapping between bookcase template IDs and compact URL codes
 * Using short codes to keep URLs manageable
 */
const TEMPLATE_TO_CODE: Record<string, string> = {
  'OPEN_SHELVES_ONLY': 'OS',
  'SHELVES_WITH_FULL_DOOR': 'FD',
  'HALF_OPEN_HALF_CLOSED': 'HC',
  'DRAWERS_AND_SHELVES': 'DS',
  'MIXED_STORAGE': 'MS',
}

const CODE_TO_TEMPLATE: Record<string, string> = Object.fromEntries(
  Object.entries(TEMPLATE_TO_CODE).map(([template, code]) => [code, template])
)

/**
 * Encode bookcase column configurations to URL-friendly string
 * Format: "OS,FD,HC" (comma-separated template codes)
 * 
 * @example
 * encodeBookcaseColumnConfigs([
 *   { templateId: 'OPEN_SHELVES_ONLY', ... },
 *   { templateId: 'SHELVES_WITH_FULL_DOOR', ... }
 * ])
 * // Returns: "OS,FD"
 */
export function encodeBookcaseColumnConfigs(
  configs: BookcaseColumnConfiguration[]
): string {
  return configs
    .map((config) => {
      if (config.templateId && TEMPLATE_TO_CODE[config.templateId]) {
        return TEMPLATE_TO_CODE[config.templateId]
      }
      // Default to OPEN_SHELVES_ONLY if no template or unknown template
      return 'OS'
    })
    .join(',')
}

/**
 * Decode URL string to bookcase column configurations
 * Returns template IDs only - the component will reconstruct full configs
 * 
 * @example
 * decodeBookcaseColumnConfigs("OS,FD,HC")
 * // Returns: ["OPEN_SHELVES_ONLY", "SHELVES_WITH_FULL_DOOR", "HALF_OPEN_HALF_CLOSED"]
 */
export function decodeBookcaseColumnConfigs(
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
      console.warn(`Unknown bookcase configuration code: ${trimmedCode}`)
      // Default to OPEN_SHELVES_ONLY for unknown codes
      results.push('OPEN_SHELVES_ONLY')
    } else {
      results.push(templateId)
    }
  }
  
  return results
}

/**
 * Validate if a bookcase configuration code is valid
 */
export function isValidBookcaseConfigCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  return code in CODE_TO_TEMPLATE
}
