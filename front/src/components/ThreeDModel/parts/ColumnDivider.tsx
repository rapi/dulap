import React, { memo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '../furnitureConfig'
import { applyMaterialToObject } from '../furnitureUtils'

interface ColumnDividerProps {
  positionX: number
  columnHeight: number
  columnDepth: number
  plintHeight: number
  selectedColor: string
}

const ColumnDividerComponent: React.FC<ColumnDividerProps> = ({
  positionX,
  columnHeight,
  columnDepth,
  plintHeight,
  selectedColor,
}) => {
  const { panelThickness } = FURNITURE_CONFIG
  const dividerRef = useRef<THREE.Mesh>(null)

  // Apply color/texture to divider
  useEffect(() => {
    if (dividerRef.current) {
      applyMaterialToObject(dividerRef.current, selectedColor)
    }
  }, [selectedColor])

  // Calculate divider dimensions
  // Height: from plinth to top (columnHeight - plintHeight)
  // Depth: full column depth
  // Width: panelThickness (thickness of the divider)
  const dividerHeight = columnHeight - plintHeight - panelThickness
  const dividerY = plintHeight + dividerHeight / 2

  return (
    <mesh
      ref={dividerRef}
      position={[positionX, dividerY, columnDepth / 2]}
    >
      <boxGeometry args={[panelThickness, dividerHeight, columnDepth - 2*panelThickness]} />
      <meshStandardMaterial color={selectedColor} />
    </mesh>
  )
}

export const ColumnDivider = memo(ColumnDividerComponent)

