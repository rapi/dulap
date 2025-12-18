import React, { Suspense, memo, useMemo, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { WardrobeTopAndPlinth } from './parts/WardrobeTopAndPlinth'
import { ColumnDivider } from './parts/ColumnDivider'
import { Shelf } from './parts/wardrobe-zones/Shelf'
import { BackPanel } from './parts/BackPanel'
import { RackColumn } from './parts/RackColumn'
import { OpeningType } from './furnitureConfig'
import { RackColumnConfiguration } from '~/types/rackConfigurationTypes'

interface RackBuilderProps {
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
  columnConfigurations?: RackColumnConfiguration[]
  columnWidths?: number[]
  columnPositions?: number[]
  selectedColumnIndex?: number | null
  onColumnSelectionChange?: (index: number | null) => void
}

// Preload assets
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

const RackBuilderComponent: React.FC<RackBuilderProps> = ({
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
  // Use local state if no external state is provided
  const [internalSelectedColumnIndex, setInternalSelectedColumnIndex] =
    useState<number | null>(null)

  const selectedColumnIndex =
    externalSelectedColumnIndex !== undefined
      ? externalSelectedColumnIndex
      : internalSelectedColumnIndex
  // Load 3D models
  const { scene: vertical } = useGLTF(VERTICAL_URL)
  const { scene: horizontal } = useGLTF(HORIZONTAL_URL)
  const { scene: roundHandle } = useGLTF(ROUND_HANDLE_URL)
  const { scene: profileHandle } = useGLTF(PROFILE_HANDLE_URL)
  const { scene: hingeWing } = useGLTF(HINGE_WING_URL)
  const { scene: hingeAnchor } = useGLTF(HINGE_ANCHOR_URL)

  const scenes = useMemo(
    () => ({
      vertical,
      horizontal,
      roundHandle,
      profileHandle,
      hingeWing,
      hingeAnchor,
    }),
    [vertical, horizontal, roundHandle, profileHandle, hingeWing, hingeAnchor]
  )

  // Handle column selection
  const handleColumnClick = useCallback(
    (index: number) => {
      if (onColumnSelectionChange) {
        // External setter - calculate new value
        onColumnSelectionChange(selectedColumnIndex === index ? null : index)
      } else {
        // Internal setter - use functional update
        setInternalSelectedColumnIndex((prevIndex) =>
          prevIndex === index ? null : index
        )
      }
    },
    [onColumnSelectionChange, selectedColumnIndex]
  )

  // Calculate column data
  const columnData = useMemo(() => {
    const useVariableWidths =
      columnWidths !== undefined && columnWidths.length > 0
    const useCustomPositions =
      columnPositions !== undefined && columnPositions.length > 0
    const defaultColumnWidth = desiredWidth / columns

    return Array.from({ length: columns }, (_, index) => {
      const columnWidth = useVariableWidths
        ? columnWidths[index]
        : defaultColumnWidth
      const columnPositionX = useCustomPositions
        ? columnPositions[index]
        : -desiredWidth / 2 + columnWidth / 2 + index * columnWidth

      return { width: columnWidth, positionX: columnPositionX }
    })
  }, [columns, columnWidths, columnPositions, desiredWidth])

  // Create column components with zone rendering
  const columnComponents = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => {
      const { width: columnWidth, positionX: columnPositionX } =
        columnData[index]

      // Get column configuration for this column
      const columnConfiguration = columnConfigurations?.[index]

      return (
        <RackColumn
          key={`rack-column-${index}`}
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
          positionX={columnPositionX}
          selectedColor={selectedColor}
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
    scenes.hingeWing,
    scenes.hingeAnchor,
    selectedColumnIndex,
    handleColumnClick,
    columnConfigurations,
  ])

  // Create dividers between columns
  const dividers = useMemo(() => {
    if (columns <= 1) return null

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
          plintHeight={2}
          selectedColor={selectedColor}
        />
      )
    })
  }, [columns, columnData, desiredHeight, desiredDepth, selectedColor])

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

        {/* Rack uses WardrobeTopAndPlinth component */}
        <WardrobeTopAndPlinth
          verticalPanelObject={scenes.vertical}
          horizontalPanelObject={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />

        {/* Back panel spanning entire rack width */}
        <BackPanel
          width={desiredWidth}
          height={desiredHeight}
          color={selectedColor}
        />

        {/* Bottom shelf spanning entire rack width */}
        <Shelf
          columnWidth={desiredWidth - 1}
          columnDepth={desiredDepth}
          positionY={desiredPlintHeight + 1}
          selectedColor={selectedColor}
          thickness={2}
        />

        {columnComponents}
        {dividers}
      </group>
    </Suspense>
  )
}

export const RackBuilder = memo(RackBuilderComponent)
