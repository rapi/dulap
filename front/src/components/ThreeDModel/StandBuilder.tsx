import React, { Suspense } from 'react'
import { SidePanels } from './parts/SidePanels'
import { TopAndPlinth } from './parts/TopAndPlinth'
import { Drawers } from './parts/Drawers'

interface StandBuilderProps {
  selectedColor: string
  desiredWidth: number
  desiredHeight: number
  desiredDepth: number
  desiredPlintHeight: number
}

export const StandBuilder: React.FC<StandBuilderProps> = ({
  selectedColor,
  desiredWidth,
  desiredHeight,
  desiredDepth,
  desiredPlintHeight,
}) => {
  const verticalUrl = '/assets/3d-models/vertical_sample.glb'
  const horizontalUrl = '/assets/3d-models/horizontal_sample.glb'

  return (
    <Suspense fallback={null}>
      <group>
        <SidePanels
          horizontalUrl={horizontalUrl}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          selectedColor={selectedColor}
        />

        <TopAndPlinth
          verticalUrl={verticalUrl}
          horizontalUrl={horizontalUrl}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />

        <Drawers
          horizontalUrl={horizontalUrl}
          desiredWidth={desiredWidth}
          desiredHeight={desiredHeight}
          desiredDepth={desiredDepth}
          desiredPlintHeight={desiredPlintHeight}
          selectedColor={selectedColor}
        />
      </group>
    </Suspense>
  )
}
