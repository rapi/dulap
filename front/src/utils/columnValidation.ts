import { getValidConfigurations } from '~/config/columnConstraints'

/**
 * Check which column counts are valid for given furniture dimensions
 * A column count is valid if at least one configuration type can be used
 * 
 * @param width Total furniture width
 * @param height Total furniture height (excluding plinth)
 * @param depth Total furniture depth
 * @param plintHeight Height of the plinth (used to calculate actual column height)
 * @returns Object with column counts as keys and validity as boolean values
 */
export function getValidColumnCounts(
  width: number,
  height: number,
  depth: number,
  plintHeight: number = 0
): Record<number, boolean> {
  const columnHeight = height - plintHeight
  const possibleColumnCounts = [1, 2, 3, 4]
  
  const validityMap: Record<number, boolean> = {}
  
  for (const columnCount of possibleColumnCounts) {
    const columnWidth = width / columnCount
    const columnDimensions = {
      width: columnWidth,
      height: columnHeight,
      depth: depth,
    }
    
    // Check if there are any valid configurations for this column size
    const validConfigurations = getValidConfigurations(columnDimensions)
    validityMap[columnCount] = validConfigurations.length > 0
  }
  
  return validityMap
}

/**
 * Get the first valid column count from a list of preferences
 * If none of the preferences are valid, returns the first valid count
 * If no counts are valid (edge case), returns 1
 * 
 * @param validityMap Map of column counts to their validity
 * @param preferences Ordered list of preferred column counts
 * @returns A valid column count
 */
export function getFirstValidColumnCount(
  validityMap: Record<number, boolean>,
  preferences: number[] = [1, 2, 3, 4]
): number {
  // First try preferences in order
  for (const count of preferences) {
    if (validityMap[count]) {
      return count
    }
  }
  
  // If no preference is valid, get any valid count
  for (const count of [1, 2, 3, 4]) {
    if (validityMap[count]) {
      return count
    }
  }
  
  // Edge case: no valid counts (shouldn't happen with proper constraints)
  console.warn('No valid column counts found for given dimensions')
  return 1
}

/**
 * Check if a specific column count is valid for given dimensions
 * 
 * @param columnCount Number of columns to check
 * @param width Total furniture width
 * @param height Total furniture height (excluding plinth)
 * @param depth Total furniture depth
 * @param plintHeight Height of the plinth
 * @returns Whether the column count is valid
 */
export function isColumnCountValid(
  columnCount: number,
  width: number,
  height: number,
  depth: number,
  plintHeight: number = 0
): boolean {
  const validityMap = getValidColumnCounts(width, height, depth, plintHeight)
  return validityMap[columnCount] ?? false
}
