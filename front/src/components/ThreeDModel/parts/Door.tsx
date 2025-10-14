import React, { memo, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import {
  applyColorToObject,
  disposeObject,
  createPanelPivotWithFlag,
} from '../furnitureUtils'
import { ColorName, getColorItemByName } from '~/utils/colorDictionary'

// Door-specific constants
const DOOR_CONSTANTS = {
  HINGE_COUNT: 3,
  HINGE_OFFSET_FROM_EDGE: 2,
  HINGE_DEPTH_OFFSET: -1,
  ANCHOR_X_OFFSET: -1, // Offset from panel thickness
  ANCHOR_Y_OFFSET: 1.8,
  ROUND_HANDLE_DEPTH_OFFSET: -1,
  PROFILE_HANDLE_Y_OFFSET: 0.7,
  PROFILE_HANDLE_DEPTH_OFFSET: 0.2,
  ANIMATION_LERP_SPEED: 0.15,
  OPEN_ANGLE: Math.PI / 2,
  METALLIC_HANDLE_COLOR: '#9c9c9c',
  WHITE_HANDLE_COLOR: '#ffffff',
} as const

/**
 * Helper Functions
 */

/** Calculate Y position for hinges distributed evenly along the door */
const calculateHingeYPosition = (hingeIndex: number, innerHeight: number): number => {
  const hingeSpacing = innerHeight / (DOOR_CONSTANTS.HINGE_COUNT + 1)
  return (hingeIndex + 1) * hingeSpacing
}

/** Determine if handles should be white based on door color */
const shouldUseWhiteHandle = (selectedColor: string): boolean => {
  const whiteHex = getColorItemByName(ColorName.White)?.hexCode
  const beigeHex = getColorItemByName(ColorName.Biege)?.hexCode
  return selectedColor === whiteHex || selectedColor === beigeHex
}

/** Get appropriate handle color based on door color */
const getHandleColor = (selectedColor: string): string => {
  return shouldUseWhiteHandle(selectedColor)
    ? DOOR_CONSTANTS.WHITE_HANDLE_COLOR
    : DOOR_CONSTANTS.METALLIC_HANDLE_COLOR
}

interface DoorProps {
  horizontalPanelObject: THREE.Object3D
  roundHandleObject: THREE.Object3D
  profileHandleObject: THREE.Object3D
  hingeWingObject: THREE.Object3D
  hingeAnchorObject: THREE.Object3D
  openingType: OpeningType
  doorWidth: number
  doorHeight: number
  doorDepth: number
  selectedColor: string
  doorIndex: number
  positionY: number
  positionX?: number
  isHovered?: boolean
}

const DoorComponent: React.FC<DoorProps> = ({
  horizontalPanelObject,
  roundHandleObject,
  profileHandleObject,
  hingeWingObject,
  hingeAnchorObject,
  doorWidth,
  doorHeight,
  doorDepth,
  selectedColor,
  doorIndex,
  positionY,
  positionX = 0,
  openingType,
  isHovered = false,
}) => {
  const doorGroupRef = useRef<THREE.Group | null>(null)
  const hingeGroupRef = useRef<THREE.Group | null>(null)

  /**
   * MEMOIZED GROUPS
   * These groups form the structure of the door and its components
   */

  // Main door group containing the panel and handles
  const doorGroup = useMemo(() => {
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
    group.userData.isDoorGroup = true
    group.userData.doorIndex = doorIndex

    return group
  }, [horizontalPanelObject, roundHandleObject, profileHandleObject, doorIndex])

  // Hinge wing pivots (rotate with the door)
  const hingeWingPivots = useMemo(() => {
    if (!hingeWingObject) return []
    
    return Array.from({ length: DOOR_CONSTANTS.HINGE_COUNT }, (_, i) => {
      const hingePivot = createPanelPivotWithFlag(hingeWingObject, 'hingeWing')
      hingePivot.userData.hingeIndex = i
      return hingePivot
    })
  }, [hingeWingObject])

  // Hinge anchor pivots (stay fixed to the frame)
  const hingeAnchorPivots = useMemo(() => {
    if (!hingeAnchorObject) return []
    
    return Array.from({ length: DOOR_CONSTANTS.HINGE_COUNT }, (_, i) => {
      const anchorPivot = createPanelPivotWithFlag(hingeAnchorObject, 'hingeAnchor')
      anchorPivot.userData.hingeIndex = i
      return anchorPivot
    })
  }, [hingeAnchorObject])

  // Anchor group (stays fixed to the frame, doesn't rotate)
  const anchorGroup = useMemo(() => {
    const group = new THREE.Group()
    hingeAnchorPivots.forEach((anchorPivot) => group.add(anchorPivot))
    group.userData.isAnchorGroup = true
    return group
  }, [hingeAnchorPivots])

  // Hinge group (wraps the door and allows rotation around right edge)
  const hingeGroup = useMemo(() => {
    if (!doorGroup) return null
    
    const hinge = new THREE.Group()
    hinge.add(doorGroup)
    
    // Add hinge wings so they rotate with the door
    hingeWingPivots.forEach((hingePivot) => hinge.add(hingePivot))
    
    hinge.userData.isHingeGroup = true
    return hinge
  }, [doorGroup, hingeWingPivots])

  /**
   * EFFECTS
   */

  // Store refs for animation
  useEffect(() => {
    doorGroupRef.current = doorGroup
    hingeGroupRef.current = hingeGroup
  }, [doorGroup, hingeGroup])

  // Position and scale all door parts
  useEffect(() => {
    if (!doorGroup || !hingeGroup || !anchorGroup) return

    const { panelThickness, defaultScale, panelSpacing, handleOnTheDrawerTopOffset } =
      FURNITURE_CONFIG

    // Calculate dimensions
    const innerHeight = doorHeight - 2 * panelSpacing
    const zPosition = doorDepth - panelThickness

    // Position the main groups at the right edge of the door (hinge position)
    const hingeX = positionX + doorWidth / 2 - panelThickness
    hingeGroup.position.set(hingeX, positionY, zPosition)
    anchorGroup.position.set(hingeX, positionY, zPosition)
    
    // Offset door group to the left so its right edge aligns with the hinge
    doorGroup.position.set(-doorWidth / 2 + panelThickness, 0, -zPosition)

    // Setup door panels (front panel and handles)
    doorGroup.children.forEach((panelPivot) => {
      if (panelPivot.userData.isDoorFront) {
        // Front panel of the door
        panelPivot.scale.set(
          doorWidth * defaultScale,
          innerHeight * defaultScale,
          panelThickness * defaultScale
        )
        panelPivot.position.set(0, panelSpacing, zPosition)
      } else if (panelPivot.userData.roundHandle) {
        // Round handle
        panelPivot.visible = openingType === OpeningType.RoundHandle
        if (panelPivot.visible) {
          panelPivot.scale.set(defaultScale, defaultScale, defaultScale)
          panelPivot.position.set(
            0,
            innerHeight - handleOnTheDrawerTopOffset,
            doorDepth + DOOR_CONSTANTS.ROUND_HANDLE_DEPTH_OFFSET
          )
        }
      } else if (panelPivot.userData.profileHandle) {
        // Profile handle
        panelPivot.visible = openingType === OpeningType.ProfileHandle
        if (panelPivot.visible) {
          panelPivot.scale.set(defaultScale, defaultScale, defaultScale)
          panelPivot.position.set(
            0,
            innerHeight - DOOR_CONSTANTS.PROFILE_HANDLE_Y_OFFSET,
            doorDepth - DOOR_CONSTANTS.PROFILE_HANDLE_DEPTH_OFFSET
          )
        }
      }
    })

    // Setup hinge wings (these rotate with the door)
    hingeGroup.children.forEach((child) => {
      if (child.userData.hingeWing) {
        const hingeIndex = child.userData.hingeIndex
        const hingeY = calculateHingeYPosition(hingeIndex, innerHeight)
        
        child.scale.set(defaultScale, defaultScale, defaultScale)
        child.position.set(
          DOOR_CONSTANTS.HINGE_OFFSET_FROM_EDGE,
          hingeY,
          DOOR_CONSTANTS.HINGE_DEPTH_OFFSET
        )
        child.rotation.set(0, -Math.PI / 2, 0) // Align with door edge
      }
    })

    // Setup hinge anchors (these stay fixed to the frame)
    anchorGroup.children.forEach((child) => {
      if (child.userData.hingeAnchor) {
        const hingeIndex = child.userData.hingeIndex
        const hingeY = calculateHingeYPosition(hingeIndex, innerHeight)
        
        child.scale.set(defaultScale, defaultScale, defaultScale)
        child.position.set(
          -panelThickness + DOOR_CONSTANTS.ANCHOR_X_OFFSET,
          hingeY + DOOR_CONSTANTS.ANCHOR_Y_OFFSET,
          0
        )
        child.rotation.set(0, Math.PI / 2, 0) // Face opposite direction
      }
    })
  }, [
    doorGroup,
    hingeGroup,
    anchorGroup,
    doorWidth,
    doorHeight,
    doorDepth,
    positionY,
    positionX,
    openingType,
  ])

  // Apply colors to all door parts
  useEffect(() => {
    if (!doorGroup || !hingeGroup || !anchorGroup) return

    const handleColor = getHandleColor(selectedColor)

    // Color door panels and handles
    doorGroup.children.forEach((child) => {
      if (child.userData.roundHandle || child.userData.profileHandle) {
        applyColorToObject(child, handleColor)
      } else {
        applyColorToObject(child, selectedColor)
      }
    })

    // Color hinge wings (metallic)
    hingeGroup.children.forEach((child) => {
      if (child.userData.hingeWing) {
        applyColorToObject(child, DOOR_CONSTANTS.METALLIC_HANDLE_COLOR)
      }
    })

    // Color hinge anchors (metallic)
    anchorGroup.children.forEach((child) => {
      if (child.userData.hingeAnchor) {
        applyColorToObject(child, DOOR_CONSTANTS.METALLIC_HANDLE_COLOR)
      }
    })
  }, [doorGroup, hingeGroup, anchorGroup, selectedColor])

  /**
   * ANIMATION
   * Smooth opening/closing animation using lerp interpolation
   */
  useFrame(() => {
    const hinge = hingeGroupRef.current
    if (!hinge) return

    const { panelThickness } = FURNITURE_CONFIG

    // Calculate target values based on hover state
    const targetRotation = isHovered ? DOOR_CONSTANTS.OPEN_ANGLE : 0
    const targetZPosition = isHovered ? panelThickness : 0
    const baseZPosition = doorDepth - panelThickness

    // Smoothly interpolate to target values
    hinge.rotation.y = THREE.MathUtils.lerp(
      hinge.rotation.y,
      targetRotation,
      DOOR_CONSTANTS.ANIMATION_LERP_SPEED
    )
    hinge.position.z = THREE.MathUtils.lerp(
      hinge.position.z,
      baseZPosition + targetZPosition,
      DOOR_CONSTANTS.ANIMATION_LERP_SPEED
    )
  })

  /**
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      if (hingeGroup) disposeObject(hingeGroup)
      if (anchorGroup) disposeObject(anchorGroup)
    }
  }, [hingeGroup, anchorGroup])

  if (!hingeGroup) return null

  /**
   * RENDER
   * Renders both the hinge group (door + hinge wings) and anchor group (fixed hinges)
   */
  return (
    <>
      <primitive object={hingeGroup} />
      <primitive object={anchorGroup} />
    </>
  )
}

export const Door = memo(DoorComponent)

