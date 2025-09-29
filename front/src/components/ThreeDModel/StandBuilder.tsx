import React, { Suspense, memo, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { SidePanels } from './parts/SidePanels'
import { TopAndPlinth } from './parts/TopAndPlinth'
import { Drawers } from './parts/Drawers'

interface StandBuilderProps {
  selectedColor: string
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
  drawerOffsetZ?: number
  lerpSpeed?: number
}

// Preload assets for better performance
const VERTICAL_URL = '/assets/3d-models/vertical_sample.glb'
const HORIZONTAL_URL = '/assets/3d-models/horizontal_sample.glb'

useGLTF.preload(VERTICAL_URL)
useGLTF.preload(HORIZONTAL_URL)

const StandBuilderComponent: React.FC<StandBuilderProps> = ({
  selectedColor,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
  drawerOffsetZ = 10,
  lerpSpeed = 0.1,
}) => {

  const { scene: verticalScene } = useGLTF(VERTICAL_URL)
  const { scene: horizontalScene } = useGLTF(HORIZONTAL_URL)

  const scenes = useMemo(
    () => ({
      vertical: verticalScene,
      horizontal: horizontalScene,
    }),
    [verticalScene, horizontalScene]
  )

  // Don't render until models are loaded
  if (!scenes.vertical || !scenes.horizontal) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <group>
        <SidePanels
          horizontalScene={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          selectedColor={selectedColor}
        />

        <TopAndPlinth
          verticalScene={scenes.vertical}
          horizontalScene={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />

        <Drawers
          horizontalScene={scenes.horizontal}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
          drawerOffsetZ={drawerOffsetZ}
          lerpSpeed={lerpSpeed}
        />
      </group>
    </Suspense>
  )
}

export const StandBuilder = memo(StandBuilderComponent)
