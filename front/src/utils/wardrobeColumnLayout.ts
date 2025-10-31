import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'

/**
 * Wardrobe Column Layout Calculator
 * 
 * Automatically determines optimal column configuration based on total width.
 * 
 * Rules:
 * - Narrow (single door): 40-80cm
 * - Wide (split doors): 61-100cm (81-100cm MUST be split)
 * - Priority: Minimize columns → Maximize symmetry → Prefer wide columns
 */

export interface WardrobeColumnLayout {
  columnCount: number
  columnWidths: number[]
  columnPositions: number[] // X positions from left
  columnConfigurations: ColumnConfigurationType[]
  layoutType: 'symmetric' | 'asymmetric-2col' | 'asymmetric-3col'
}

interface ColumnSpec {
  width: number
  type: 'narrow' | 'wide'
  doorType: 'single' | 'split'
}

/**
 * Validates if a width is valid for narrow column (single door)
 * Narrow: 40-60cm
 */
function isValidNarrow(width: number): boolean {
  return width >= 40 && width <= 60
}

/**
 * Validates if a width is valid for wide column (split doors)
 * Wide: 61-100cm
 */
function isValidWide(width: number): boolean {
  return width >= 61 && width <= 100
}

/**
 * Gets default column configuration based on width
 * - Narrow (40-60cm): Single door with 3 shelves
 * - Wide (61-100cm): Split doors with 3 shelves
 */
function getDefaultConfiguration(width: number): ColumnConfigurationType {
  if (width >= 40 && width <= 60) {
    return ColumnConfigurationType.DOOR_3_SHELVES
  } else {
    return ColumnConfigurationType.DOOR_SPLIT_3_SHELVES
  }
}


/**
 * Main function to calculate wardrobe column layout
 * 
 * Rules:
 * - 40-60cm: 1 narrow
 * - 61-100cm: 1 wide
 * - 101-120cm: 2 narrow (equal distribution)
 * - 121-150cm: 1 wide (2/3) + 1 narrow (1/3)
 * - 151-200cm: 2 wide (equal distribution)
 * - 201cm+: 2 wide (2/5 each) + 1 narrow (1/5)
 */
export function calculateWardrobeColumnLayout(totalWidth: number): WardrobeColumnLayout {
  let columns: ColumnSpec[] = []
  let layoutType: WardrobeColumnLayout['layoutType'] = 'symmetric'
  
  if (totalWidth >= 40 && totalWidth <= 60) {
    // 1 narrow column
    columns = [{ 
      width: totalWidth, 
      type: 'narrow', 
      doorType: 'single' 
    }]
    
  } else if (totalWidth >= 61 && totalWidth <= 100) {
    // 1 wide column
    columns = [{ 
      width: totalWidth, 
      type: 'wide', 
      doorType: 'split' 
    }]
    
  } else if (totalWidth >= 101 && totalWidth <= 120) {
    // 2 narrow columns (equal distribution)
    const halfWidth = totalWidth / 2
    columns = [
      { width: halfWidth, type: 'narrow', doorType: 'single' },
      { width: halfWidth, type: 'narrow', doorType: 'single' }
    ]
    
  } else if (totalWidth >= 121 && totalWidth <= 150) {
    // 1 wide (2/3 of total) + 1 narrow (1/3 of total)
    const wideWidth = (totalWidth * 2) / 3
    const narrowWidth = totalWidth / 3
    columns = [
      { width: wideWidth, type: 'wide', doorType: 'split' },
      { width: narrowWidth, type: 'narrow', doorType: 'single' }
    ]
    layoutType = 'asymmetric-2col'
    
  } else if (totalWidth >= 151 && totalWidth <= 200) {
    // 2 wide columns (equal distribution)
    const halfWidth = totalWidth / 2
    columns = [
      { width: halfWidth, type: 'wide', doorType: 'split' },
      { width: halfWidth, type: 'wide', doorType: 'split' }
    ]
    
  } else if (totalWidth >= 201) {
    // 3 columns: 2 wide (2/5 each) + 1 narrow (1/5)
    const wideWidth = (totalWidth * 2) / 5
    const narrowWidth = totalWidth / 5
    columns = [
      { width: wideWidth, type: 'wide', doorType: 'split' },
      { width: wideWidth, type: 'wide', doorType: 'split' },
      { width: narrowWidth, type: 'narrow', doorType: 'single' }
    ]
    layoutType = 'asymmetric-3col'
    
  } else {
    // Fallback for out-of-range widths (< 40cm)
    columns = [{ 
      width: totalWidth, 
      type: totalWidth >= 61 ? 'wide' : 'narrow',
      doorType: totalWidth >= 61 ? 'split' : 'single'
    }]
  }
  
  // Calculate positions (from left, centered)
  const positions: number[] = []
  let currentX = -totalWidth / 2
  
  for (const col of columns) {
    positions.push(currentX + col.width / 2)
    currentX += col.width
  }
  
  // Get configurations
  const configurations = columns.map(col => getDefaultConfiguration(col.width))
  
  return {
    columnCount: columns.length,
    columnWidths: columns.map(c => c.width),
    columnPositions: positions,
    columnConfigurations: configurations,
    layoutType
  }
}

/**
 * Helper to validate a layout
 */
export function validateWardrobeLayout(layout: WardrobeColumnLayout): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check each column width is valid
  for (let i = 0; i < layout.columnCount; i++) {
    const width = layout.columnWidths[i]
    
    if (!isValidNarrow(width) && !isValidWide(width)) {
      errors.push(`Column ${i + 1} width ${width}cm is invalid (must be 40-80cm narrow or 61-100cm wide)`)
    }
  }
  
  // Check total width matches
  const totalWidth = layout.columnWidths.reduce((sum, w) => sum + w, 0)
  const expectedWidth = layout.columnPositions.length > 0 
    ? (layout.columnPositions[layout.columnPositions.length - 1] - layout.columnPositions[0]) + layout.columnWidths[layout.columnWidths.length - 1] / 2 + layout.columnWidths[0] / 2
    : totalWidth
    
  if (Math.abs(totalWidth - expectedWidth) > 1) {
    errors.push(`Column widths don't match expected total: ${totalWidth}cm vs ${expectedWidth}cm`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

