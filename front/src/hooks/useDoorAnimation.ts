import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FURNITURE_CONFIG } from '~/components/ThreeDModel/furnitureConfig'
import { useAnimatedPosition, AnimationConfig } from './useAnimatedPosition'

export type OpeningSide = 'left' | 'right'

interface UseDoorAnimationProps {
  hingeGroup: THREE.Group | null
  isHovered: boolean
  isRightOpening: boolean
  doorDepth: number
}

/**
 * Custom hook for door opening animation
 * Handles both rotation (Y-axis) and Z-position animation on hover
 */
export const useDoorAnimation = ({
  hingeGroup,
  isHovered,
  isRightOpening,
  doorDepth,
}: UseDoorAnimationProps): void => {
  const zOffsetRef = useRef(0)

  // Calculate rotation angle
  const openAngle = isRightOpening
    ? FURNITURE_CONFIG.doorOpenAngle
    : -FURNITURE_CONFIG.doorOpenAngle

  // Rotation animation using existing hook
  const rotationConfig: AnimationConfig = useMemo(
    () => ({
      axis: 'rotationY',
      baseValue: 0,
      activeOffset: openAngle,
      lerpSpeed: FURNITURE_CONFIG.animationLerpSpeed,
    }),
    [openAngle]
  )

  useAnimatedPosition(hingeGroup, isHovered, rotationConfig)

  // Z-position: smooth animation on hover, instant update on depth change
  const baseZPosition = doorDepth - FURNITURE_CONFIG.panelThickness

  useFrame(() => {
    if (!hingeGroup) return

    // Target offset: 0 when not hovered, +thickness when hovered
    const targetOffset = isHovered ? FURNITURE_CONFIG.panelThickness : 0

    // Smoothly interpolate the offset
    zOffsetRef.current = THREE.MathUtils.lerp(
      zOffsetRef.current,
      targetOffset,
      FURNITURE_CONFIG.animationLerpSpeed
    )

    // Apply base position + animated offset
    hingeGroup.position.z = baseZPosition + zOffsetRef.current
  })
}

