// utils/columnConfigUrl.ts
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'

/**
 * Mapping between ColumnConfigurationType and compact URL codes
 * Format: [TYPE][DOOR_SIDE]
 * Examples:
 *   DR3 = DRAWERS_3 (no doorOpeningSide)
 *   D1SL = DOOR_1_SHELF with doorOpeningSide='left'
 *   D2SR = DOOR_2_SHELVES with doorOpeningSide='right'
 *   DS3S = DOOR_SPLIT_3_SHELVES (no doorOpeningSide needed for split doors)
 */
const TYPE_TO_CODE: Record<ColumnConfigurationType, string> = {
  // Drawers (1-5)
  [ColumnConfigurationType.DRAWERS_1]: 'DR1',
  [ColumnConfigurationType.DRAWERS_2]: 'DR2',
  [ColumnConfigurationType.DRAWERS_3]: 'DR3',
  [ColumnConfigurationType.DRAWERS_4]: 'DR4',
  [ColumnConfigurationType.DRAWERS_5]: 'DR5',
  
  // Single door with shelves (1-5 shelves)
  [ColumnConfigurationType.DOOR_1_SHELF]: 'D1S',
  [ColumnConfigurationType.DOOR_2_SHELVES]: 'D2S',
  [ColumnConfigurationType.DOOR_3_SHELVES]: 'D3S',
  [ColumnConfigurationType.DOOR_4_SHELVES]: 'D4S',
  [ColumnConfigurationType.DOOR_5_SHELVES]: 'D5S',
  
  // Split doors with shelves (1-5 shelves)
  [ColumnConfigurationType.DOOR_SPLIT_1_SHELF]: 'DS1S',
  [ColumnConfigurationType.DOOR_SPLIT_2_SHELVES]: 'DS2S',
  [ColumnConfigurationType.DOOR_SPLIT_3_SHELVES]: 'DS3S',
  [ColumnConfigurationType.DOOR_SPLIT_4_SHELVES]: 'DS4S',
  [ColumnConfigurationType.DOOR_SPLIT_5_SHELVES]: 'DS5S',
}

const CODE_TO_TYPE: Record<string, ColumnConfigurationType> = Object.fromEntries(
  Object.entries(TYPE_TO_CODE).map(([type, code]) => [code, type as ColumnConfigurationType])
) as Record<string, ColumnConfigurationType>

/**
 * Encode column configurations to URL-friendly string
 * Format: "D1SL,DR3,D2SR,DS3S"
 * 
 * @example
 * encodeColumnConfigs([
 *   { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
 *   { type: ColumnConfigurationType.DRAWERS_3 },
 *   { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' }
 * ])
 * // Returns: "D1SL,DR3,D2SR"
 */
export function encodeColumnConfigs(
  configs: ColumnConfigurationWithOptions[]
): string {
  return configs
    .map((config) => {
      const code = TYPE_TO_CODE[config.type]
      if (!code) return 'DR3' // Fallback to DRAWERS_3 if unknown type
      
      // Add door side suffix for single-door configurations
      if (config.doorOpeningSide) {
        return code + (config.doorOpeningSide === 'left' ? 'L' : 'R')
      }
      
      return code
    })
    .join(',')
}

/**
 * Decode URL string to column configurations
 * Handles invalid codes gracefully by skipping them
 * 
 * @example
 * decodeColumnConfigs("D1SL,DR3,D2SR")
 * // Returns: [
 * //   { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
 * //   { type: ColumnConfigurationType.DRAWERS_3 },
 * //   { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' }
 * // ]
 */
export function decodeColumnConfigs(
  encoded: string
): ColumnConfigurationWithOptions[] {
  if (!encoded || typeof encoded !== 'string') {
    return []
  }

  const results: ColumnConfigurationWithOptions[] = []
  
  for (const code of encoded.split(',')) {
    const trimmedCode = code.trim()
    if (!trimmedCode) continue

    // Check for door side suffix (L or R)
    const lastChar = trimmedCode[trimmedCode.length - 1]
    let doorOpeningSide: 'left' | 'right' | undefined
    let baseCode = trimmedCode

    if (lastChar === 'L' || lastChar === 'R') {
      doorOpeningSide = lastChar === 'L' ? 'left' : 'right'
      baseCode = trimmedCode.slice(0, -1)
    }

    // Look up the configuration type
    const type = CODE_TO_TYPE[baseCode]
    if (!type) {
      console.warn(`Unknown column configuration code: ${trimmedCode}`)
      continue
    }

    // Only include doorOpeningSide if it's defined (not undefined)
    // This prevents Next.js serialization errors with undefined values
    const config = doorOpeningSide !== undefined 
      ? { type, doorOpeningSide }
      : { type }
    
    results.push(config)
  }
  
  return results
}

/**
 * Validate if a column configuration code is valid
 */
export function isValidColumnConfigCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  
  // Remove door side suffix if present
  const baseCode = code.replace(/[LR]$/, '')
  return baseCode in CODE_TO_TYPE
}

