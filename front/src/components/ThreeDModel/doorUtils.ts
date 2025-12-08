import * as THREE from 'three'
import { FURNITURE_CONFIG } from './furnitureConfig'
import { createPanelPivotWithFlag } from './furnitureUtils'
import { OpeningSide } from './parts/Door'

/**
 * Creates door groups structure with panel and handles
 */
export const createDoorGroup = (
  horizontalPanelObject: THREE.Object3D,
  roundHandleObject: THREE.Object3D,
  profileHandleObject: THREE.Object3D,
  doorIndex: number,
  profileHandleLongObject?: THREE.Object3D
): THREE.Group | null => {
  if (!horizontalPanelObject) return null

  const frontPanelPivot = createPanelPivotWithFlag(
    horizontalPanelObject,
    'isDoorFront'
  )

  const roundHandlePivot = createPanelPivotWithFlag(
    roundHandleObject,
    'roundHandle'
  )

  const profileHandlePivot = createPanelPivotWithFlag(
    profileHandleObject,
    'profileHandle',
    { anchorY: 'center', anchorZ: 'center' }
  )

  const group = new THREE.Group()
  group.add(frontPanelPivot, roundHandlePivot, profileHandlePivot)
  
  // Add long profile handle if provided
  if (profileHandleLongObject) {
    const profileHandleLongPivot = createPanelPivotWithFlag(
      profileHandleLongObject,
      'profileHandleLong',
      { anchorY: 'center', anchorZ: 'center' }
    )
    group.add(profileHandleLongPivot)
  }
  
  group.userData.isDoorGroup = true
  group.userData.doorIndex = doorIndex

  return group
}

/**
 * Creates hinge wing pivots
 */
export const createHingeWingPivots = (
  hingeWingObject: THREE.Object3D,
  hingeCount: number
): THREE.Object3D[] => {
  if (!hingeWingObject) return []

  return Array.from({ length: hingeCount }, (_, i) => {
    const hingePivot = createPanelPivotWithFlag(hingeWingObject, 'hingeWing')
    hingePivot.userData.hingeIndex = i
    return hingePivot
  })
}

/**
 * Creates hinge anchor pivots
 */
export const createHingeAnchorPivots = (
  hingeAnchorObject: THREE.Object3D,
  hingeCount: number
): THREE.Object3D[] => {
  if (!hingeAnchorObject) return []

  return Array.from({ length: hingeCount }, (_, i) => {
    const anchorPivot = createPanelPivotWithFlag(
      hingeAnchorObject,
      'hingeAnchor'
    )
    anchorPivot.userData.hingeIndex = i
    return anchorPivot
  })
}

/**
 * Creates anchor group (stays fixed to the frame)
 */
export const createAnchorGroup = (
  hingeAnchorPivots: THREE.Object3D[]
): THREE.Group => {
  const group = new THREE.Group()
  hingeAnchorPivots.forEach((anchorPivot) => group.add(anchorPivot))
  group.userData.isAnchorGroup = true
  return group
}

/**
 * Creates hinge group (wraps the door and allows rotation)
 */
export const createHingeGroup = (
  doorGroup: THREE.Group | null,
  hingeWingPivots: THREE.Object3D[]
): THREE.Group | null => {
  if (!doorGroup) return null

  const hinge = new THREE.Group()
  hinge.add(doorGroup)

  // Add hinge wings so they rotate with the door
  hingeWingPivots.forEach((hingePivot) => hinge.add(hingePivot))

  hinge.userData.isHingeGroup = true
  return hinge
}

/**
 * Calculates door positioning values
 */
export const calculateDoorPositions = (
  doorWidth: number,
  doorDepth: number,
  positionX: number,
  positionY: number,
  openingSide: OpeningSide
): {
  hingeX: number
  doorOffsetX: number
  zPosition: number
  isRightOpening: boolean
} => {
  const { panelThickness } = FURNITURE_CONFIG
  const isRightOpening = openingSide === 'right'
  const zPosition = doorDepth - panelThickness

  const hingeX = isRightOpening
    ? positionX + doorWidth / 2 - panelThickness // Right edge
    : positionX - doorWidth / 2 + panelThickness // Left edge

  const doorOffsetX = isRightOpening
    ? -doorWidth / 2 + panelThickness // Door extends left from hinge
    : doorWidth / 2 - panelThickness // Door extends right from hinge

  return {
    hingeX,
    doorOffsetX,
    zPosition,
    isRightOpening,
  }
}

/**
 * Sets up the front panel of the door
 */
export const setupDoorFrontPanel = (
  panelPivot: THREE.Object3D,
  doorWidth: number,
  innerHeight: number,
  zPosition: number
): void => {
  const { panelThickness, panelSpacing } = FURNITURE_CONFIG
  
  panelPivot.scale.set(
    doorWidth - panelSpacing,
    innerHeight,
    panelThickness
  )

  panelPivot.position.set(0, panelSpacing, zPosition)
}

