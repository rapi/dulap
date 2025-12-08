import { z } from "zod";

/**
 * IMPORTANT:
 * Must match ProductKey from utils/configUrl.ts
 */
export const PresetTypeEnum = z.enum([
  "stand",
  "wardrobe",
  "tv-stand",
  "bedside",
]);

export type PresetType = z.infer<typeof PresetTypeEnum>;

export const PresetMetaSchema = z.object({
  // simple string; later you'll use it as FormattedMessage id
  title: z.string(),
  shortDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sortWeight: z.number().int().default(0),
  previewImage: z.string().optional(),
});

/**
 * Minimal details used for listing + URL.
 * All dimensions are in CM.
 */
export const DetailsSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  depth: z.number().int().positive(),
  color: z.string().optional(),
  columns: z.number().int().min(1).max(50).optional(),
  columnConfigurations: z.array(z.unknown()).optional(),
  wardrobeCfg: z.string().optional(),
  openingType: z.enum(["push", "round", "profile", "profile-long"]).optional(),
});

export type Details = z.infer<typeof DetailsSchema>;

export const PresetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  type: PresetTypeEnum,
  schemaVersion: z.number().int(),
  configuratorVersion: z.number().int(),

  meta: PresetMetaSchema,
  details: DetailsSchema,

  // full configurator payload (optional for later)
  config: z.record(z.string(), z.unknown()).default({}),
});

export type Preset = z.infer<typeof PresetSchema>;
