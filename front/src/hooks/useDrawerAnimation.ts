import { useMemo } from 'react'
import * as THREE from 'three'
import { useAnimatedPosition, AnimationConfig } from './useAnimatedPosition'

interface UseDrawerAnimationProps {
  drawerGroup: THREE.Group | null
  isHovered: boolean
  drawerOffsetZ: number
  lerpSpeed: number
}

/**
 * Custom hook for drawer opening animation
 * Handles Z-position animation on hover (drawer slides out)
 */
export const useDrawerAnimation = ({
  drawerGroup,
  isHovered,
  drawerOffsetZ,
  lerpSpeed,
}: UseDrawerAnimationProps): void => {
  const baseZ = drawerGroup?.userData.baseZ ?? 0

  const animationConfig: AnimationConfig = useMemo(
    () => ({
      axis: 'z',
      baseValue: baseZ,
      activeOffset: drawerOffsetZ,
      lerpSpeed,
    }),
    [baseZ, drawerOffsetZ, lerpSpeed]
  )

  useAnimatedPosition(drawerGroup, isHovered, animationConfig)
}

