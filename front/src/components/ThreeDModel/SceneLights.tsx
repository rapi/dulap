import React, { memo } from 'react'

type ShadowQuality = 'low' | 'medium' | 'high'

export const SceneLights: React.FC<{
  enableShadows?: boolean
  ambientLightIntensity?: number
  shadowQuality?: ShadowQuality
}> = memo(({ enableShadows = true, ambientLightIntensity = 0.25, shadowQuality = 'high' }) => {
  const shadowMapSize = shadowQuality === 'high' ? 8192 : shadowQuality === 'medium' ? 4096 : 2048

  return (
    <>
      {/* Soft ambient light simulating room lighting */}
      <ambientLight intensity={ambientLightIntensity} color="#f5f5f5" />

      {/* Key light – main directional light simulating window light */}
      <directionalLight
        position={[-80, 200, 150]}
        intensity={2.5}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={2000}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={2}
        color="#fff8f0"
      />

      {/* Fill light – softer light from opposite side */}
      <directionalLight position={[150, 180, 100]} intensity={1.2} color="#e6f3ff" />

      {/* Top light – simulating ceiling lighting */}
      <directionalLight position={[0, 300, 0]} intensity={0.8} color="#ffffff" />

      {/* Rim/back light – subtle separation from background */}
      <directionalLight position={[0, 120, -200]} intensity={0.3} color="#fff8f0" />
    </>
  )
})


