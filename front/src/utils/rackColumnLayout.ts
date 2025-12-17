import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'

/**
 * Rack Column Layout Calculator
 * 
 * Automatically determines optimal column configuration based on total width.
 * 
 * Rules:
 * - Column width range: 41-80cm per column
 * - 40-80cm: 1 column
 * - 81-160cm: 2 columns (equal split)
 * - 161-250cm: 3 columns (equal split)
 */

export interface RackColumnLayout {
  columnCount: number
  columnWidths: number[]
  columnPositions: number[] // X positions from left
  columnConfigurations: ColumnConfigurationType[]
  layoutType: 'single' | 'double' | 'triple'
}

interface ColumnSpec {
  width: number
  type: 'standard'
}

/**
 * Gets default column configuration based on width
 * Rack columns typically use shelves with or without doors
 */
function getDefaultConfiguration(width: number): ColumnConfigurationType {
  // For racks, we'll use door configurations as placeholders
  // The actual rack template will override these
  if (width >= 41 && width <= 60) {
    return ColumnConfigurationType.DOOR_3_SHELVES
  } else {
    return ColumnConfigurationType.DOOR_SPLIT_3_SHELVES
  }
}

/**
 * Main function to calculate rack column layout
 * 
 * Rules:
 * - 40-80cm: 1 column (full width)
 * - 81-160cm: 2 columns (equal split)
 * - 161-250cm: 3 columns (equal split)
 */
export function calculateRackColumnLayout(totalWidth: number): RackColumnLayout {
  let columns: ColumnSpec[] = []
  let layoutType: RackColumnLayout['layoutType'] = 'single'
  
  if (totalWidth >= 40 && totalWidth <= 80) {
    // 1 column - full width
    columns = [{ 
      width: totalWidth, 
      type: 'standard'
    }]
    layoutType = 'single'
    
  } else if (totalWidth >= 81 && totalWidth <= 160) {
    // 2 columns - equal split
    const columnWidth = totalWidth / 2
    columns = [
      { width: columnWidth, type: 'standard' },
      { width: columnWidth, type: 'standard' }
    ]
    layoutType = 'double'
    
  } else if (totalWidth >= 161 && totalWidth <= 250) {
    // 3 columns - equal split
    const columnWidth = totalWidth / 3
    columns = [
      { width: columnWidth, type: 'standard' },
      { width: columnWidth, type: 'standard' },
      { width: columnWidth, type: 'standard' }
    ]
    layoutType = 'triple'
    
  } else {
    // Fallback for out-of-range widths (< 40cm or > 250cm)
    columns = [{ 
      width: totalWidth, 
      type: 'standard'
    }]
    layoutType = 'single'
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
export function validateRackLayout(layout: RackColumnLayout): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check each column width is valid (41-80cm)
  for (let i = 0; i < layout.columnCount; i++) {
    const width = layout.columnWidths[i]
    
    if (width < 41 || width > 80) {
      errors.push(`Column ${i + 1} width ${width}cm is invalid (must be 41-80cm)`)
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
