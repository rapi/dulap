// utils/configTypes.ts
import { getConstraints } from '~/config/furnitureConstraints'

/**
 * Mirror the real constraints shape so casts are not needed.
 * This makes Constraints exactly whatever getConstraints(product) returns,
 * while also telling TS that "steps" may exist with these fields.
 */
type RawConstraints = ReturnType<typeof getConstraints>

export type Constraints = RawConstraints & {
  steps?: {
    widthStep?: number
    heightStep?: number
    depthStep?: number
    plintHeightStep?: number
  }
}

/** URL-driven config we share between products */
export interface BaseConfig {
  width: number
  height: number
  depth: number
  color: string
  columns?: number
  sections?: number[]
  plintHeight?: number // only for stand
}
