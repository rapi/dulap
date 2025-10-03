import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const QUERY_PARAM_KEY_3D_ENABLED = 'use3DVersion';

/**
 * Determines whether the 3D viewer should be enabled.
 */
export function use3DVersion(): boolean {
  const router = useRouter()
  const [isEnabled, setEnabled] = useState<boolean>(false)

  useEffect(() => {
    // Helper to test WebGL capability in the current browser
    function isWebGLAvailable(): boolean {
      if (typeof window === 'undefined') return false

      try {
        const canvas = document.createElement('canvas')
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        )
      } catch {
        return false
      }
    }

    const queryFlag = router.query[QUERY_PARAM_KEY_3D_ENABLED]

    if (queryFlag === 'true') {
      setEnabled(isWebGLAvailable())
    } else {
      setEnabled(false)
    }

    return
  }, [router.query])
  return isEnabled
} 