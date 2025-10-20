import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface AnimationConfig {
  axis: 'x' | 'y' | 'z' | 'rotationX' | 'rotationY' | 'rotationZ'
  baseValue: number
  activeOffset: number
  lerpSpeed?: number
}

/**
 * Hook for animating object position or rotation with smooth interpolation
 * 
 * @param object - The THREE.Object3D to animate (can be null)
 * @param isActive - Whether the animation should be in the "active" state
 * @param config - Configuration for the animation
 * 
 * @example
 * // For a drawer that slides out
 * useAnimatedPosition(drawerGroup, isHovered, {
 *   axis: 'z',
 *   baseValue: 0,
 *   activeOffset: 15,
 *   lerpSpeed: 0.15
 * })
 * 
 * @example
 * // For a door that rotates open
 * useAnimatedPosition(doorHinge, isHovered, {
 *   axis: 'rotationY',
 *   baseValue: 0,
 *   activeOffset: Math.PI / 2,
 *   lerpSpeed: 0.15
 * })
 */
export const useAnimatedPosition = (
  object: THREE.Object3D | null,
  isActive: boolean,
  config: AnimationConfig
): void => {
  const currentValueRef = useRef(config.baseValue)

  useFrame(() => {
    if (!object) return

    const targetValue = isActive 
      ? config.baseValue + config.activeOffset 
      : config.baseValue
      
    const interpolated = THREE.MathUtils.lerp(
      currentValueRef.current,
      targetValue,
      config.lerpSpeed ?? 0.15
    )

    // Apply the interpolated value to the appropriate property
    switch (config.axis) {
      case 'x':
        object.position.x = interpolated
        break
      case 'y':
        object.position.y = interpolated
        break
      case 'z':
        object.position.z = interpolated
        break
      case 'rotationX':
        object.rotation.x = interpolated
        break
      case 'rotationY':
        object.rotation.y = interpolated
        break
      case 'rotationZ':
        object.rotation.z = interpolated
        break
    }

    currentValueRef.current = interpolated
  })
}

/**
 * Hook for animating multiple properties of an object simultaneously
 * 
 * @param object - The THREE.Object3D to animate
 * @param isActive - Whether the animation should be in the "active" state  
 * @param configs - Array of animation configurations
 * 
 * @example
 * // For a door that rotates and moves forward when opening
 * useAnimatedPositions(doorHinge, isHovered, [
 *   { axis: 'rotationY', baseValue: 0, activeOffset: Math.PI / 2 },
 *   { axis: 'z', baseValue: depth - thickness, activeOffset: thickness }
 * ])
 */
export const useAnimatedPositions = (
  object: THREE.Object3D | null,
  isActive: boolean,
  configs: AnimationConfig[]
): void => {
  configs.forEach(config => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedPosition(object, isActive, config)
  })
}
