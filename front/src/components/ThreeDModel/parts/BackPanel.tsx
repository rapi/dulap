import React, { memo, useMemo } from 'react'
import * as THREE from 'three'

interface BackPanelProps {
  width: number
  height: number
  positionZ?: number // Z position (depth offset from back), default 2cm
  color?: string // Panel color, default white
}

/**
 * BackPanel component - Renders a back panel for rack
 * 
 * The panel:
 * - Spans the full width and height
 * - Is positioned at the back of the rack/wardrobe
 * - Has configurable color (default white, or lighter version of selected color)
 * - Uses double-sided material to be visible from both sides
 */
const BackPanelComponent: React.FC<BackPanelProps> = ({
  width,
  height,
  positionZ = 1,
  color = '#ffffff',
}) => {
  // Create a lighter version of the color (add 30% brightness)
  const lighterColor = useMemo(() => {
    const threeColor = new THREE.Color(color)
    // Lighten by interpolating towards white
    threeColor.lerp(new THREE.Color(0xffffff), 0.08)
    return threeColor
  }, [color])

  return (
    <mesh
      position={[0, height / 2, positionZ]}
      rotation={[0, Math.PI, 0]}
    //   castShadow
    //   receiveShadow
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={lighterColor} side={THREE.DoubleSide} />
    </mesh>
  )
}

export const BackPanel = memo(BackPanelComponent)

