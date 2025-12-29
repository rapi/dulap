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
  doorOpeningSides: ('left' | 'right' | undefined)[] // Door opening side for each column (only for single doors)
  layoutType: 'symmetric' | 'asymmetric-2col' | 'asymmetric-3col'
}

interface ColumnSpec {
  width: number
  type: 'narrow' | 'wide'
  doorType: 'single' | 'split'
  doorOpeningSide?: 'left' | 'right' // Only for single doors
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
 *
 * @param totalWidth - Total wardrobe width in cm
 * @param isMirrored - If true, reverses the column order (e.g., [100, 100, 50] becomes [50, 100, 100])
 */
export function calculateWardrobeColumnLayout(
  totalWidth: number,
  isMirrored: boolean = false
): WardrobeColumnLayout {
  let columns: ColumnSpec[] = []
  let layoutType: WardrobeColumnLayout['layoutType'] = 'symmetric'

  if (totalWidth >= 40 && totalWidth <= 60) {
    // 1 narrow column
    columns = [
      {
        width: totalWidth,
        type: 'narrow',
        doorType: 'single',
        doorOpeningSide: 'right', // Default to right for single narrow columns
      },
    ]
  } else if (totalWidth >= 61 && totalWidth <= 100) {
    // 1 wide column
    columns = [
      {
        width: totalWidth,
        type: 'wide',
        doorType: 'split',
      },
    ]
  } else if (totalWidth >= 101 && totalWidth <= 120) {
    // 2 narrow columns (equal distribution)
    // Left column opens left, right column opens right
    const halfWidth = totalWidth / 2
    columns = [
      {
        width: halfWidth,
        type: 'narrow',
        doorType: 'single',
        doorOpeningSide: 'left',
      },
      {
        width: halfWidth,
        type: 'narrow',
        doorType: 'single',
        doorOpeningSide: 'right',
      },
    ]
  } else if (totalWidth >= 121 && totalWidth <= 150) {
    // 1 wide (2/3 of total) + 1 narrow (1/3 of total)
    const wideWidth = (totalWidth * 2) / 3
    const narrowWidth = totalWidth / 3
    columns = [
      { width: wideWidth, type: 'wide', doorType: 'split' },
      {
        width: narrowWidth,
        type: 'narrow',
        doorType: 'single',
        doorOpeningSide: 'right',
      },
    ]
    layoutType = 'asymmetric-2col'
  } else if (totalWidth >= 151 && totalWidth <= 200) {
    // 2 wide columns (equal distribution)
    const halfWidth = totalWidth / 2
    columns = [
      { width: halfWidth, type: 'wide', doorType: 'split' },
      { width: halfWidth, type: 'wide', doorType: 'split' },
    ]
  } else if (totalWidth >= 201) {
    // 3 columns: 2 wide (2/5 each) + 1 narrow (1/5)
    const wideWidth = (totalWidth * 2) / 5
    const narrowWidth = totalWidth / 5
    columns = [
      { width: wideWidth, type: 'wide', doorType: 'split' },
      { width: wideWidth, type: 'wide', doorType: 'split' },
      {
        width: narrowWidth,
        type: 'narrow',
        doorType: 'single',
        doorOpeningSide: 'right',
      },
    ]
    layoutType = 'asymmetric-3col'
  } else {
    // Fallback for out-of-range widths (< 40cm)
    const isWide = totalWidth >= 61
    columns = [
      {
        width: totalWidth,
        type: isWide ? 'wide' : 'narrow',
        doorType: isWide ? 'split' : 'single',
        doorOpeningSide: isWide ? undefined : 'right',
      },
    ]
  }

  // Calculate positions (from left, centered)
  const positions: number[] = []
  let currentX = -totalWidth / 2

  for (const col of columns) {
    positions.push(currentX + col.width / 2)
    currentX += col.width
  }

  // Get configurations
  const configurations = columns.map((col) =>
    getDefaultConfiguration(col.width)
  )

  // Extract door opening sides (only for single doors)
  const doorOpeningSides = columns.map((col) =>
    col.doorType === 'single' ? col.doorOpeningSide : undefined
  )

  // Apply mirroring if requested and there are multiple columns
  if (isMirrored && columns.length > 1) {
    const mirroredWidths = columns.map((c) => c.width).reverse()
    const mirroredPositions = positions
      .slice()
      .reverse()
      .map((pos) => -pos)
    const mirroredDoorSides = doorOpeningSides
      .slice()
      .reverse()
      .map((side) =>
        side === 'left'
          ? ('right' as const)
          : side === 'right'
            ? ('left' as const)
            : undefined
      )

    return {
      columnCount: columns.length,
      columnWidths: mirroredWidths,
      columnPositions: mirroredPositions,
      columnConfigurations: configurations.slice().reverse(),
      doorOpeningSides: mirroredDoorSides,
      layoutType,
    }
  }

  return {
    columnCount: columns.length,
    columnWidths: columns.map((c) => c.width),
    columnPositions: positions,
    columnConfigurations: configurations,
    doorOpeningSides,
    layoutType,
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
      errors.push(
        `Column ${i + 1} width ${width}cm is invalid (must be 40-80cm narrow or 61-100cm wide)`
      )
    }
  }

  // Check total width matches
  const totalWidth = layout.columnWidths.reduce((sum, w) => sum + w, 0)
  const expectedWidth =
    layout.columnPositions.length > 0
      ? layout.columnPositions[layout.columnPositions.length - 1] -
        layout.columnPositions[0] +
        layout.columnWidths[layout.columnWidths.length - 1] / 2 +
        layout.columnWidths[0] / 2
      : totalWidth

  if (Math.abs(totalWidth - expectedWidth) > 1) {
    errors.push(
      `Column widths don't match expected total: ${totalWidth}cm vs ${expectedWidth}cm`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
