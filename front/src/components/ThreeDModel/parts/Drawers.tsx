import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import {
  anchorGeometryToBottom,
  anchorGeometryToWall,
  applyColorToObject,
  disposeObject,
} from '../furnitureUtils'
import { useFrame, ThreeEvent } from '@react-three/fiber'

interface DrawersProps {
  horizontalScene: THREE.Object3D
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
  drawerOffsetZ?: number
  lerpSpeed?: number
}

export const Drawers: React.FC<DrawersProps> = ({
  horizontalScene,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
  selectedColor,
  drawerOffsetZ = 15, // Increased for more visible pull-out effect
  lerpSpeed = 0.15, // Slightly faster for more responsive feel
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const drawerPositionsRef = useRef<Map<number, number>>(new Map())

  const drawers = useMemo(() => {
    if (!horizontalScene) return [] as THREE.Object3D[]

    const prepareComponent = (
      component: THREE.Object3D,
      userData?: Record<string, unknown>
    ): THREE.Object3D => {
      component.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const mesh = o as THREE.Mesh
          if (mesh.material) {
            mesh.material = Array.isArray(mesh.material)
              ? mesh.material.map((m) => m.clone())
              : mesh.material.clone()
          }
          anchorGeometryToBottom(mesh)
          anchorGeometryToWall(mesh)
          mesh.uuid = THREE.MathUtils.generateUUID()
          mesh.castShadow = true
          mesh.receiveShadow = true
          mesh.matrixAutoUpdate = true
          mesh.updateMatrix()
        }
      })
      component.uuid = THREE.MathUtils.generateUUID()
      if (userData) {
        component.userData = userData
      }
      component.updateMatrixWorld(true)
      return component
    }

    const list: THREE.Object3D[] = []

    for (let i = 0; i < FURNITURE_CONFIG.maxDrawers; i++) {
      const frontDrawerPart = prepareComponent(
        SkeletonUtils.clone(horizontalScene),
        { isDrawer: true }
      )
      const bottomDrawerPart = prepareComponent(
        SkeletonUtils.clone(horizontalScene),
        { bottomDrawer: true }
      )
      const leftDrawerPart = prepareComponent(
        SkeletonUtils.clone(horizontalScene),
        { leftDrawer: true }
      )
      const rightDrawerPart = prepareComponent(
        SkeletonUtils.clone(horizontalScene),
        { rightDrawer: true }
      )

      const combinedDrawer = new THREE.Group()
      combinedDrawer.add(frontDrawerPart)
      combinedDrawer.add(bottomDrawerPart)
      combinedDrawer.add(leftDrawerPart)
      combinedDrawer.add(rightDrawerPart)

      combinedDrawer.userData.isDrawerGroup = true
      combinedDrawer.uuid = THREE.MathUtils.generateUUID()

      list.push(combinedDrawer)
    }
    return list
  }, [horizontalScene])

  useEffect(() => {
    if (!drawers || drawers.length === 0) return

    const { panelThickness, defaultScale, drawerSpacing, defaultDrawerCount } =
      FURNITURE_CONFIG
    const drawersFullHeight =
      desiredHeight - panelThickness - desiredPlintHeight
    const nrOfDrawers = Math.min(
      defaultDrawerCount,
      Math.floor(drawersFullHeight / FURNITURE_CONFIG.minDrawerHeight)
    )
    const drawerHeight = drawersFullHeight / nrOfDrawers
    const drawerBox = {
      height: drawerHeight - 5,
      width: desiredWidth - panelThickness * 2 - drawerSpacing * 2,
      depth: desiredDepth - panelThickness * 2 - drawerSpacing * 2,
    }

    drawers.forEach((drawer, index) => {
      if (index < nrOfDrawers) {
        drawer.visible = true

        // Set the drawer group's position and metadata
        const baseY = desiredPlintHeight + drawerSpacing + drawerHeight * index
        const baseZ = 0
        drawer.position.set(0, baseY, baseZ)
        drawer.userData.baseZ = baseZ
        drawer.userData.drawerIndex = index
        drawerPositionsRef.current.set(index, baseZ)

        // Position children relative to the group
        drawer.children.forEach((child) => {
          if (child.userData.isDrawer) {
            child.scale.set(
              desiredWidth * defaultScale,
              (drawerHeight - drawerSpacing * 2) * defaultScale,
              panelThickness * defaultScale
            )
            child.position.set(0, 0, desiredDepth - panelThickness)
          } else if (child.userData.leftDrawer) {
            child.scale.set(
              panelThickness * defaultScale,
              drawerBox.height * defaultScale,
              drawerBox.depth * defaultScale
            )
            child.position.set(
              -drawerBox.width / 2 + panelThickness / 2,
              0,
              panelThickness
            )
          } else if (child.userData.rightDrawer) {
            child.scale.set(
              panelThickness * defaultScale,
              drawerBox.height * defaultScale,
              drawerBox.depth * defaultScale
            )
            child.position.set(
              desiredWidth / 2 - panelThickness / 2,
              0,
              panelThickness
            )
          } else if (child.userData.bottomDrawer) {
            child.scale.set(
              drawerBox.width * defaultScale,
              panelThickness * defaultScale,
              drawerBox.depth * defaultScale
            )
            child.position.set(0, 0, panelThickness)
          }
        })
      } else {
        drawer.visible = false
      }
    })
  }, [drawers, desiredWidth, desiredHeight, desiredDepth, desiredPlintHeight])

  useEffect(() => {
    if (!drawers || drawers.length === 0) return
    drawers.forEach((drawer) => applyColorToObject(drawer, selectedColor))
  }, [drawers, selectedColor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      drawers.forEach((drawer) => {
        if (drawer) disposeObject(drawer)
      })
      document.body.style.cursor = 'auto'
    }
  }, [drawers])

  useFrame(() => {
    if (!drawers || drawers.length === 0) return

    drawers.forEach((drawer) => {
      if (!drawer.visible || typeof drawer.userData.drawerIndex !== 'number')
        return

      const index = drawer.userData.drawerIndex
      const baseZ = drawer.userData.baseZ || 0
      const targetZ = hoveredIndex === index ? baseZ + drawerOffsetZ : baseZ
      const currentZ = drawerPositionsRef.current.get(index) || baseZ
      const newZ = THREE.MathUtils.lerp(currentZ, targetZ, lerpSpeed)

      drawer.position.z = newZ
      drawerPositionsRef.current.set(index, newZ)
    })
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    let obj = e.object as THREE.Object3D | undefined

    while (obj && typeof obj.userData.drawerIndex !== 'number') {
      obj = obj.parent as THREE.Object3D
    }

    if (obj && typeof obj.userData.drawerIndex === 'number') {
      setHoveredIndex(obj.userData.drawerIndex)
      document.body.style.cursor = 'pointer'
    }
  }
  const handlePointerOut = () => {
    setHoveredIndex(null)
    document.body.style.cursor = 'auto'
  }

  if (!drawers || drawers.length === 0) return null

  return (
    <group>
      {drawers.map((drawer, index) => (
        <primitive
          key={`drawer-${index}`}
          object={drawer}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      ))}
    </group>
  )
}
