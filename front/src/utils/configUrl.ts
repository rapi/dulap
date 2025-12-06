import { z } from 'zod'
import type { BaseConfig, Constraints } from './configTypes'
import { decodeColumnConfigs, encodeColumnConfigs } from './columnConfigUrl'

/** Products supported in the dynamic route */
export type ProductKey = 'stand' | 'wardrobe' | 'tv-stand' | 'bedside' | 'bookcase'

/** Next.js query bag type */
type NextQuery = Record<string, string | string[] | undefined>

/* ----------------------------- helpers ----------------------------- */

const HEX = /^#[0-9A-Fa-f]{6}$/

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
function snap(v: number, step: number) {
  return Math.round(v / step) * step
}

/* ------------------------------ schemas ---------------------------- */

/** Common schema (its inferred OUTPUT matches Partial<BaseConfig>) */
const commonSchema = z.object({
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  depth: z.coerce.number().int().positive().optional(),
  color: z.string().regex(HEX).optional(),
  columns: z.coerce.number().int().min(1).max(50).optional(), // loose upper bound; normalized later

  /**
   * ?sections= in URL – interpreted as a simple count.
   * It will be mapped to BaseConfig.sectionCount (NOT BaseConfig.sections[]).
   */
  sections: z.coerce.number().int().positive().optional(),
})

/** Stand-specific schema extends common with plintHeight */
const standSchema = commonSchema.extend({
  plintHeight: z.coerce.number().int().min(0).max(200).optional(),
})

type CommonOut = z.infer<typeof commonSchema>
type StandOut = z.infer<typeof standSchema>

/* ---------------------------- public API --------------------------- */

/**
 * Parse raw Next.js query into a config with defaults from constraints.
 * - accepts ?color= and alias ?colors=
 * - lowercases hex color
 * - parses ?colCfg= for column configurations
 * - parses ?openingType= for handle type
 * - parses ?wardrobeCfg=
 * - parses ?sections= into BaseConfig.sectionCount
 */
export function parseQueryToConfig(
  q: NextQuery,
  product: ProductKey,
  C: Constraints
): BaseConfig {
  const schema = product === 'stand' ? standSchema : commonSchema
  const parsed = schema.safeParse(q)
  const d: CommonOut | StandOut = parsed.success ? parsed.data : {}

  // alias for legacy links that use ?colors=
  const aliasColor = (() => {
    const raw = q['colors']
    const val = Array.isArray(raw) ? raw[0] : raw
    return typeof val === 'string' && HEX.test(val) ? val : undefined
  })()

  const cfg: BaseConfig = {
    width: d.width ?? C.dimensions.width.default,
    height: d.height ?? C.dimensions.height.default,
    depth: d.depth ?? C.dimensions.depth.default,
    color: (d.color ?? aliasColor ?? '#baa397').toLowerCase(),
    columns: d.columns ?? C.columns?.default,
  }

  if (product === 'stand') {
    const sd = d as StandOut
    cfg.plintHeight = sd.plintHeight ?? C.dimensions.plintHeight?.default
  }

  // NEW: map ?sections= → BaseConfig.sectionCount
  if (typeof d.sections === 'number') {
    cfg.sectionCount = d.sections
  }

  // Parse column configurations from URL
  const colCfgParam = q['colCfg']
  const colCfgStr = Array.isArray(colCfgParam) ? colCfgParam[0] : colCfgParam
  if (colCfgStr && typeof colCfgStr === 'string') {
    const decoded = decodeColumnConfigs(colCfgStr)
    if (decoded.length > 0) {
      cfg.columnConfigurations = decoded
    }
  }

  // Parse opening type from URL
  const openingTypeParam = q['openingType']
  const openingTypeStr = Array.isArray(openingTypeParam)
    ? openingTypeParam[0]
    : openingTypeParam
  if (openingTypeStr === 'push' || openingTypeStr === 'round' || openingTypeStr === 'profile') {
    cfg.openingType = openingTypeStr
  }
  // Legacy support: 'handle' → 'round'
  else if (openingTypeStr === 'handle') {
    cfg.openingType = 'round'
  }

  // Parse wardrobe column configurations from URL
  const wardrobeCfgParam = q['wardrobeCfg']
  const wardrobeCfgStr = Array.isArray(wardrobeCfgParam)
    ? wardrobeCfgParam[0]
    : wardrobeCfgParam
  if (wardrobeCfgStr && typeof wardrobeCfgStr === 'string') {
    cfg.wardrobeCfg = wardrobeCfgStr
  }

  return cfg
}

/**
 * Snap values to valid ranges/steps using Constraints.
 * (Matches slider behavior from ProductDimensions; clamps columns to constraints.)
 */
export function normalizeConfig(
  cfg: BaseConfig,
  _product: ProductKey,
  C: Constraints
): BaseConfig {
  const wStep = C.steps?.widthStep ?? 1
  const hStep = C.steps?.heightStep ?? 1
  const dStep = C.steps?.depthStep ?? 1
  const pStep = C.steps?.plintHeightStep ?? 1

  const width = clamp(
    snap(cfg.width, wStep),
    C.dimensions.width.min,
    C.dimensions.width.max
  )
  const height = clamp(
    snap(cfg.height, hStep),
    C.dimensions.height.min,
    C.dimensions.height.max
  )
  const depth = clamp(
    snap(cfg.depth, dStep),
    C.dimensions.depth.min,
    C.dimensions.depth.max
  )

  const next: BaseConfig = { ...cfg, width, height, depth }

  if (typeof cfg.plintHeight === 'number' && C.dimensions.plintHeight) {
    next.plintHeight = clamp(
      snap(cfg.plintHeight, pStep),
      C.dimensions.plintHeight.min,
      C.dimensions.plintHeight.max
    )
  }

  if (typeof cfg.columns === 'number') {
    next.columns = clamp(cfg.columns, C.columns.min, C.columns.max)
  }

  // sectionCount has no constraints in Constraints – leave as is

  return next
}

/**
 * Serialize config to a stable query object.
 * (Drops true defaults to keep URLs short.)
 */
export function configToQuery(
  cfg: BaseConfig,
  product: ProductKey,
  C: Constraints
): Record<string, string | number> {
  const out: Record<string, string | number> = {
    width: cfg.width,
    height: cfg.height,
    depth: cfg.depth,
    color: cfg.color,
  }

  if (typeof cfg.columns === 'number') out.columns = cfg.columns
  if (product === 'stand' && typeof cfg.plintHeight === 'number') {
    out.plintHeight = cfg.plintHeight
  }

  // NEW: serialize sectionCount → ?sections=
  if (typeof cfg.sectionCount === 'number') {
    out.sections = cfg.sectionCount
  }

  // Serialize column configurations (for stand)
  if (cfg.columnConfigurations && cfg.columnConfigurations.length > 0) {
    out.colCfg = encodeColumnConfigs(cfg.columnConfigurations)
  }

  // Serialize wardrobe column configurations
  if (cfg.wardrobeCfg && cfg.wardrobeCfg.length > 0) {
    out.wardrobeCfg = cfg.wardrobeCfg
  }

  // Serialize opening type (only if not default 'push')
  if (cfg.openingType && cfg.openingType !== 'push') {
    out.openingType = cfg.openingType
  }

  // Type-safe default comparison
  const isDefault = (
    key: 'width' | 'height' | 'depth' | 'plintHeight' | 'columns' | 'color',
    value: unknown
  ): boolean => {
    switch (key) {
      case 'width':
        return C.dimensions.width.default === value
      case 'height':
        return C.dimensions.height.default === value
      case 'depth':
        return C.dimensions.depth.default === value
      case 'plintHeight':
        return (
          Boolean(C.dimensions.plintHeight) &&
          C.dimensions.plintHeight!.default === value
        )
      case 'columns':
        return !!C.columns && C.columns.default === value
      // color has no default in Constraints — keep it
      case 'color':
      default:
        return false
    }
  }

  const cleaned = Object.fromEntries(
    Object.entries(out).filter(
      ([k, v]) => isDefault(k as Parameters<typeof isDefault>[0], v) === false
    )
  ) as Record<string, string | number>

  return cleaned
}
