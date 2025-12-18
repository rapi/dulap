import { useGLTF } from '@react-three/drei'

/**
 * List of all decoration models used in RackDecorations
 * Keep this in sync with DECORATION_TYPES in RackDecorations.tsx
 */
export const DECORATION_MODEL_URLS = [
  '/assets/3d-models/books-vertical-1.glb',
  '/assets/3d-models/books-vertical-2.glb',
  '/assets/3d-models/books-vertical-3.glb',
  '/assets/3d-models/books-vertical-4.glb',
  '/assets/3d-models/books-horizontal-1.glb',
  '/assets/3d-models/cactus.glb',
  '/assets/3d-models/cactus-2.glb',
] as const

/**
 * Preload all decoration models to avoid loading delays when rendering
 * Call this when entering the configurator or during app initialization
 *
 * @example
 * ```tsx
 * // In your configurator page or app initialization:
 * useEffect(() => {
 *   preloadDecorations()
 * }, [])
 * ```
 */
export const preloadDecorations = () => {
  DECORATION_MODEL_URLS.forEach((url) => {
    useGLTF.preload(url)
  })
}

/**
 * Clear cached decoration models from memory
 * Useful for memory management when leaving the configurator
 */
export const clearDecorationCache = () => {
  DECORATION_MODEL_URLS.forEach((url) => {
    useGLTF.clear(url)
  })
}
