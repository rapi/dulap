import { useMemo } from 'react'
import {
  FurnitureType,
  getConstraints,
  calculatePrice,
  getImageDimension,
  validateAllDimensions,
} from '~/config/furnitureConstraints'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'

/**
 * Custom hook to access furniture constraints and utilities
 * Provides reactive constraint data and helper functions
 *
 * @param type - The furniture type (stand, bedside, tv-stand)
 * @param dimensions - Current dimensions
 * @param columns
 * @param columnConfigTypes
 *
 * @example
 * const { constraints, price, availableSections, imageHeight } = useFurnitureConstraints(
 *   'stand',
 *   { width: 80, height: 70, depth: 40, plintHeight: 2 },
 *   4,
 *   false
 * )
 */

export function useFurnitureConstraints(
  type: FurnitureType,
  dimensions: {
    width: number
    height: number
    depth: number
    plintHeight: number
  },
  columns: number,
  columnConfigTypes?: ColumnConfigurationType[],
  isPushOpening?: boolean
) {
  const constraints = useMemo(() => getConstraints(type), [type])

  const price = useMemo(
    () =>
      calculatePrice(
        type,
        dimensions,
        columns,
        3,
        columnConfigTypes,
        isPushOpening
      ),
    [type, dimensions, columns, columnConfigTypes, isPushOpening]
  )

  const imageHeight = useMemo(
    () =>
      getImageDimension(constraints.images.heightThresholds, dimensions.height),
    [constraints.images.heightThresholds, dimensions.height]
  )

  const imageWidth = useMemo(
    () =>
      getImageDimension(constraints.images.widthThresholds, dimensions.width),
    [constraints.images.widthThresholds, dimensions.width]
  )

  const imagePlintHeight = useMemo(
    () =>
      getImageDimension(
        constraints.images.plintHeightThresholds,
        dimensions.plintHeight
      ),
    [constraints.images.plintHeightThresholds, dimensions.plintHeight]
  )

  const validation = useMemo(
    () => validateAllDimensions(type, dimensions),
    [type, dimensions]
  )

  return {
    constraints,
    price,
    imageHeight,
    imageWidth,
    imagePlintHeight,
    validation,
  }
}

/**
 * Hook that returns dimension ranges in the format expected by existing components
 * This provides backward compatibility with the current component structure
 */
export function useDimensionRanges(type: FurnitureType) {
  const constraints = getConstraints(type)

  return useMemo(
    () => ({
      widthRange: [
        constraints.dimensions.width.min,
        constraints.dimensions.width.max,
      ] as [number, number],
      heightRange: [
        constraints.dimensions.height.min,
        constraints.dimensions.height.max,
      ] as [number, number],
      depthRange: [
        constraints.dimensions.depth.min,
        constraints.dimensions.depth.max,
      ] as [number, number],
      plintHeightRange: [
        constraints.dimensions.plintHeight.min,
        constraints.dimensions.plintHeight.max,
      ] as [number, number],
    }),
    [constraints]
  )
}

/**
 * Hook that returns default values for a furniture type
 */
export function useFurnitureDefaults(type: FurnitureType) {
  const constraints = getConstraints(type)

  return useMemo(
    () => ({
      width: constraints.dimensions.width.default,
      height: constraints.dimensions.height.default,
      depth: constraints.dimensions.depth.default,
      plintHeight: constraints.dimensions.plintHeight.default,
      sections: constraints.sections.default,
      columns: constraints.columns.default,
      colors: constraints.colors,
    }),
    [constraints]
  )
}
