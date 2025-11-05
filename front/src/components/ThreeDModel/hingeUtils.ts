import { FURNITURE_CONFIG } from './furnitureConfig'
import { HingePositionRule } from '~/types/columnConfigurationTypes'
import { applyColorToObject } from './furnitureUtils'
import { HANDLE_CONSTANTS } from './handleUtils'
import * as THREE from 'three'

/**
 * Hinge-specific constants
 */
export const HINGE_CONSTANTS = {
  METALLIC_COLOR: HANDLE_CONSTANTS.METALLIC_COLOR,
  // Because the hinge is rotated and inverted for left-opening doors,
  // we need to offset the position by 5 units (its height) to the top
  LEFT_OPENING_HEIGHT_OFFSET: 5,
} as const

/**
 * Calculate Y position for hinges distributed along the door
 */
export const calculateHingeYPosition = (
  hingeIndex: number,
  innerHeight: number,
  hingeCount: number,
  positionRule: HingePositionRule
): number => {
  const { hingeTopBottomOffset, hingeMiddleShift } = FURNITURE_CONFIG

  // First hinge: 10cm from top
  if (hingeIndex === 0) {
    return hingeTopBottomOffset
  }

  // Last hinge: 10cm from bottom
  if (hingeIndex === hingeCount - 1) {
    return innerHeight - hingeTopBottomOffset
  }

  // Middle hinge(s) logic
  if (hingeCount === 3 && hingeIndex === 1) {
    const middlePosition = innerHeight / 2

    // For 'offset-middle' rule, shift middle hinge down 5cm
    if (positionRule === 'offset-middle') {
      return middlePosition + hingeMiddleShift
    }

    // For 'even' rule, position exactly at center
    return middlePosition
  }

  // Fallback for any other cases (evenly distributed)
  const hingeSpacing = innerHeight / (hingeCount + 1)
  return (hingeIndex + 1) * hingeSpacing
}

/**
 * Positions a hinge wing based on opening side
 */
const positionHingeWing = (
  hingeWing: THREE.Object3D,
  hingeY: number,
  isRightOpening: boolean
): void => {
  const { hingeOffsetFromEdge, hingeDepthOffset } = FURNITURE_CONFIG

  if (isRightOpening) {
    hingeWing.rotation.set(0, -Math.PI / 2, 0)
    hingeWing.position.set(
      hingeOffsetFromEdge,
      hingeY,
      hingeDepthOffset
    )
  } else {
    hingeWing.rotation.set(Math.PI / 2, Math.PI / 2, Math.PI / 2)
    hingeWing.position.set(
      -hingeOffsetFromEdge,
      hingeY + HINGE_CONSTANTS.LEFT_OPENING_HEIGHT_OFFSET,
      hingeDepthOffset
    )
  }
}

/**
 * Positions a hinge anchor based on opening side
 */
const positionHingeAnchor = (
  hingeAnchor: THREE.Object3D,
  hingeY: number,
  panelThickness: number,
  isRightOpening: boolean
): void => {
  const { hingeAnchorXOffset, hingeAnchorYOffset } = FURNITURE_CONFIG

  if (isRightOpening) {
    hingeAnchor.rotation.set(0, Math.PI / 2, 0) // Face opposite direction
    hingeAnchor.position.set(
      hingeAnchorXOffset - panelThickness,
      hingeY + hingeAnchorYOffset,
      0
    )
  } else {
    hingeAnchor.rotation.set(-Math.PI / 2, -Math.PI / 2, Math.PI / 2)
    hingeAnchor.position.set(
      panelThickness - hingeAnchorXOffset,
      hingeY + hingeAnchorYOffset + 1,
      0
    )
  }
}

/**
 * Applies color to hinge wing
 */
const applyHingeWingColor = (hingeWing: THREE.Object3D): void => {
  applyColorToObject(hingeWing, HINGE_CONSTANTS.METALLIC_COLOR)
}

/**
 * Applies color to hinge anchor
 */
const applyHingeAnchorColor = (hingeAnchor: THREE.Object3D): void => {
  applyColorToObject(hingeAnchor, HINGE_CONSTANTS.METALLIC_COLOR)
}

/**
 * Complete setup for hinge wing: color and positioning
 */
export const setupHingeWing = (
  hingeWing: THREE.Object3D,
  hingeY: number,
  isRightOpening: boolean
): void => {
  applyHingeWingColor(hingeWing)
  positionHingeWing(hingeWing, hingeY, isRightOpening)
}

/**
 * Complete setup for hinge anchor: color and positioning
 */
export const setupHingeAnchor = (
  hingeAnchor: THREE.Object3D,
  hingeY: number,
  panelThickness: number,
  isRightOpening: boolean
): void => {
  applyHingeAnchorColor(hingeAnchor)
  positionHingeAnchor(hingeAnchor, hingeY, panelThickness, isRightOpening)
}

