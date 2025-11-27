import React, { memo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'

interface HangingRodProps {
  columnWidth: number
  columnDepth: number
  positionY: number // Absolute Y position of the rod
}

const WARDROBE_ROD_URL = '/assets/3d-models/wardrobe-rob.glb'

// Preload the wardrobe rod model
useGLTF.preload(WARDROBE_ROD_URL)

/**
 * HangingRod component - Renders a hanging rod for wardrobe clothes
 * 
 * The rod:
 * - Spans the width of the column
 * - Is positioned at the specified rodHeight from the column bottom
 * - Uses the wardrobe-rob.glb model
 */
const HangingRodComponent: React.FC<HangingRodProps> = ({
  columnWidth,
  columnDepth,
  positionY,
}) => {
  const { scene: rodObject } = useGLTF(WARDROBE_ROD_URL)

  // Clone the rod object to avoid sharing geometry between instances
  const rodClone = React.useMemo(() => {
    if (!rodObject) {
      return null
    }
    const clone = SkeletonUtils.clone(rodObject) as THREE.Object3D
    
    // Apply metallic material to make it look like a chrome rod
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#c0c0c0', // Chrome/silver color
          metalness: 0.9,
          roughness: 0.1,
          envMapIntensity: 1.0,
        })
        child.castShadow = true
        child.receiveShadow = false
      }
    })
    
    return clone
  }, [rodObject])

  if (!rodClone) {
    return null
  }

  // Position the rod
  // Z: centered in the column depth
  const positionZ = columnDepth / 2

  // Scale the rod to fit the column width
  // Assuming the rod model is 1 unit long, scale it to columnWidth
  const scaleX = columnWidth - 4 // Leave 2cm on each side for mounting
  const scaleY = 2
  const scaleZ = 1

  return (
    <group position={[0, positionY, positionZ]}>
      <primitive
        object={rodClone}
        scale={[scaleX, scaleY, scaleZ]}
        rotation={[0, 0, 0]} // Rotate to horizontal if needed
      />
    </group>
  )
}

export const HangingRod = memo(HangingRodComponent)

