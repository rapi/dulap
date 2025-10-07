import React, { Suspense, memo, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { TopAndPlinth } from './parts/TopAndPlinth'
import { Column } from './parts/Column'
import { OpeningType } from './furnitureConfig'

interface StandBuilderProps {
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
}

// Preload assets for better performance
const VERTICAL_URL = '/assets/3d-models/vertical_sample.glb'
const HORIZONTAL_URL = '/assets/3d-models/horizontal_sample.glb'
const ROUND_HANDLE_URL = '/assets/3d-models/round-handle.glb'
const PROFILE_HANDLE_URL = '/assets/3d-models/profile-handle.glb'

useGLTF.preload(VERTICAL_URL)
useGLTF.preload(HORIZONTAL_URL)
useGLTF.preload(ROUND_HANDLE_URL)
useGLTF.preload(PROFILE_HANDLE_URL)

const StandBuilderComponent: React.FC<StandBuilderProps> = ({
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
}) => {
  const { scene: verticalPanelObject } = useGLTF(VERTICAL_URL)
  const { scene: horizontalPanelObject } = useGLTF(HORIZONTAL_URL)
  const { scene: roundHandleObject } = useGLTF(ROUND_HANDLE_URL)
  const { scene: profileHandleObject } = useGLTF(PROFILE_HANDLE_URL)

  const scenes = useMemo(
    () => ({
      vertical: verticalPanelObject,
      horizontal: horizontalPanelObject,
      roundHandle: roundHandleObject,
      profileHandle: profileHandleObject,
    }),
    [verticalPanelObject, horizontalPanelObject, roundHandleObject, profileHandleObject]
  )

  // Don't render until models are loaded
  if (!scenes.vertical || !scenes.horizontal) {
    return null
  }

  // Calculate column configuration
  const columnWidth = desiredWidth / columns

  // Generate columns with explicit configuration
  const columnComponents = Array.from({ length: columns }, (_, index) => {
    const columnPositionX =
      -desiredWidth / 2 + columnWidth * index + columnWidth / 2

    return (
      <Column
        key={`column-${index}`}
        horizontalPanelObject={scenes.horizontal}
        roundHandleObject={scenes.roundHandle}
        profileHandleObject={scenes.profileHandle}
        openingType={openingType}
        columnWidth={columnWidth}
        columnHeight={desiredHeight}
        columnDepth={desiredDepth}
        plintHeight={desiredPlintHeight}
        sectionsCount={sectionsCount}
        positionX={columnPositionX}
        selectedColor={selectedColor}
        drawerOffsetZ={drawerOffsetZ}
        lerpSpeed={lerpSpeed}
      />
    )
  })

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

export const StandBuilder = memo(StandBuilderComponent)
