import { useThree } from '@react-three/fiber'
import { useCallback } from 'react'

/**
 * Hook to trigger shadow map updates
 * Call this from any component that animates objects with shadows
 * 
 * @example
 * const triggerShadowUpdate = useShadowUpdate()
 * 
 * // Call whenever you need shadows to update
 * useEffect(() => {
 *   triggerShadowUpdate()
 * }, [isOpen])
 */
export const useShadowUpdate = () => {
  const { gl } = useThree()
  
  const triggerShadowUpdate = useCallback(() => {
    if (gl.shadowMap.enabled && !gl.shadowMap.autoUpdate) {
      gl.shadowMap.needsUpdate = true
    }
  }, [gl])
  
  return triggerShadowUpdate
}

