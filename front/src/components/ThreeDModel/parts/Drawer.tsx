import React, { memo, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG, OpeningType } from '../furnitureConfig'
import { applyMaterialToObject, disposeObject } from '../furnitureUtils'
import { setupProfileHandle, setupRoundHandle } from '../handleUtils'
import {
  createDrawerGroup,
  calculateDrawerDimensions,
  setupDrawerFrontPanel,
  setupDrawerBottomPanel,
  setupDrawerLeftPanel,
  setupDrawerRightPanel,
} from '../drawerUtils'
import { useDrawerAnimation } from '~/hooks/useDrawerAnimation'

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
  // Create the drawer group with all panels
  const drawerGroup = useMemo(
    () =>
      createDrawerGroup(
        horizontalPanelObject,
        roundHandleObject,
        profileHandleObject,
        drawerIndex
      ),
    [horizontalPanelObject, roundHandleObject, profileHandleObject, drawerIndex]
  )

  // Scale and position the drawer parts
  useEffect(() => {
    if (!drawerGroup) return

    const { handleOnTheDrawerTopOffset } = FURNITURE_CONFIG

    // Calculate drawer dimensions
    const { innerHeight, innerWidth, innerDepth } = calculateDrawerDimensions(
      drawerWidth,
      drawerHeight,
      drawerDepth
    )

    // Position drawer group
    const baseZ = 0
    drawerGroup.position.set(positionX, positionY, baseZ)
    drawerGroup.userData.baseZ = baseZ

    // Setup all drawer panels
    drawerGroup.children.forEach((panelPivot) => {
      if (panelPivot.userData.isDrawerFront) {
        setupDrawerFrontPanel(panelPivot, drawerWidth, innerHeight, drawerDepth)
      } else if (panelPivot.userData.roundHandle) {
        panelPivot.visible = openingType === OpeningType.RoundHandle

        setupRoundHandle(
          panelPivot,
          selectedColor,
          innerHeight,
          drawerDepth,
          handleOnTheDrawerTopOffset
        )
      } else if (panelPivot.userData.profileHandle) {
        panelPivot.visible = openingType === OpeningType.ProfileHandle

        setupProfileHandle(panelPivot, selectedColor, innerHeight, drawerDepth, {
          parentWidth: innerWidth,
        })
      } else if (panelPivot.userData.isDrawerLeft) {
        setupDrawerLeftPanel(panelPivot, innerHeight, innerWidth, innerDepth)
      } else if (panelPivot.userData.isDrawerRight) {
        setupDrawerRightPanel(panelPivot, innerHeight, innerWidth, innerDepth)
      } else if (panelPivot.userData.isDrawerBottom) {
        setupDrawerBottomPanel(panelPivot, innerWidth, innerDepth)
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
    selectedColor,
  ])

  // Apply the selected color
  useEffect(() => {
    if (!drawerGroup) return

    // Apply material to drawer panels (handles are colored by setupRoundHandle/setupProfileHandle)
    drawerGroup.children.forEach((child) => {
      if (!child.userData.roundHandle && !child.userData.profileHandle) {
        // Apply material with PBR texture support to drawer panels
        applyMaterialToObject(child, selectedColor)
      }
    })
  }, [drawerGroup, selectedColor])

  // Opening animation
  useDrawerAnimation({
    drawerGroup,
    isHovered,
    drawerOffsetZ,
    lerpSpeed,
  })

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

