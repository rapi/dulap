import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { applyColorToObject, disposeObject, createPanelPivotWithFlag } from '../furnitureUtils'

interface DrawersProps {
  horizontalPanelObject: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
  drawerOffsetZ?: number
  lerpSpeed?: number
}

const DrawersComponent: React.FC<DrawersProps> = ({
  horizontalPanelObject,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
  selectedColor,
  drawerOffsetZ = 15,
  lerpSpeed = 0.15,
}) => {
  const [hoveredDrawerIndex, setHoveredDrawerIndex] = useState<number | null>(null)
  const drawerPositionsRef = useRef<Map<number, number>>(new Map())

  // Create object clones for all the needed parts of the drawer
  const drawerGroups = useMemo(() => {
    if (!horizontalPanelObject) return [] as THREE.Object3D[]

    const drawerGroupList: THREE.Object3D[] = []
    for (let drawerIndex = 0; drawerIndex < FURNITURE_CONFIG.maxDrawers; drawerIndex++) {
      const frontPanelPivot = createPanelPivotWithFlag(horizontalPanelObject, 'isDrawerFront')
      const bottomPanelPivot = createPanelPivotWithFlag(horizontalPanelObject, 'isDrawerBottom')
      const leftPanelPivot = createPanelPivotWithFlag(horizontalPanelObject, 'isDrawerLeft')
      const rightPanelPivot = createPanelPivotWithFlag(horizontalPanelObject, 'isDrawerRight')

      const drawerGroup = new THREE.Group()
      drawerGroup.add(frontPanelPivot, bottomPanelPivot, leftPanelPivot, rightPanelPivot)
      drawerGroup.userData.isDrawerGroup = true
      drawerGroup.userData.drawerIndex = drawerIndex

      drawerGroupList.push(drawerGroup)
    }
    return drawerGroupList
  }, [horizontalPanelObject])

  // Scale and position the drawer parts accordingly
  useEffect(() => {
    if (drawerGroups.length === 0) return

    const {
      panelThickness,
      defaultScale,
      drawerSpacing,
      defaultDrawerCount,
      minDrawerHeight,
    } = FURNITURE_CONFIG

    const drawersUsableHeight = desiredHeight - panelThickness - desiredPlintHeight
    
    // TODO: Replace this with real selectedOptions 
    // (drawer number will change dynamically based on the selected value in the configurator)
    const drawerCount = Math.min(
      defaultDrawerCount,
      Math.max(1, Math.floor(drawersUsableHeight / minDrawerHeight))
    )
    const singleDrawerTotalHeight = drawersUsableHeight / drawerCount

    // Dimenstions of the interior parts of the drawer (the box inside)
    const innerHeight = singleDrawerTotalHeight - drawerSpacing * 4
    const innerWidth = desiredWidth - panelThickness * 2 - drawerSpacing * 2
    const innerDepth = desiredDepth - panelThickness * 2 - drawerSpacing * 2
    const halfInnerWidth = innerWidth / 2

    drawerGroups.forEach((drawerGroup, groupIndex) => {
      if (groupIndex < drawerCount) {
        drawerGroup.visible = true

        const baseY = desiredPlintHeight + drawerSpacing + singleDrawerTotalHeight * groupIndex
        const baseZ = 0

        drawerGroup.position.set(0, baseY, baseZ)
        drawerGroup.userData.baseZ = baseZ
        drawerGroup.userData.drawerIndex = groupIndex
        drawerPositionsRef.current.set(groupIndex, baseZ)

        drawerGroup.children.forEach((panelPivot) => {
          if (panelPivot.userData.isDrawerFront) {
            panelPivot.scale.set(
              desiredWidth * defaultScale,
              innerHeight * defaultScale,
              panelThickness * defaultScale
            )
            panelPivot.position.set(0, 0, desiredDepth - panelThickness)
          } else if (panelPivot.userData.isDrawerLeft) {
            panelPivot.scale.set(
              panelThickness * defaultScale,
              (innerHeight-5) * defaultScale,
              innerDepth * defaultScale
            )
            panelPivot.position.set(-halfInnerWidth + panelThickness / 2, 0, panelThickness)
          } else if (panelPivot.userData.isDrawerRight) {
            panelPivot.scale.set(
              panelThickness * defaultScale,
              (innerHeight-5) * defaultScale,
              innerDepth * defaultScale
            )
            panelPivot.position.set(+halfInnerWidth - panelThickness / 2, 0, panelThickness)
          } else if (panelPivot.userData.isDrawerBottom) {
            panelPivot.scale.set(
              innerWidth * defaultScale,
              panelThickness * defaultScale,
              innerDepth * defaultScale
            )
            panelPivot.position.set(0, 0, panelThickness)
          }
        })
      } else {
        drawerGroup.visible = false
      }
    })
  }, [drawerGroups, desiredWidth, desiredHeight, desiredDepth, desiredPlintHeight])

  // Apply the selected color to all drawer panels
  useEffect(() => {
    if (drawerGroups.length === 0) return
    drawerGroups.forEach((drawerGroup) => applyColorToObject(drawerGroup, selectedColor))
  }, [drawerGroups, selectedColor])

  useEffect(() => {
    return () => {
      drawerGroups.forEach((drawerGroup) => drawerGroup && disposeObject(drawerGroup))
      document.body.style.cursor = 'auto'
    }
  }, [drawerGroups])

  // The drawers opening animation
  useFrame(() => {
    if (drawerGroups.length === 0) return

    drawerGroups.forEach((drawerGroup) => {
      if (!drawerGroup.visible || typeof drawerGroup.userData.drawerIndex !== 'number') return

      const groupIndex = drawerGroup.userData.drawerIndex
      const baseZ = drawerGroup.userData.baseZ || 0
      const targetZ = hoveredDrawerIndex === groupIndex ? baseZ + drawerOffsetZ : baseZ
      const currentZ = drawerPositionsRef.current.get(groupIndex) ?? baseZ
      const interpolatedZ = THREE.MathUtils.lerp(currentZ, targetZ, lerpSpeed)

      drawerGroup.position.z = interpolatedZ
      drawerPositionsRef.current.set(groupIndex, interpolatedZ)
    })
  })

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    let currentNode: THREE.Object3D | undefined = event.object

    while (currentNode && currentNode.parent && !currentNode.userData.isDrawerGroup) {
      currentNode = currentNode.parent
    }

    if (
      currentNode &&
      currentNode.userData.isDrawerGroup &&
      typeof currentNode.userData.drawerIndex === 'number'
    ) {
      setHoveredDrawerIndex(currentNode.userData.drawerIndex)
      document.body.style.cursor = 'pointer'
    }
  }, [])

  const handlePointerOut = useCallback(() => {
    setHoveredDrawerIndex(null)
    document.body.style.cursor = 'auto'
  }, [])

  if (drawerGroups.length === 0) return null

  return (
    <group>
      {drawerGroups.map((drawerGroup, index) => (
        <primitive
          key={`drawer-${index}`}
          object={drawerGroup}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      ))}
    </group>
  )
}

export const Drawers = memo(DrawersComponent)
