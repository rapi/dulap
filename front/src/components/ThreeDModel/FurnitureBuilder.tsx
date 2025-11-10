import React, { Suspense, memo, useMemo, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { TopAndPlinth } from './parts/TopAndPlinth'
import { Column } from './parts/Column'
import { ColumnDivider } from './parts/ColumnDivider'
import { OpeningType } from './furnitureConfig'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'

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
  columnConfigurationsWithOptions?: ColumnConfigurationWithOptions[] // Extended config with door opening side
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
  columnConfigurationsWithOptions,
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
  // This is critical for performance - prevents unmounting/remounting of Column components
  const columnComponents = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => {
      const { width: columnWidth, positionX: columnPositionX } = columnData[index]
      
      // Use extended config if available (for stand), otherwise fall back to simple config
      const columnConfig = columnConfigurationsWithOptions?.[index]
      const columnType = columnConfig?.type || columnConfigurations?.[index] || ColumnConfigurationType.DRAWERS_3
      const doorOpeningSide = columnConfig?.doorOpeningSide || 'left'

      return (
        <Column
          key={`column-${index}-${doorOpeningSide}`}
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
          doorOpeningSide={doorOpeningSide}
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
    columnData,
    desiredHeight,
    desiredDepth,
    desiredPlintHeight,
    sectionsCount,
    selectedColor,
    openingType,
    columnConfigurations,
    columnConfigurationsWithOptions,
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
        {columnDividers}
      </group>
    </Suspense>
  )
}

export const FurnitureBuilder = memo(FurnitureBuilderComponent)
