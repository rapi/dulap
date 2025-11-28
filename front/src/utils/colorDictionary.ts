// src/utils/colorDictionary.ts
export enum ColorName {
  Biege = 'Biege',
  White = 'White',
  LightGrey = 'Light Grey',
  Grey = 'Grey',
  DarkGrey = 'Dark Grey',
  GreyCubanit = 'Grey Cubanit',
  GreyStone = 'Grey Stone',
  GreenEucalypt = 'Green Eucalypt',
  GreenFjord = 'Green Fjord',
  RoseAntique = 'Rose Antique',
  BiegeAlmond = 'Biege Almond',
  GreenSalvia = 'Green Salvia',
  BeigeCashmere = 'Beige Cashmere',
  BeigeSand = 'Beige Sand',
  NaturalAcacia = 'Natural Acacia',
  NaturalWalnut = 'Natural Walnut',
}

export const colorHexCodes: Record<ColorName, string> = {
  [ColorName.Biege]: '#ded9d3',
  [ColorName.White]: '#fcfbf5',
  [ColorName.LightGrey]: '#d6d6d6',
  [ColorName.Grey]: '#9c9c9c',
  [ColorName.DarkGrey]: '#4b4b4b',
  [ColorName.GreyCubanit]: '#877d73',
  [ColorName.GreyStone]: '#a29587',
  [ColorName.GreenEucalypt]: '#6e786d',
  [ColorName.GreenFjord]: '#8d9c9a',
  [ColorName.RoseAntique]: '#c39d94',
  [ColorName.BiegeAlmond]: '#baa397',
  [ColorName.GreenSalvia]: '#bdbda6',
  [ColorName.BeigeCashmere]: '#d9c9be',
  [ColorName.BeigeSand]: '#e7d5c3',
  [ColorName.NaturalAcacia]: '#d4b896',
  [ColorName.NaturalWalnut]: '#8b6f47',
}

export interface PBRTextures {
  diffuse: string      // Base color/albedo map
  normal: string       // Normal map for surface detail
  roughness: string    // Roughness map
  aoRoughMetal?: string // Combined AO/Roughness/Metalness map (optional)
  displacement?: string // Height/displacement map (optional)
  colorTint?: string   // Color tint multiplied with texture (default: white)
  dimmingFactor?: number // Texture brightness dimming factor (0.0 to 1.0, default: 1.0) - 0.5 = 50% brightness
}

export interface ColorItem {
  hexCode: string
  materialCode: string
  name: string
  textureUrl?: string // Optional texture thumbnail for UI preview
  pbrTextures?: PBRTextures // Optional PBR texture maps for realistic rendering
}

export const colorDictionary: ColorItem[] = [
  { name: ColorName.Biege, hexCode: colorHexCodes[ColorName.Biege], materialCode: 'EGGER U115 ST9' },
  { name: ColorName.White, hexCode: colorHexCodes[ColorName.White], materialCode: 'EGGER W1000 ST9' },
  { name: ColorName.LightGrey, hexCode: colorHexCodes[ColorName.LightGrey], materialCode: 'EGGER U763 ST9' },
  { name: ColorName.Grey, hexCode: colorHexCodes[ColorName.Grey], materialCode: 'EGGER U788 ST9' },
  { name: ColorName.DarkGrey, hexCode: colorHexCodes[ColorName.DarkGrey], materialCode: 'EGGER U963 ST9' },
  { name: ColorName.GreyCubanit, hexCode: colorHexCodes[ColorName.GreyCubanit], materialCode: 'EGGER U767 ST9' },
  { name: ColorName.GreyStone, hexCode: colorHexCodes[ColorName.GreyStone], materialCode: 'EGGER U727 ST9' },
  { name: ColorName.GreenEucalypt, hexCode: colorHexCodes[ColorName.GreenEucalypt], materialCode: 'EGGER U604 ST9' },
  { name: ColorName.GreenFjord, hexCode: colorHexCodes[ColorName.GreenFjord], materialCode: 'EGGER U636 ST9' },
  { name: ColorName.BeigeCashmere, hexCode: colorHexCodes[ColorName.BeigeCashmere], materialCode: 'EGGER U702 ST9' },
  { name: ColorName.BeigeSand, hexCode: colorHexCodes[ColorName.BeigeSand], materialCode: 'EGGER U156 ST9' },
  { name: ColorName.RoseAntique, hexCode: colorHexCodes[ColorName.RoseAntique], materialCode: 'EGGER U325 ST9' },
  { name: ColorName.BiegeAlmond, hexCode: colorHexCodes[ColorName.BiegeAlmond], materialCode: 'EGGER U211 ST9' },
  { name: ColorName.GreenSalvia, hexCode: colorHexCodes[ColorName.GreenSalvia], materialCode: 'EGGER U638 ST9' },
  {
    name: ColorName.NaturalAcacia,
    hexCode: colorHexCodes[ColorName.NaturalAcacia],
    materialCode: 'EGGER H3840 ST10',
    textureUrl: '/assets/thumbnails/natural_acacia.jpg',
    pbrTextures: {
      diffuse: '/assets/textures/wood/diffuse.jpg',
      normal: '/assets/textures/wood/normal.jpg',
      roughness: '/assets/textures/wood/rough.jpg',
      aoRoughMetal: '/assets/textures/wood/ao_rough_metal.jpg',
      displacement: '/assets/textures/wood/displacement.jpg',
      colorTint: '#ffffff', // White - shows natural texture color
      dimmingFactor: 1, // Reduces texture brightness to 50% (0.3 = very dim, 0.7 = slightly dim, 1.0 = full brightness)
    },
  },
  {
    name: ColorName.NaturalWalnut,
    hexCode: colorHexCodes[ColorName.NaturalWalnut],
    materialCode: 'EGGER H3734 ST10',
    textureUrl: '/assets/thumbnails/natural_walnut.jpg',
    pbrTextures: {
      // Use same textures as Natural Acacia
      diffuse: '/assets/textures/wood/diffuse.jpg',
      normal: '/assets/textures/wood/normal.jpg',
      roughness: '/assets/textures/wood/rough.jpg',
      aoRoughMetal: '/assets/textures/wood/ao_rough_metal.jpg',
      displacement: '/assets/textures/wood/displacement.jpg',
      colorTint: '#8C837A', // Brown tint for walnut appearance
      dimmingFactor: 1, // Reduces texture brightness to 50% (0.3 = very dim, 0.7 = slightly dim, 1.0 = full brightness)
    },
  },
]

export function getColorItemByName(name: string): ColorItem | undefined {
  return colorDictionary.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  )
}

export function getColorItemByHex(hexCode: string): ColorItem | undefined {
  return colorDictionary.find(
    (c) => c.hexCode.toLowerCase() === hexCode.toLowerCase()
  )
}

export function getColorItem(nameOrHex: string): ColorItem | undefined {
  // Try to find by name first
  let colorItem = getColorItemByName(nameOrHex)
  
  // If not found and looks like a hex code, try hex lookup
  if (!colorItem && nameOrHex.startsWith('#')) {
    colorItem = getColorItemByHex(nameOrHex)
  }
  
  return colorItem
}
