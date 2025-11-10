import { ColorName, getColorItemByName } from '~/utils/colorDictionary'
import { applyColorToObject } from './furnitureUtils'
import * as THREE from 'three'

/**
 * Handle-specific constants
 */
export const HANDLE_CONSTANTS = {
  WHITE_COLOR: '#ffffff',
  METALLIC_COLOR: '#9c9c9c',
  ROUND_HANDLE_DEPTH_OFFSET: -1,
  ROUND_HANDLE_WIDTH: 2.5,
  PROFILE_HANDLE_LENGTH: 17.5,
  PROFILE_HANDLE_DEPTH: 1.2,
  PROFILE_HANDLE_METAL_WIDTH: 0.1,
  // TODO: 2.3 - magic number! The center positions of the 3d model are wrong, had to move it manually...
  // We have to change it in blender.
  PROFILE_HANDLE_DOOR_RIGHT_OFFSET: 2.3,
} as const

/**
 * Determines if a handle should be white based on the door/drawer color
 */
export const shouldUseWhiteHandle = (selectedColor: string): boolean => {
  const whiteHex = getColorItemByName(ColorName.White)?.hexCode
  const beigeHex = getColorItemByName(ColorName.Biege)?.hexCode
  return selectedColor === whiteHex || selectedColor === beigeHex
}

/**
 * Gets the appropriate handle color based on the door/drawer color
 */
export const getHandleColor = (selectedColor: string): string => {
  return shouldUseWhiteHandle(selectedColor)
    ? HANDLE_CONSTANTS.WHITE_COLOR
    : HANDLE_CONSTANTS.METALLIC_COLOR
}

/**
 * Applies color to round handle
 */
const applyRoundHandleColor = (
  handlePivot: THREE.Object3D,
  selectedColor: string
): void => {
  const handleColor = getHandleColor(selectedColor)
  applyColorToObject(handlePivot, handleColor)
}

/**
 * Applies color to profile handle
 */
const applyProfileHandleColor = (
  handlePivot: THREE.Object3D,
  selectedColor: string
): void => {
  const handleColor = getHandleColor(selectedColor)
  applyColorToObject(handlePivot, handleColor)
}

/**
 * Positions a round handle based on parent dimensions and options
 */
const positionRoundHandle = (
  handlePivot: THREE.Object3D,
  height: number,
  depth: number,
  defaultHandleTopOffset: number,
  options?: {
    // Custom X position (if not provided, uses 0 for drawers or calculated for doors)
    x?: number
    // For doors: offset from door edge for X positioning
    doorOffsetX?: number
    // For doors: whether this is a right-opening door
    isRightOpening?: boolean
    // For wardrobes: custom height from bottom (overrides defaultHandleTopOffset)
    handleHeightFromBottom?: number
  }
): void => {
  let xPosition = 0
  let handleTopOffset = defaultHandleTopOffset

  // Calculate X position
  if (options?.x !== undefined) {
    xPosition = options.x
  } else if (options?.doorOffsetX !== undefined && options?.isRightOpening !== undefined) {
    // For doors: calculate X position based on opening side
    const roundHandleWidth = HANDLE_CONSTANTS.ROUND_HANDLE_WIDTH
    xPosition = options.isRightOpening
      ? options.doorOffsetX + roundHandleWidth
      : options.doorOffsetX - roundHandleWidth
  }

  // Calculate Y position (handle top offset)
  if (options?.handleHeightFromBottom !== undefined) {
    // For wardrobes: convert height from bottom to offset from top
    handleTopOffset = height - options.handleHeightFromBottom
  }

  handlePivot.position.set(
    xPosition,
    height - handleTopOffset,
    depth + HANDLE_CONSTANTS.ROUND_HANDLE_DEPTH_OFFSET
  )
}

/**
 * Positions a profile handle based on parent dimensions and options
 */
const positionProfileHandle = (
  handlePivot: THREE.Object3D,
  height: number,
  depth: number,
  options?: {
    // Custom X position (if not provided, uses calculated position)
    x?: number
    // Width of the parent container (door/drawer) for positioning calculations
    parentWidth?: number
    // Whether this is a right-opening door
    isRightOpening?: boolean
  }
): void => {
  const { PROFILE_HANDLE_LENGTH, PROFILE_HANDLE_DEPTH, PROFILE_HANDLE_METAL_WIDTH } = HANDLE_CONSTANTS
  
  let xPosition = 0
  
  // Calculate X position if custom positioning is needed
  if (options?.x !== undefined) {
    xPosition = options.x
  } else if (options?.parentWidth !== undefined) {
    if (options.isRightOpening !== undefined) {
      // For doors: position based on opening side
      if (options.isRightOpening) {
        xPosition = -options.parentWidth / 2  + PROFILE_HANDLE_LENGTH / 1.5
      } else {
        xPosition = options.parentWidth / 2  - PROFILE_HANDLE_LENGTH / 1.5
      }
    } else {
      // For drawers: position at left side
      xPosition = 0
    }
  }

  handlePivot.position.set(
    xPosition,
    height - PROFILE_HANDLE_DEPTH / 2,
    depth - PROFILE_HANDLE_METAL_WIDTH
  )
}

/**
 * Complete setup for round handle: color and positioning
 * Note: Visibility should be set before calling this function
 */
export const setupRoundHandle = (
  handlePivot: THREE.Object3D,
  selectedColor: string,
  height: number,
  depth: number,
  defaultHandleTopOffset: number,
  options?: {
    // Custom X position (if not provided, uses 0 for drawers or calculated for doors)
    x?: number
    // For doors: offset from door edge for X positioning
    doorOffsetX?: number
    // For doors: whether this is a right-opening door
    isRightOpening?: boolean
    // For wardrobes: custom height from bottom (overrides defaultHandleTopOffset)
    handleHeightFromBottom?: number
  }
): void => {
  applyRoundHandleColor(handlePivot, selectedColor)
  positionRoundHandle(handlePivot, height, depth, defaultHandleTopOffset, options)
}

/**
 * Complete setup for profile handle: color and positioning
 * Note: Visibility should be set before calling this function
 */
export const setupProfileHandle = (
  handlePivot: THREE.Object3D,
  selectedColor: string,
  height: number,
  depth: number,
  options?: {
    // Custom X position (if not provided, uses calculated position)
    x?: number
    // Width of the parent container (door/drawer) for positioning calculations
    parentWidth?: number
    // Whether this is a right-opening door
    isRightOpening?: boolean
  }
): void => {
  applyProfileHandleColor(handlePivot, selectedColor)
  positionProfileHandle(handlePivot, height, depth, options)
}
