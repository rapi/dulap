import type { BaseConfig } from "~/utils/configTypes";
import {
  configToQuery,
  normalizeConfig,
  type ProductKey,
} from "~/utils/configUrl";
import { getConstraints } from "~/config/furnitureConstraints";
import type { ColumnConfigurationWithOptions } from "~/types/furniture3D";
import type { Preset, Details } from "./preset.schema";

/**
 * Anything that has `type` + `details` (full Preset or PresetIndexItem) is OK.
 */
type MinimalPreset = Pick<Preset, "type" | "details">;

export function buildPresetHref(preset: MinimalPreset) {
  const product = preset.type as ProductKey;
  const C = getConstraints(product);

  const defaults: BaseConfig = {
    width: C.dimensions.width.default,
    height: C.dimensions.height.default,
    depth: C.dimensions.depth.default,
    color: "#fcfbf5",
    columns: C.columns?.default,
    plintHeight: C.dimensions.plintHeight?.default,
  };

  const d: Details = preset.details;

  const cfg: BaseConfig = {
    ...defaults,
    width: d.width ?? defaults.width,
    height: d.height ?? defaults.height,
    depth: d.depth ?? defaults.depth,
    color: d.color ?? defaults.color,
    columns: d.columns ?? defaults.columns,
    plintHeight: defaults.plintHeight,
  };

  if (d.wardrobeCfg) {
    cfg.wardrobeCfg = d.wardrobeCfg;
  }

  if (d.openingType) {
    cfg.openingType = d.openingType;
  }

  if (d.columnConfigurations) {
    cfg.columnConfigurations = d.columnConfigurations as ColumnConfigurationWithOptions[];
  }

  const normalized = normalizeConfig(cfg, product, C);
  const baseQuery = configToQuery(normalized, product, C);

  return {
    pathname: `/configurator/${product}`,
    query: {
      ...baseQuery,
      // optional feature flag, if you want 3D by default
      // use3Dversion: "1",
    },
  } as const;
}
