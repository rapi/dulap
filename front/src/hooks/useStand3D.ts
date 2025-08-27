import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/**
 * Determines whether the 3-D stand viewer should be enabled.
 * 
 * Precedence (highest → lowest):
 * 1. ?stand3d=1 or ?stand3d=0 query parameter (QA override)
 * 2. Cookie "stand3d" = "1" / "0" (set by toggle button)
 * 3. Environment flag NEXT_PUBLIC_STAND_3D = "true"
 * Additionally, WebGL support must be available on the client; otherwise the
 * viewer is disabled regardless of the above flags.
 */
export function useStand3D(): boolean {
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

    // 1. Query-param override (use search params from the router as it’s client-side)
    const qp = router.query
    const qpFlag = qp.stand3d ?? qp['3d']
    if (qpFlag === '1') {
      setEnabled(isWebGLAvailable())
      return
    }
    if (qpFlag === '0') {
      setEnabled(false)
      return
    }

    // 2. Cookie override
    const cookieMatch = typeof document !== 'undefined'
      ? document.cookie.match(/(?:^|; )stand3d=(1|0)/)
      : null
    if (cookieMatch) {
      setEnabled(cookieMatch[1] === '1' && isWebGLAvailable())
      return
    }

    // 3. Environment variable
    const envFlag = process.env.NEXT_PUBLIC_STAND_3D === 'true'
    setEnabled(envFlag && isWebGLAvailable())
  }, [router.query])

  return isEnabled
} 