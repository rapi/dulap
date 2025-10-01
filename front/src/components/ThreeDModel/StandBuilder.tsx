import React, { Suspense, memo, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { TopAndPlinth } from './parts/TopAndPlinth'
import { Drawers } from './parts/Drawers'
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
}

// Preload assets for better performance
const VERTICAL_URL = '/assets/3d-models/vertical_sample.glb'
const HORIZONTAL_URL = '/assets/3d-models/horizontal_sample.glb'
const HANDLE_URL = '/assets/3d-models/handle.glb'

useGLTF.preload(VERTICAL_URL)
useGLTF.preload(HORIZONTAL_URL)
useGLTF.preload(HANDLE_URL)

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
}) => {

  const { scene: verticalPanelObject } = useGLTF(VERTICAL_URL)
  const { scene: horizontalPanelObject } = useGLTF(HORIZONTAL_URL)
  const { scene: handleObject } = useGLTF(HANDLE_URL)

  const scenes = useMemo(
    () => ({
      vertical: verticalPanelObject,
      horizontal: horizontalPanelObject,
      handle: handleObject,
    }),
    [verticalPanelObject, horizontalPanelObject, handleObject]
  )

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

        <Drawers
          handleObject={scenes.handle}
          horizontalPanelObject={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
          drawerOffsetZ={drawerOffsetZ}
          lerpSpeed={lerpSpeed}
          sectionsCount={sectionsCount}
          openingType={openingType}
        />
      </group>
    </Suspense>
  )
}

export const StandBuilder = memo(StandBuilderComponent)
