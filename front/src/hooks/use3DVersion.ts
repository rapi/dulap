import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const QUERY_PARAM_KEY_3D_ENABLED = 'use3DVersion';

/**
 * Global cache for WebGL availability check.
 * Checked once and reused across all components to prevent creating multiple WebGL contexts.
 */
let webGLAvailabilityCache: boolean | null = null

/**
 * Test WebGL capability in the current browser.
 * Creates a temporary canvas and WebGL context, then properly cleans them up.
 * Result is cached globally to avoid creating multiple contexts.
 */
function isWebGLAvailable(): boolean {
  // Return cached result if already checked
  if (webGLAvailabilityCache !== null) {
    return webGLAvailabilityCache
  }

  if (typeof window === 'undefined') {
    webGLAvailabilityCache = false
    return false
  }

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    const isAvailable = !!(window.WebGLRenderingContext && gl)
    
    // Properly dispose of the WebGL context to prevent memory leaks
    if (gl && (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext)) {
      const loseContextExt = gl.getExtension('WEBGL_lose_context')
      if (loseContextExt) {
        loseContextExt.loseContext()
      }
    }
    
    // Clean up the canvas
    canvas.width = 0
    canvas.height = 0
    
    // Cache the result
    webGLAvailabilityCache = isAvailable
    return isAvailable
  } catch {
    webGLAvailabilityCache = false
    return false
  }
}

/**
 * Determines whether the 3D viewer should be enabled.
 */
export function use3DVersion(): boolean {
  const router = useRouter()
  const [isEnabled, setEnabled] = useState<boolean>(false)
  
  // Extract the specific query parameter for dependency tracking
  const use3DFlag = router.query[QUERY_PARAM_KEY_3D_ENABLED]

  useEffect(() => {
    // Only react to changes in the specific use3DVersion parameter
    if (use3DFlag === 'true') {
      setEnabled(isWebGLAvailable())
    } else {
      setEnabled(false)
    }
  }, [use3DFlag]) // Only watch the specific parameter, not entire router.query
  
  return isEnabled
} 