import React, { memo, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { applyMaterialToObject, disposeObject } from '../furnitureUtils'
import { HingePositionRule } from '~/types/columnConfigurationTypes'
import { setupProfileHandle, setupRoundHandle } from '../handleUtils'
import {
  calculateHingeYPosition,
  setupHingeWing,
  setupHingeAnchor,
} from '../hingeUtils'
import {
  createDoorGroup,
  createHingeWingPivots,
  createHingeAnchorPivots,
  createAnchorGroup,
  createHingeGroup,
  calculateDoorPositions,
  setupDoorFrontPanel,
} from '../doorUtils'
import { useDoorAnimation } from '~/hooks/useDoorAnimation'

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

  /**
   * MEMOIZED GROUPS
   * These groups form the structure of the door and its components
   */

  // Main door group containing the panel and handles
  const doorGroup = useMemo(
    () =>
      createDoorGroup(
        horizontalPanelObject,
        roundHandleObject,
        profileHandleObject,
        doorIndex
      ),
    [horizontalPanelObject, roundHandleObject, profileHandleObject, doorIndex]
  )

  // Hinge wing pivots (rotate with the door)
  const hingeWingPivots = useMemo(
    () => createHingeWingPivots(hingeWingObject, hingeCount),
    [hingeWingObject, hingeCount]
  )

  // Hinge anchor pivots (stay fixed to the frame)
  const hingeAnchorPivots = useMemo(
    () => createHingeAnchorPivots(hingeAnchorObject, hingeCount),
    [hingeAnchorObject, hingeCount]
  )

  // Anchor group (stays fixed to the frame, doesn't rotate)
  const anchorGroup = useMemo(
    () => createAnchorGroup(hingeAnchorPivots),
    [hingeAnchorPivots]
  )

  // Hinge group (wraps the door and allows rotation around right edge)
  const hingeGroup = useMemo(
    () => createHingeGroup(doorGroup, hingeWingPivots),
    [doorGroup, hingeWingPivots]
  )

  /**
   * EFFECTS
   */

  // Store ref for animation
  useEffect(() => {
    doorGroupRef.current = doorGroup
  }, [doorGroup])

  // Position and scale all door parts
  useEffect(() => {
    if (!doorGroup || !hingeGroup || !anchorGroup) return

    const { panelSpacing, handleOnTheDrawerTopOffset } = FURNITURE_CONFIG

    // Calculate dimensions
    const innerHeight = doorHeight - 2 * panelSpacing

    // Calculate door positions
    const { hingeX, doorOffsetX, zPosition, isRightOpening } =
      calculateDoorPositions(
        doorWidth,
        doorDepth,
        positionX,
        positionY,
        openingSide
      )

    // Position groups
    hingeGroup.position.set(hingeX, positionY, zPosition)
    anchorGroup.position.set(hingeX, positionY, zPosition)
    doorGroup.position.set(doorOffsetX, 0, -zPosition)

    // Setup door panels (front panel and handles)
    doorGroup.children.forEach((panelPivot) => {
      if (panelPivot.userData.isDoorFront) {
        setupDoorFrontPanel(panelPivot, doorWidth, innerHeight, zPosition)
      } else if (panelPivot.userData.roundHandle) {
        // Round handle
        panelPivot.visible = openingType === OpeningType.RoundHandle

        if (panelPivot.visible) {
          setupRoundHandle(
            panelPivot,
            selectedColor,
            innerHeight,
            doorDepth,
            handleOnTheDrawerTopOffset,
            {
              doorOffsetX,
              isRightOpening,
              handleHeightFromBottom,
            }
          )
        }
       
      } else if (panelPivot.userData.profileHandle) {
        panelPivot.visible = openingType === OpeningType.ProfileHandle

        if (panelPivot.visible) {
          setupProfileHandle(
            panelPivot,
            selectedColor,
            innerHeight,
            doorDepth,
            {
              parentWidth: doorWidth,
              isRightOpening: isRightOpening,
            }
          )
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

        setupHingeWing(child, hingeY, isRightOpening)
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

        setupHingeAnchor(
          child,
          hingeY,
          FURNITURE_CONFIG.panelThickness,
          isRightOpening
        )
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
    selectedColor,
  ])

  // Apply colors to all door parts
  useEffect(() => {
    if (!doorGroup || !hingeGroup || !anchorGroup) return

    // Color door panels (handles and hinges are colored by their respective setup functions)
    doorGroup.children.forEach((child) => {
      if (!child.userData.roundHandle && !child.userData.profileHandle) {
        // Use smart material application for door panels (supports PBR textures)
        applyMaterialToObject(child, selectedColor)
      }
    })
  }, [doorGroup, hingeGroup, anchorGroup, selectedColor])

  /**
   * ANIMATION
   */
  const isRightOpening = openingSide === 'right'
  useDoorAnimation({
    hingeGroup,
    isHovered,
    isRightOpening,
    doorDepth,
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
