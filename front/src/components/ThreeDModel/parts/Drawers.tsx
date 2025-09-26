import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useGLTF } from '@react-three/drei'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { anchorGeometryToBottom, anchorGeometryToWall, applyColorToObject } from '../furnitureUtils'
import { useFrame, ThreeEvent } from '@react-three/fiber'

interface DrawersProps {
  horizontalUrl: string
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  selectedColor: string
  drawerOffsetZ?: number
  lerpSpeed?: number
}

export const Drawers: React.FC<DrawersProps> = ({
  horizontalUrl,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
  selectedColor,
  drawerOffsetZ = 10,
  lerpSpeed = 0.1,
}) => {
  const { scene: horizontalSample } = useGLTF(horizontalUrl)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const drawerPositionsRef = useRef<Map<number, number>>(new Map())

  const drawers = useMemo(() => {
    if (!horizontalSample) return [] as THREE.Object3D[]

    const prepareComponent = (component: THREE.Object3D): THREE.Object3D => {
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
      component.userData.isDrawer = true
      component.updateMatrixWorld(true)
      return component
    }

    const list: THREE.Object3D[] = []
    for (let i = 0; i < FURNITURE_CONFIG.maxDrawers; i++) {
      list.push(prepareComponent(SkeletonUtils.clone(horizontalSample)))
    }
    return list
  }, [horizontalSample])

  useEffect(() => {
    if (!drawers || drawers.length === 0) return

    const { panelThickness, defaultScale, drawerSpacing, defaultDrawerCount } = FURNITURE_CONFIG
    const drawersFullHeight = desiredHeight - panelThickness - desiredPlintHeight
    const nrOfDrawers = Math.min(
      defaultDrawerCount,
      Math.floor(drawersFullHeight / FURNITURE_CONFIG.minDrawerHeight)
    )
    const drawerHeight = drawersFullHeight / nrOfDrawers

    drawers.forEach((drawer, index) => {
      if (index < nrOfDrawers) {
        drawer.visible = true
        drawer.scale.set(
          desiredWidth * defaultScale,
          (drawerHeight - drawerSpacing * 2) * defaultScale,
          panelThickness * defaultScale
        )
        const baseZ = desiredDepth - panelThickness
        drawer.position.set(
          0,
          desiredPlintHeight + drawerSpacing + drawerHeight * index,
          baseZ
        )
        drawer.userData.baseZ = baseZ
        drawer.userData.drawerIndex = index
        drawerPositionsRef.current.set(index, baseZ)
      } else {
        drawer.visible = false
      }
    })
  }, [drawers, desiredWidth, desiredHeight, desiredDepth, desiredPlintHeight])

  useEffect(() => {
    if (!drawers || drawers.length === 0) return
    drawers.forEach((drawer) => applyColorToObject(drawer, selectedColor))
  }, [drawers, selectedColor])

  useFrame(() => {
    if (!drawers || drawers.length === 0) return
    drawers.forEach((drawer, index) => {
      if (!drawer.visible || !drawer.userData.baseZ) return
      const baseZ = drawer.userData.baseZ
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
    while (obj && !obj.userData.isDrawer) obj = obj.parent as THREE.Object3D
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
