import React, { memo, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import {
  applyColorToObject,
  applyMaterialToObject,
  disposeObject,
  createPanelPivotWithFlag,
} from '../furnitureUtils'
import { getHandleColor, HANDLE_CONSTANTS } from '../handleUtils'
import { useAnimatedPosition } from '~/hooks/useAnimatedPosition'

interface DrawerProps {
  horizontalPanelObject: THREE.Object3D
  roundHandleObject: THREE.Object3D
  profileHandleObject: THREE.Object3D
  openingType: OpeningType
  drawerWidth: number
  drawerHeight: number
  drawerDepth: number
  selectedColor: string
  drawerIndex: number
  positionY: number
  positionX?: number
  drawerOffsetZ?: number
  lerpSpeed?: number
  isHovered?: boolean
}

const DrawerComponent: React.FC<DrawerProps> = ({
  horizontalPanelObject,
  roundHandleObject,
  profileHandleObject,
  drawerWidth,
  drawerHeight,
  drawerDepth,
  selectedColor,
  drawerIndex,
  positionY,
  positionX = 0,
  drawerOffsetZ = 15,
  lerpSpeed = 0.15,
  openingType,
  isHovered = false,
}) => {
  const drawerGroupRef = useRef<THREE.Group | null>(null)

  // Create the drawer group with all panels
  const drawerGroup = useMemo(() => {
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
    const profileHandlePivot = createPanelPivotWithFlag(profileHandleObject, 'profileHandle', { anchorY: 'center', anchorZ: 'center' })

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
  }, [horizontalPanelObject, roundHandleObject, profileHandleObject, drawerIndex])

  // Store ref for animation
  useEffect(() => {
    drawerGroupRef.current = drawerGroup
  }, [drawerGroup])

  // Scale and position the drawer parts
  useEffect(() => {
    if (!drawerGroup) return

    const {
      panelThickness,
      panelSpacing,
      handleOnTheDrawerTopOffset,
      drawerInsidePanelsOffset,
    } = FURNITURE_CONFIG

    // Dimensions of the interior parts of the drawer (the box inside)
    const innerHeight = drawerHeight - panelSpacing
    const innerWidth = drawerWidth - panelThickness * 2
    const innerDepth = drawerDepth - panelThickness * 2
    const halfInnerWidth = innerWidth / 2

    const baseZ = 0
    drawerGroup.position.set(positionX, positionY, baseZ)
    drawerGroup.userData.baseZ = baseZ

    // Position and scale all drawer panels
    drawerGroup.children.forEach((panelPivot) => {
      if (panelPivot.userData.isDrawerFront) {
        panelPivot.scale.set(
          drawerWidth,
          innerHeight,
          panelThickness
        )
        panelPivot.position.set(0, 0, drawerDepth - panelThickness)
      } else if (panelPivot.userData.roundHandle) {
        panelPivot.visible = openingType === OpeningType.RoundHandle
        if (panelPivot.visible) {
          panelPivot.position.set(
            0,
            innerHeight - handleOnTheDrawerTopOffset,
            drawerDepth + HANDLE_CONSTANTS.ROUND_HANDLE_DEPTH_OFFSET
          )
        }
      } else if (panelPivot.userData.profileHandle) {
        panelPivot.visible = openingType === OpeningType.ProfileHandle
        if (panelPivot.visible) {
          panelPivot.position.set(
            0,
            innerHeight - HANDLE_CONSTANTS.PROFILE_HANDLE_Y_OFFSET,
            drawerDepth - HANDLE_CONSTANTS.PROFILE_HANDLE_DEPTH_OFFSET
          )
        }
      } else if (panelPivot.userData.isDrawerLeft) {
        panelPivot.scale.set(
          panelThickness,
          (innerHeight - drawerInsidePanelsOffset),
          innerDepth
        )
        panelPivot.position.set(
          -halfInnerWidth + panelThickness / 2,
          0,
          panelThickness
        )
      } else if (panelPivot.userData.isDrawerRight) {
        panelPivot.scale.set(
          panelThickness,
          (innerHeight - drawerInsidePanelsOffset),
          innerDepth
        )
        panelPivot.position.set(
          +halfInnerWidth - panelThickness / 2,
          0,
          panelThickness
        )
      } else if (panelPivot.userData.isDrawerBottom) {
        panelPivot.scale.set(
          innerWidth,
          panelThickness,
          innerDepth
        )
        panelPivot.position.set(0, 0, panelThickness)
      }
    })
  }, [
    drawerGroup,
    drawerWidth,
    drawerHeight,
    drawerDepth,
    positionY,
    positionX,
    openingType,
  ])

  // Apply the selected color
  useEffect(() => {
    if (!drawerGroup) return

    const handleColor = getHandleColor(selectedColor)

    drawerGroup.children.forEach((child) => {
      if (child.userData.roundHandle || child.userData.profileHandle) {
        applyColorToObject(child, handleColor)
      } else {
        // Apply material with PBR texture support to drawer panels
        applyMaterialToObject(child, selectedColor)
      }
    })
  }, [drawerGroup, selectedColor])

  // Opening animation using the hook
  const baseZ = drawerGroup?.userData.baseZ || 0
  
  // Memoize animation config to prevent creating new object on every render
  const animationConfig = useMemo(() => ({
    axis: 'z' as const,
    baseValue: baseZ,
    activeOffset: drawerOffsetZ,
    lerpSpeed: lerpSpeed,
  }), [baseZ, drawerOffsetZ, lerpSpeed])
  
  useAnimatedPosition(drawerGroup, isHovered, animationConfig)

  // Cleanup
  useEffect(() => {
    return () => {
      if (drawerGroup) {
        disposeObject(drawerGroup)
      }
    }
  }, [drawerGroup])

  if (!drawerGroup) return null

  return <primitive object={drawerGroup} />
}

export const Drawer = memo(DrawerComponent)

