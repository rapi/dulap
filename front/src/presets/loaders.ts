import { PresetSchema, type Preset } from "./preset.schema";

type JsonModule = { default: unknown };

const loaders: Record<string, () => Promise<JsonModule>> = {
  "WR-101": () => import("./items/wardrobe/WR-101.json"),  
  "WR-102": () => import("./items/wardrobe/WR-102.json"),
  "WR-103": () => import("./items/wardrobe/WR-103.json"),
  "WR-104": () => import("./items/wardrobe/WR-104.json"),
  "ST-301": () => import("./items/stand/ST-201.json"),
  "ST-302": () => import("./items/stand/ST-202.json"),
  "BS-201": () => import("./items/bedside/BS-401.json"),
  "BS-202": () => import("./items/bedside/BS-402.json"),
  "TV-401": () => import("./items/tv-stand/TV-301.json"),
  "TV-402": () => import("./items/tv-stand/TV-302.json")
};

export async function loadPresetById(id: string): Promise<Preset> {
  const loader = loaders[id];
  if (!loader) {
    throw new Error(`Preset not found: ${id}`);
  }

  const raw = await loader();
  return PresetSchema.parse(raw.default);
}
