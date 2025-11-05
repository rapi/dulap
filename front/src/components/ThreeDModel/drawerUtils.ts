import * as THREE from 'three'
import { FURNITURE_CONFIG } from './furnitureConfig'
import { createPanelPivotWithFlag } from './furnitureUtils'

/**
 * Creates drawer group with all panels and handles
 */
export const createDrawerGroup = (
  horizontalPanelObject: THREE.Object3D,
  roundHandleObject: THREE.Object3D,
  profileHandleObject: THREE.Object3D,
  drawerIndex: number
): THREE.Group | null => {
  if (!horizontalPanelObject) return null

  const frontPanelPivot = createPanelPivotWithFlag(
    horizontalPanelObject,
    'isDrawerFront'
  )
  const bottomPanelPivot = createPanelPivotWithFlag(
    horizontalPanelObject,
    'isDrawerBottom'
  )
  const leftPanelPivot = createPanelPivotWithFlag(
    horizontalPanelObject,
    'isDrawerLeft'
  )
  const rightPanelPivot = createPanelPivotWithFlag(
    horizontalPanelObject,
    'isDrawerRight'
  )
  const roundHandlePivot = createPanelPivotWithFlag(roundHandleObject, 'roundHandle')
  const profileHandlePivot = createPanelPivotWithFlag(
    profileHandleObject,
    'profileHandle',
    { anchorY: 'center', anchorZ: 'center' }
  )

  const group = new THREE.Group()
  group.add(
    frontPanelPivot,
    bottomPanelPivot,
    leftPanelPivot,
    rightPanelPivot,
    roundHandlePivot,
    profileHandlePivot
  )
  group.userData.isDrawerGroup = true
  group.userData.drawerIndex = drawerIndex

  return group
}

/**
 * Calculates drawer inner dimensions
 */
export const calculateDrawerDimensions = (
  drawerWidth: number,
  drawerHeight: number,
  drawerDepth: number
): {
  innerHeight: number
  innerWidth: number
  innerDepth: number
  halfInnerWidth: number
} => {
  const { panelThickness, panelSpacing } = FURNITURE_CONFIG

  const innerHeight = drawerHeight - panelSpacing
  const innerWidth = drawerWidth - panelThickness * 2
  const innerDepth = drawerDepth - panelThickness * 2
  const halfInnerWidth = innerWidth / 2

  return {
    innerHeight,
    innerWidth,
    innerDepth,
    halfInnerWidth,
  }
}

/**
 * Sets up the front panel of the drawer
 */
export const setupDrawerFrontPanel = (
  panelPivot: THREE.Object3D,
  drawerWidth: number,
  innerHeight: number,
  drawerDepth: number
): void => {
  const { panelThickness } = FURNITURE_CONFIG

  panelPivot.scale.set(drawerWidth, innerHeight, panelThickness)
  panelPivot.position.set(0, 0, drawerDepth - panelThickness)
}

/**
 * Sets up the bottom panel of the drawer
 */
export const setupDrawerBottomPanel = (
  panelPivot: THREE.Object3D,
  innerWidth: number,
  innerDepth: number
): void => {
  const { panelThickness } = FURNITURE_CONFIG

  panelPivot.scale.set(innerWidth, panelThickness, innerDepth)
  panelPivot.position.set(0, 0, panelThickness)
}

/**
 * Sets up the left panel of the drawer
 */
export const setupDrawerLeftPanel = (
  panelPivot: THREE.Object3D,
  innerHeight: number,
  innerWidth: number,
  innerDepth: number
): void => {
  const { panelThickness, drawerInsidePanelsOffset } = FURNITURE_CONFIG

  panelPivot.scale.set(
    panelThickness,
    innerHeight - drawerInsidePanelsOffset,
    innerDepth
  )
  panelPivot.position.set(
    -innerWidth / 2 + panelThickness / 2,
    0,
    panelThickness
  )
}

/**
 * Sets up the right panel of the drawer
 */
export const setupDrawerRightPanel = (
  panelPivot: THREE.Object3D,
  innerHeight: number,
  innerWidth: number,
  innerDepth: number
): void => {
  const { panelThickness, drawerInsidePanelsOffset } = FURNITURE_CONFIG

  panelPivot.scale.set(
    panelThickness,
    innerHeight - drawerInsidePanelsOffset,
    innerDepth
  )
  panelPivot.position.set(
    innerWidth / 2 - panelThickness / 2,
    0,
    panelThickness
  )
}

