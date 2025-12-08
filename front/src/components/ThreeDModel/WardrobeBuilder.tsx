import React, { Suspense, memo, useMemo, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { WardrobeTopAndPlinth } from './parts/WardrobeTopAndPlinth'
import { WardrobeColumn } from './parts/WardrobeColumn'
import { ColumnDivider } from './parts/ColumnDivider'
import { OpeningType } from './furnitureConfig'
import { WardrobeColumnConfiguration } from '~/types/wardrobeConfigurationTypes'
import { BackPanel } from './parts/BackPanel'

interface WardrobeBuilderProps {
  selectedColor: string
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  drawerOffsetZ?: number // Kept for compatibility with FurnitureViewer props but not used
  lerpSpeed?: number
  sectionsCount: number // Kept for compatibility with FurnitureViewer props but not used
  openingType: OpeningType
  columns: number
  columnConfigurations?: WardrobeColumnConfiguration[] // Wardrobe interior configurations
  columnWidths?: number[] // Wardrobe-specific: variable column widths
  columnPositions?: number[] // Wardrobe-specific: custom column X positions
  selectedColumnIndex?: number | null
  onColumnSelectionChange?: (index: number | null) => void
}

// Preload assets for better performance (same as FurnitureBuilder)
const VERTICAL_URL = '/assets/3d-models/vertical_sample.glb'
const HORIZONTAL_URL = '/assets/3d-models/horizontal_sample.glb'
const ROUND_HANDLE_URL = '/assets/3d-models/round-handle.glb'
const PROFILE_HANDLE_URL = '/assets/3d-models/profile-handle.glb'
const PROFILE_HANDLE_LONG_URL = '/assets/3d-models/profile_trex_long_handle_120.glb'
const HINGE_WING_URL = '/assets/3d-models/hinge_wing.glb'
const HINGE_ANCHOR_URL = '/assets/3d-models/hinge_anchor.glb'

useGLTF.preload(VERTICAL_URL)
useGLTF.preload(HORIZONTAL_URL)
useGLTF.preload(ROUND_HANDLE_URL)
useGLTF.preload(PROFILE_HANDLE_URL)
useGLTF.preload(PROFILE_HANDLE_LONG_URL)
useGLTF.preload(HINGE_WING_URL)
useGLTF.preload(HINGE_ANCHOR_URL)

const WardrobeBuilderComponent: React.FC<WardrobeBuilderProps> = ({
  selectedColor,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
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
  const { scene: profileHandleLongObject } = useGLTF(PROFILE_HANDLE_LONG_URL)
  const { scene: hingeWingObject } = useGLTF(HINGE_WING_URL)
  const { scene: hingeAnchorObject } = useGLTF(HINGE_ANCHOR_URL)

  const scenes = useMemo(
    () => ({
      vertical: verticalPanelObject,
      horizontal: horizontalPanelObject,
      roundHandle: roundHandleObject,
      profileHandle: profileHandleObject,
      profileHandleLong: profileHandleLongObject,
      hingeWing: hingeWingObject,
      hingeAnchor: hingeAnchorObject,
    }),
    [verticalPanelObject, horizontalPanelObject, roundHandleObject, profileHandleObject, profileHandleLongObject, hingeWingObject, hingeAnchorObject]
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

  // Wardrobe-specific column configuration
  // Use provided widths/positions or fall back to equal distribution
  const useVariableWidths = columnWidths && columnWidths.length === columns
  const useCustomPositions = columnPositions && columnPositions.length === columns
  
  const defaultColumnWidth = desiredWidth / columns

  // Calculate column data (widths and positions) for divider calculation
  const columnData = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => {
      const columnWidth = useVariableWidths ? columnWidths![index] : defaultColumnWidth
      let columnPositionX: number
      if (useCustomPositions) {
        columnPositionX = columnPositions![index]
      } else {
        columnPositionX = -desiredWidth / 2 + defaultColumnWidth * index + defaultColumnWidth / 2
      }
      return { width: columnWidth, positionX: columnPositionX }
    })
  }, [columns, useVariableWidths, columnWidths, useCustomPositions, columnPositions, defaultColumnWidth, desiredWidth])

  // Memoize column generation to prevent unnecessary recreation on every render
  // This is critical for performance - prevents unmounting/remounting of Door components
  const columnComponents = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => {
      const { width: columnWidth, positionX: columnPositionX } = columnData[index]
      
      // Determine door type based on column width (wardrobe-specific logic)
      // Narrow columns (40-60cm): single door
      // Wide columns (61-100cm): split doors
      const doorType: 'single' | 'split' = columnWidth >= 61 ? 'split' : 'single'

      // Get column configuration for this column
      const columnConfiguration = columnConfigurations?.[index]

      return (
        <WardrobeColumn
          key={`wardrobe-column-${index}`}
          horizontalPanelObject={scenes.horizontal}
          roundHandleObject={scenes.roundHandle}
          profileHandleObject={scenes.profileHandle}
          profileHandleLongObject={scenes.profileHandleLong}
          hingeWingObject={scenes.hingeWing}
          hingeAnchorObject={scenes.hingeAnchor}
          openingType={openingType}
          columnWidth={columnWidth}
          columnHeight={desiredHeight}
          columnDepth={desiredDepth}
          plintHeight={desiredPlintHeight}
          positionX={columnPositionX}
          selectedColor={selectedColor}
          doorType={doorType}
          columnIndex={index}
          isSelected={selectedColumnIndex === index}
          onColumnClick={handleColumnClick}
          columnConfiguration={columnConfiguration}
        />
      )
    })
  }, [
    columns,
    columnData,
    desiredHeight,
    desiredDepth,
    desiredPlintHeight,
    selectedColor,
    openingType,
    scenes.horizontal,
    scenes.roundHandle,
    scenes.profileHandle,
    scenes.profileHandleLong,
    scenes.hingeWing,
    scenes.hingeAnchor,
    selectedColumnIndex,
    handleColumnClick,
    columnConfigurations,
  ])

  // Create dividers between columns (not before first or after last)
  const columnDividers = useMemo(() => {
    if (columns < 2) return null

    return Array.from({ length: columns - 1 }, (_, index) => {
      const leftColumn = columnData[index]
      const rightColumn = columnData[index + 1]
      
      // Calculate divider position: between right edge of left column and left edge of right column
      const leftColumnRightEdge = leftColumn.positionX + leftColumn.width / 2
      const rightColumnLeftEdge = rightColumn.positionX - rightColumn.width / 2
      const dividerPositionX = (leftColumnRightEdge + rightColumnLeftEdge) / 2

      return (
        <ColumnDivider
          key={`divider-${index}`}
          positionX={dividerPositionX}
          columnHeight={desiredHeight}
          columnDepth={desiredDepth}
          plintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />
      )
    })
  }, [columns, columnData, desiredHeight, desiredDepth, desiredPlintHeight, selectedColor])

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

        {/* Wardrobe-specific TopAndPlinth with smaller top panel */}
        <WardrobeTopAndPlinth
          verticalPanelObject={scenes.vertical}
          horizontalPanelObject={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />
        
        {/* Back white panel spanning entire wardrobe width */}
        <BackPanel
          width={desiredWidth}
          height={desiredHeight}
          color="#ffffff"
        />
        
        {columnComponents}
        {columnDividers}
      </group>
    </Suspense>
  )
}

export const WardrobeBuilder = memo(WardrobeBuilderComponent)

