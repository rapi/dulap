import React, { Suspense, memo, useMemo, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { TopAndPlinth } from './parts/TopAndPlinth'
import { Column } from './parts/Column'
import { OpeningType } from './furnitureConfig'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'

interface FurnitureBuilderProps {
  selectedColor: string
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  drawerOffsetZ?: number
  lerpSpeed?: number
  sectionsCount: number
  openingType: OpeningType
  columns: number
  columnConfigurations?: ColumnConfigurationType[]
  columnWidths?: number[] // Optional: variable column widths (for wardrobe)
  columnPositions?: number[] // Optional: custom column X positions
  selectedColumnIndex?: number | null
  onColumnSelectionChange?: (index: number | null) => void
}

// Preload assets for better performance
const VERTICAL_URL = '/assets/3d-models/vertical_sample.glb'
const HORIZONTAL_URL = '/assets/3d-models/horizontal_sample.glb'
const ROUND_HANDLE_URL = '/assets/3d-models/round-handle.glb'
const PROFILE_HANDLE_URL = '/assets/3d-models/profile-handle.glb'
const HINGE_WING_URL = '/assets/3d-models/hinge_wing.glb'
const HINGE_ANCHOR_URL = '/assets/3d-models/hinge_anchor.glb'

useGLTF.preload(VERTICAL_URL)
useGLTF.preload(HORIZONTAL_URL)
useGLTF.preload(ROUND_HANDLE_URL)
useGLTF.preload(PROFILE_HANDLE_URL)
useGLTF.preload(HINGE_WING_URL)
useGLTF.preload(HINGE_ANCHOR_URL)

const FurnitureBuilderComponent: React.FC<FurnitureBuilderProps> = ({
  selectedColor,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
  drawerOffsetZ = 10,
  lerpSpeed = 0.1,
  sectionsCount,
  openingType,
  columns,
  columnConfigurations,
  columnWidths,
  columnPositions,
  selectedColumnIndex: externalSelectedColumnIndex,
  onColumnSelectionChange,
}) => {
  // Use local state if no external state is provided (for standalone use)
  const [internalSelectedColumnIndex, setInternalSelectedColumnIndex] = useState<number | null>(null)
  
  const selectedColumnIndex = externalSelectedColumnIndex !== undefined ? externalSelectedColumnIndex : internalSelectedColumnIndex
  
  const { scene: verticalPanelObject } = useGLTF(VERTICAL_URL)
  const { scene: horizontalPanelObject } = useGLTF(HORIZONTAL_URL)
  const { scene: roundHandleObject } = useGLTF(ROUND_HANDLE_URL)
  const { scene: profileHandleObject } = useGLTF(PROFILE_HANDLE_URL)
  const { scene: hingeWingObject } = useGLTF(HINGE_WING_URL)
  const { scene: hingeAnchorObject } = useGLTF(HINGE_ANCHOR_URL)

  const scenes = useMemo(
    () => ({
      vertical: verticalPanelObject,
      horizontal: horizontalPanelObject,
      roundHandle: roundHandleObject,
      profileHandle: profileHandleObject,
      hingeWing: hingeWingObject,
      hingeAnchor: hingeAnchorObject,
    }),
    [verticalPanelObject, horizontalPanelObject, roundHandleObject, profileHandleObject, hingeWingObject, hingeAnchorObject]
  )

  // Handle column selection
  const handleColumnClick = useCallback((index: number) => {
    if (onColumnSelectionChange) {
      // External setter - calculate new value
      onColumnSelectionChange(selectedColumnIndex === index ? null : index)
    } else {
      // Internal setter - use functional update
      setInternalSelectedColumnIndex((prevIndex) => (prevIndex === index ? null : index))
    }
  }, [onColumnSelectionChange, selectedColumnIndex])

  // Calculate column configuration
  // Use provided widths or fall back to equal distribution
  const useVariableWidths = columnWidths && columnWidths.length === columns
  const useCustomPositions = columnPositions && columnPositions.length === columns
  
  const defaultColumnWidth = desiredWidth / columns

  // Memoize column generation to prevent unnecessary recreation on every render
  // This is critical for performance - prevents unmounting/remounting of Column components
  const columnComponents = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => {
      // Get column width (variable or equal)
      const columnWidth = useVariableWidths ? columnWidths![index] : defaultColumnWidth
      
      // Get column position (custom or calculated)
      let columnPositionX: number
      if (useCustomPositions) {
        columnPositionX = columnPositions![index]
      } else {
        // Default equal distribution
        columnPositionX = -desiredWidth / 2 + defaultColumnWidth * index + defaultColumnWidth / 2
      }
      
      const columnType = columnConfigurations?.[index] || ColumnConfigurationType.DRAWERS_3

      return (
        <Column
          key={`column-${index}`}
          horizontalPanelObject={scenes.horizontal}
          roundHandleObject={scenes.roundHandle}
          profileHandleObject={scenes.profileHandle}
          hingeWingObject={scenes.hingeWing}
          hingeAnchorObject={scenes.hingeAnchor}
          openingType={openingType}
          columnWidth={columnWidth}
          columnHeight={desiredHeight}
          columnDepth={desiredDepth}
          plintHeight={desiredPlintHeight}
          sectionsCount={sectionsCount}
          positionX={columnPositionX}
          selectedColor={selectedColor}
          columnType={columnType}
          drawerOffsetZ={drawerOffsetZ}
          lerpSpeed={lerpSpeed}
          columnIndex={index}
          isSelected={selectedColumnIndex === index}
          onColumnClick={handleColumnClick}
        />
      )
    })
  }, [
    columns,
    useVariableWidths,
    useCustomPositions,
    columnWidths,
    columnPositions,
    defaultColumnWidth,
    desiredWidth,
    desiredHeight,
    desiredDepth,
    desiredPlintHeight,
    sectionsCount,
    selectedColor,
    openingType,
    columnConfigurations,
    drawerOffsetZ,
    lerpSpeed,
    scenes.horizontal,
    scenes.roundHandle,
    scenes.profileHandle,
    scenes.hingeWing,
    scenes.hingeAnchor,
    selectedColumnIndex,
    handleColumnClick,
  ])

  // Don't render until models are loaded
  if (!scenes.vertical || !scenes.horizontal) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <group>
        <SidePanels
          horizontalPanelObject={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          selectedColor={selectedColor}
        />

        <TopAndPlinth
          verticalPanelObject={scenes.vertical}
          horizontalPanelObject={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />

        {columnComponents}
      </group>
    </Suspense>
  )
}

export const FurnitureBuilder = memo(FurnitureBuilderComponent)
