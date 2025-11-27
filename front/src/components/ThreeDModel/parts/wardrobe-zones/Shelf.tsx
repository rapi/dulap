import React, { memo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { applyMaterialToObject } from '../../furnitureUtils'

interface ShelfProps {
  columnWidth: number
  columnDepth: number
  positionY: number // Absolute Y position of the shelf
  selectedColor: string
  thickness?: number // Shelf thickness in cm, default 2cm
}

/**
 * Shelf component - Renders a single shelf for wardrobe
 * 
 * The shelf:
 * - Spans the width of the column
 * - Is positioned at the specified Y position
 * - Has configurable thickness (default 2cm)
 * - Uses the same material as the wardrobe panels
 */
const ShelfComponent: React.FC<ShelfProps> = ({
  columnWidth,
  columnDepth,
  positionY,
  selectedColor,
  thickness = 2,
}) => {
  const shelfRef = useRef<THREE.Mesh>(null)

  // Apply color/texture to shelf
  useEffect(() => {
    if (shelfRef.current) {
      applyMaterialToObject(shelfRef.current, selectedColor)
    }
  }, [selectedColor])

  // Position the shelf
  // Y: absolute position
  // Z: centered in the column depth
  const positionZ = columnDepth / 2

  return (
    <mesh
      ref={shelfRef}
      position={[0, positionY, positionZ]}
      rotation={[-Math.PI / 2, 0, 0]} // Rotate to be horizontal
      castShadow
      receiveShadow
    >
      <boxGeometry args={[columnWidth, columnDepth-5, thickness]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )
}

export const Shelf = memo(ShelfComponent)

