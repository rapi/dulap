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
  const drawerPositionRef = useRef<number>(0)
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
    drawerPositionRef.current = baseZ

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
        if (openingType === OpeningType.RoundHandle) {
          panelPivot.visible = true
          panelPivot.position.set(
            0,
            innerHeight - handleOnTheDrawerTopOffset,
            drawerDepth - 1
          )
        } else {
          panelPivot.visible = false
        }
      } else if (panelPivot.userData.profileHandle) {
        if (openingType === OpeningType.ProfileHandle) {
          panelPivot.visible = true
          panelPivot.position.set(
            0,
            innerHeight - 0.7,
            drawerDepth - 0.2
          )
        } else {
          panelPivot.visible = false
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

    drawerGroup.children.forEach((child) => {
      if (child.userData.roundHandle || child.userData.profileHandle) {
        const applyWhiteHandleColor = selectedColor === getColorItemByName(ColorName.White)?.hexCode || selectedColor === getColorItemByName(ColorName.Biege)?.hexCode

        if (applyWhiteHandleColor) {
          applyColorToObject(child, "#ffffff")
        } else {
          applyColorToObject(child, "#9c9c9c")
        }
      } else {
        // Apply the selected color to drawer panels
        applyColorToObject(child, selectedColor)
      }
    })
  }, [drawerGroup, selectedColor])

  // Opening animation
  useFrame(() => {
    if (!drawerGroup) return

    const baseZ = drawerGroup.userData.baseZ || 0
    const targetZ = isHovered ? baseZ + drawerOffsetZ : baseZ
    const currentZ = drawerPositionRef.current
    const interpolatedZ = THREE.MathUtils.lerp(currentZ, targetZ, lerpSpeed)

    drawerGroup.position.z = interpolatedZ
    drawerPositionRef.current = interpolatedZ
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

