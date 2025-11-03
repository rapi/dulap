import React, { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import {
  applyColorToObject,
  applyMaterialToObject,
  disposeObject,
  createPanelPivotWithFlag,
} from '../furnitureUtils'
import { HingePositionRule } from '~/types/columnConfigurationTypes'
import { getHandleColor, HANDLE_CONSTANTS } from '../handleUtils'
import { useAnimatedPosition } from '~/hooks/useAnimatedPosition'

const DOOR_CONSTANTS = {
  METALLIC_HANDLE_COLOR: HANDLE_CONSTANTS.METALLIC_COLOR,
} as const

/**
 * Helper Functions
 */

/** Calculate Y position for hinges distributed along the door */
const calculateHingeYPosition = (
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

// Handle color utilities moved to handleUtils.ts

export type OpeningSide = 'left' | 'right'

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
  openingSide?: OpeningSide
  hingeCount?: number
  hingePositionRule?: HingePositionRule
  handleHeightFromBottom?: number // Optional: Override handle height (measured from door bottom)
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
  openingSide = 'left',
  hingeCount = 3,
  hingePositionRule = 'even',
  handleHeightFromBottom,
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

    return Array.from({ length: hingeCount }, (_, i) => {
      const hingePivot = createPanelPivotWithFlag(hingeWingObject, 'hingeWing')
      hingePivot.userData.hingeIndex = i
      return hingePivot
    })
  }, [hingeWingObject, hingeCount])

  // Hinge anchor pivots (stay fixed to the frame)
  const hingeAnchorPivots = useMemo(() => {
    if (!hingeAnchorObject) return []

    return Array.from({ length: hingeCount }, (_, i) => {
      const anchorPivot = createPanelPivotWithFlag(
        hingeAnchorObject,
        'hingeAnchor'
      )
      anchorPivot.userData.hingeIndex = i
      return anchorPivot
    })
  }, [hingeAnchorObject, hingeCount])

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

    const { panelThickness, panelSpacing, handleOnTheDrawerTopOffset } = FURNITURE_CONFIG

    // Calculate dimensions
    const innerHeight = doorHeight - 2 * panelSpacing
    const zPosition = doorDepth - panelThickness

    // Position the main groups at the hinge edge (right or left)
    const isRightOpening = openingSide === 'right'
    const hingeX = isRightOpening
      ? positionX + doorWidth / 2 - panelThickness // Right edge
      : positionX - doorWidth / 2 + panelThickness // Left edge

    hingeGroup.position.set(hingeX, positionY, zPosition)
    anchorGroup.position.set(hingeX, positionY, zPosition)

    // Offset door group so its hinge edge aligns with the hinge position
    const doorOffsetX = isRightOpening
      ? -doorWidth / 2 + panelThickness // Door extends left from hinge
      : doorWidth / 2 - panelThickness // Door extends right from hinge
    doorGroup.position.set(doorOffsetX, 0, -zPosition)

    // Setup door panels (front panel and handles)
    doorGroup.children.forEach((panelPivot) => {
      if (panelPivot.userData.isDoorFront) {
        // Front panel of the door
        panelPivot.scale.set(
          doorWidth - panelSpacing,
          innerHeight,
          panelThickness
        )

        panelPivot.position.set(0, panelSpacing, zPosition)
      } else if (panelPivot.userData.roundHandle) {
        // Round handle
        panelPivot.visible = openingType === OpeningType.RoundHandle
        
        if (panelPivot.visible) {
          const roundHandleWidth = 2.5
          
          // Use custom height if provided (for wardrobes), otherwise use default offset from top
          const handleY = handleHeightFromBottom !== undefined 
            ? handleHeightFromBottom 
            : innerHeight - handleOnTheDrawerTopOffset
          
          if (isRightOpening) {
            panelPivot.position.set(
              doorOffsetX+roundHandleWidth,
              handleY,
              doorDepth + HANDLE_CONSTANTS.ROUND_HANDLE_DEPTH_OFFSET
            )
          } else {
            panelPivot.position.set(
              doorOffsetX-roundHandleWidth,
              handleY,
              doorDepth + HANDLE_CONSTANTS.ROUND_HANDLE_DEPTH_OFFSET
            )
          }
        }
      } else if (panelPivot.userData.profileHandle) {
        // Profile handle
        panelPivot.visible = openingType === OpeningType.ProfileHandle

        if (panelPivot.visible) {
          const profileHandleLength = 17.5
          const profileHandleWidth = 1.2
          const profileHandleBottomMetalWidth = 0.1
          
          // Use custom height if provided (for wardrobes), otherwise use default centered position
          const handleY = handleHeightFromBottom !== undefined
            ? handleHeightFromBottom
            : innerHeight - profileHandleLength / 2
  
          if (isRightOpening) {
            panelPivot.rotation.set(0, 0, Math.PI / 2)
            panelPivot.position.set(
              doorOffsetX - profileHandleWidth,
              handleY,
              doorDepth - profileHandleBottomMetalWidth
            )
          } else {
            panelPivot.rotation.set(0, 0, -Math.PI / 2)
            panelPivot.position.set(
              doorOffsetX + profileHandleWidth,
              handleY,
              doorDepth - profileHandleBottomMetalWidth
            )
          }
        }
      }
    })

    // Setup hinge wings (these rotate with the door)
    hingeGroup.children.forEach((child) => {
      if (child.userData.hingeWing) {
        const hingeIndex = child.userData.hingeIndex
        const hingeY = calculateHingeYPosition(
          hingeIndex,
          innerHeight,
          hingeCount,
          hingePositionRule
        )

        if (isRightOpening) {
          child.rotation.set(0, -Math.PI / 2, 0)
          child.position.set(
            FURNITURE_CONFIG.hingeOffsetFromEdge,
            hingeY,
            FURNITURE_CONFIG.hingeDepthOffset
          )
        } else {
          const hingeHeightOffset = 5 // because the hinge is rotated and inverted, we need to offset the position by 5 units (its height) to the top

          child.rotation.set(Math.PI / 2, Math.PI / 2, Math.PI / 2)
          child.position.set(
            -FURNITURE_CONFIG.hingeOffsetFromEdge,
            hingeY + hingeHeightOffset,
            FURNITURE_CONFIG.hingeDepthOffset
          )
        }
      }
    })

    // Setup hinge anchors (these stay fixed to the frame)
    anchorGroup.children.forEach((child) => {
      if (child.userData.hingeAnchor) {
        const hingeIndex = child.userData.hingeIndex
        const hingeY = calculateHingeYPosition(
          hingeIndex,
          innerHeight,
          hingeCount,
          hingePositionRule
        )

        if (isRightOpening) {
          child.rotation.set(0, Math.PI / 2, 0) // Face opposite direction
          child.position.set(
            FURNITURE_CONFIG.hingeAnchorXOffset - panelThickness,
            hingeY + FURNITURE_CONFIG.hingeAnchorYOffset,
            0
          )
        } else {
          child.rotation.set(-Math.PI / 2, -Math.PI / 2, Math.PI / 2)
          child.position.set(
            panelThickness - FURNITURE_CONFIG.hingeAnchorXOffset,
            hingeY + FURNITURE_CONFIG.hingeAnchorYOffset + 1,
            0
          )
        }
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
    openingSide,
    hingeCount,
    hingePositionRule,
    handleHeightFromBottom,
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
        // Use smart material application for door panels (supports PBR textures)
        applyMaterialToObject(child, selectedColor)
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
   * Separate concerns: rotation animation vs z-position management
   */
  const isRightOpening = openingSide === 'right'
  const openAngle = isRightOpening
    ? FURNITURE_CONFIG.doorOpenAngle
    : -FURNITURE_CONFIG.doorOpenAngle
  const baseZPosition = doorDepth - FURNITURE_CONFIG.panelThickness

  // Use separate animation hooks for independent control
  // Rotation: smooth animation on hover
  const rotationConfig = useMemo(() => ({
    axis: 'rotationY' as const,
    baseValue: 0,
    activeOffset: openAngle,
    lerpSpeed: FURNITURE_CONFIG.animationLerpSpeed,
  }), [openAngle])

  useAnimatedPosition(hingeGroupRef.current, isHovered, rotationConfig)

  // Z-position: smooth animation on hover, instant update on depth change
  const zOffsetRef = useRef(0)
  
  useFrame(() => {
    if (!hingeGroup) return
    
    // Target offset: 0 when not hovered, +thickness when hovered
    const targetOffset = isHovered ? FURNITURE_CONFIG.panelThickness : 0
    
    // Smoothly interpolate the offset
    zOffsetRef.current = THREE.MathUtils.lerp(
      zOffsetRef.current,
      targetOffset,
      FURNITURE_CONFIG.animationLerpSpeed
    )
    
    // Apply base position + animated offset
    hingeGroup.position.z = baseZPosition + zOffsetRef.current
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
