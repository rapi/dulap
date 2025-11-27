import React, { memo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const GLBModel = memo(function GLBModel({
  modelUrl,
  modelPosition = [0, 0, 0],
  modelScale = [1, 1, 1],
  modelRotation = [0, 0, 0],
  overrideColorHex,
  shouldCastShadow = true,
  shouldReceiveShadow = true,
  forceFlatColorHex,
  useLambertWhiteMaterial,
  onClick,
  userData,
}: {
  modelUrl: string
  modelPosition?: [number, number, number]
  modelScale?: [number, number, number]
  modelRotation?: [number, number, number]
  overrideColorHex?: string
  shouldCastShadow?: boolean
  shouldReceiveShadow?: boolean
  forceFlatColorHex?: string
  useLambertWhiteMaterial?: boolean
  onClick?: () => void
  userData?: Record<string, any>
}) {
  const { scene: gltfScene } = useGLTF(modelUrl)
  
  // Apply userData to the scene root
  React.useEffect(() => {
    if (gltfScene && userData) {
      Object.assign(gltfScene.userData, userData)
    }
  }, [gltfScene, userData])

  React.useEffect(() => {
    if (!gltfScene) return

    gltfScene.traverse((object3D) => {
      if (object3D instanceof THREE.Mesh) {
        const mesh = object3D

        if (forceFlatColorHex) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if (material instanceof THREE.Material) {
                material.dispose()
              }
            })
          } else if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose()
          }
          mesh.material = new THREE.MeshBasicMaterial({ color: forceFlatColorHex, toneMapped: false })
        } else if (useLambertWhiteMaterial) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if (material instanceof THREE.Material) {
                material.dispose()
              }
            })
          } else if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose()
          }
          mesh.material = new THREE.MeshLambertMaterial({ color: '#ffffff' })
        } else if (overrideColorHex) {
          const material = mesh.material
          if (!Array.isArray(material) && 'color' in material && material.color instanceof THREE.Color) {
            material.color.set(overrideColorHex)
          }
        }

        mesh.castShadow = shouldCastShadow
        mesh.receiveShadow = shouldReceiveShadow
      }
    })
  }, [gltfScene, overrideColorHex, shouldCastShadow, shouldReceiveShadow, forceFlatColorHex, useLambertWhiteMaterial])

  return (
    <primitive
      object={gltfScene}
      position={modelPosition}
      scale={modelScale}
      rotation={modelRotation}
      castShadow={shouldCastShadow}
      receiveShadow={shouldReceiveShadow}
      onClick={onClick}
    />
  )
})
