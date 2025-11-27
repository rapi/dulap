import React, { memo, useMemo } from 'react'
import * as THREE from 'three'

interface GroundShadowProps {
  width: number
  depth: number
  position?: [number, number, number]
  opacity?: number
  blur?: number // Reserved for future use
}

/**
 * GroundShadow component creates a soft, gradient shadow on the ground
 * Similar to a CSS box-shadow effect, positioned at the base of furniture
 */
export const GroundShadow = memo(function GroundShadow({
  width,
  depth,
  position = [0, 0.01, 70], // Slightly above ground to avoid z-fighting
  opacity = 0.15,
  blur, // Reserved for future use
}: GroundShadowProps) {
  // Suppress unused parameter warning
  void blur
  // Create a gradient texture for the shadow
  // Use elliptical gradient to match furniture footprint (width x depth)
  const shadowTexture = useMemo(() => {
    // Calculate aspect ratio to create proper elliptical shadow
    const aspectRatio = Math.max(width, depth) / Math.min(width, depth)
    const baseSize = 512
    const canvasWidth = width > depth ? baseSize * aspectRatio : baseSize
    const canvasHeight = depth > width ? baseSize * aspectRatio : baseSize
    
    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const context = canvas.getContext('2d')
    
    if (!context) return null

    // Clear canvas with transparent background
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    
    // Create elliptical gradient by using a scaled radial gradient
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const radiusX = canvasWidth / 2
    const radiusY = canvasHeight / 2
    const maxRadius = Math.max(radiusX, radiusY)
    
    // Create radial gradient that will be stretched to elliptical
    const gradient = context.createRadialGradient(
      centerX, centerY, maxRadius * 0.05, // Start from small inner radius
      centerX, centerY, maxRadius * 0.95  // Extend almost to edge
    )
    
    // Gradient stops for smooth falloff - more gradual transition
    gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity * 0.9})`)
    gradient.addColorStop(0.15, `rgba(0, 0, 0, ${opacity * 0.7})`)
    gradient.addColorStop(0.3, `rgba(0, 0, 0, ${opacity * 0.5})`)
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${opacity * 0.3})`)
    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${opacity * 0.15})`)
    gradient.addColorStop(0.85, `rgba(0, 0, 0, ${opacity * 0.05})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [opacity, width, depth])

  // Calculate shadow dimensions - slightly larger than furniture for realistic shadow spread
  const shadowDimensions = useMemo(() => {
    // Shadow extends beyond furniture edges
    const shadowWidth = width * 1.3
    const shadowDepth = depth * 1.3
    return { width: shadowWidth, depth: shadowDepth }
  }, [width, depth])

  // Create material with gradient texture
  const material = useMemo(() => {
    if (!shadowTexture) {
      // Fallback to simple transparent material if texture creation fails
      return new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: opacity * 0.3,
      })
    }

    return new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 1,
      depthWrite: false, // Prevent shadow from writing to depth buffer
      side: THREE.DoubleSide,
    })
  }, [shadowTexture, opacity])

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]} // Rotate to lie flat on ground
      material={material}
      receiveShadow={false}
      castShadow={false}
      visible={false} // Hidden by default, shown only in screenshots
      userData={{ isGroundShadow: true }}
    >
      <planeGeometry args={[shadowDimensions.width, shadowDimensions.depth]} />
    </mesh>
  )
})

GroundShadow.displayName = 'GroundShadow'

