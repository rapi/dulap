import { ColorName, getColorItemByName } from '~/utils/colorDictionary'
import { OpeningType } from './furnitureConfig'
import { applyColorToObject } from './furnitureUtils'
import * as THREE from 'three'

/**
 * Handle-specific constants
 */
export const HANDLE_CONSTANTS = {
  WHITE_COLOR: '#ffffff',
  METALLIC_COLOR: '#9c9c9c',
  ROUND_HANDLE_DEPTH_OFFSET: -1,
  PROFILE_HANDLE_Y_OFFSET: 0.5,
  PROFILE_HANDLE_DEPTH_OFFSET: 0.2,
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
 * Positions a handle based on its type and parent dimensions
 */
export const positionHandle = (
  handlePivot: THREE.Object3D,
  type: 'round' | 'profile',
  height: number,
  depth: number,
  handleTopOffset: number
): void => {
  if (type === 'round') {
    handlePivot.position.set(
      0,
      height - handleTopOffset,
      depth + HANDLE_CONSTANTS.ROUND_HANDLE_DEPTH_OFFSET
    )
  } else {
    handlePivot.position.set(
      0,
      height - HANDLE_CONSTANTS.PROFILE_HANDLE_Y_OFFSET,
      depth - HANDLE_CONSTANTS.PROFILE_HANDLE_DEPTH_OFFSET
    )
  }
}

/**
 * Applies visibility and color to handle based on opening type
 */
export const configureHandle = (
  handlePivot: THREE.Object3D,
  handleType: 'round' | 'profile',
  openingType: OpeningType,
  selectedColor: string
): void => {
  // Set visibility based on opening type
  if (handleType === 'round') {
    handlePivot.visible = openingType === OpeningType.RoundHandle
  } else {
    handlePivot.visible = openingType === OpeningType.ProfileHandle
  }

  // Apply color if visible
  if (handlePivot.visible) {
    const handleColor = getHandleColor(selectedColor)
    applyColorToObject(handlePivot, handleColor)
  }
}

/**
 * Combined setup for handle positioning and configuration
 */
export const setupHandle = (
  handlePivot: THREE.Object3D,
  type: 'round' | 'profile',
  openingType: OpeningType,
  selectedColor: string,
  height: number,
  depth: number,
  handleTopOffset: number
): void => {
  configureHandle(handlePivot, type, openingType, selectedColor)
  
  if (handlePivot.visible) {
    positionHandle(handlePivot, type, height, depth, handleTopOffset)
  }
}
