import React, { memo } from 'react'
import * as THREE from 'three'

interface SphereProps {
  position: [number, number, number]
  radius?: number
  color?: string
  castShadow?: boolean
  receiveShadow?: boolean
}

/**
 * Sphere - A simple sphere component for decorations
 */
const SphereComponent: React.FC<SphereProps> = ({
  position,
  radius = 2, // Default 2cm radius (4cm diameter)
  color = '#000000', // Default black
  castShadow = true,
  receiveShadow = true,
}) => {
  return (
    <mesh position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  )
}

export const Sphere = memo(SphereComponent)

