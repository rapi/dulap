import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const { gl } = useThree()

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

    // Check if object is actually moving (not at target yet)
    const isAnimating = Math.abs(interpolated - targetValue) > 0.001

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
    
    // Trigger shadow update while animating
    if (isAnimating && gl.shadowMap.enabled && !gl.shadowMap.autoUpdate) {
      gl.shadowMap.needsUpdate = true
    }
  })
}

/**
 * Hook for animating multiple properties of an object simultaneously
 * 
 * This implementation properly follows the Rules of Hooks by managing
 * multiple animations in a single useFrame call instead of calling
 * useAnimatedPosition multiple times in a loop.
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
  // Create refs for all current values
  const currentValuesRef = useRef<number[]>(configs.map(c => c.baseValue))
  const { gl } = useThree()

  useFrame(() => {
    if (!object) return

    let isAnimating = false

    configs.forEach((config, index) => {
      const targetValue = isActive 
        ? config.baseValue + config.activeOffset 
        : config.baseValue
        
      const interpolated = THREE.MathUtils.lerp(
        currentValuesRef.current[index],
        targetValue,
        config.lerpSpeed ?? 0.15
      )

      // Check if any property is animating
      if (Math.abs(interpolated - targetValue) > 0.001) {
        isAnimating = true
      }

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

      currentValuesRef.current[index] = interpolated
    })
    
    // Trigger shadow update while any property is animating
    if (isAnimating && gl.shadowMap.enabled && !gl.shadowMap.autoUpdate) {
      gl.shadowMap.needsUpdate = true
    }
  })
}
