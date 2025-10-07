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
}

export interface ColorItem {
  hexCode: string
  materialCode: string
  name: ColorName
}

export const colorDictionary: ColorItem[] = [
  { name: ColorName.Biege,         hexCode: '#ded9d3', materialCode: 'EGGER U115 ST9' },
  { name: ColorName.White,         hexCode: '#fcfbf5', materialCode: 'EGGER W1000 ST9' },
  { name: ColorName.LightGrey,    hexCode: '#d6d6d6', materialCode: 'EGGER U763 ST9' },
  { name: ColorName.Grey,          hexCode: '#9c9c9c', materialCode: 'EGGER U788 ST9' },
  { name: ColorName.DarkGrey,     hexCode: '#4b4b4b', materialCode: 'EGGER U963 ST9' },
  { name: ColorName.GreyCubanit,  hexCode: '#877d73', materialCode: 'EGGER U767 ST9' },
  { name: ColorName.GreyStone,    hexCode: '#a29587', materialCode: 'EGGER U727 ST9' },
  { name: ColorName.GreenEucalypt,hexCode: '#6e786d', materialCode: 'EGGER U604 ST9' },
  { name: ColorName.GreenFjord,   hexCode: '#8d9c9a', materialCode: 'EGGER U636 ST9' },
  { name: ColorName.RoseAntique,  hexCode: '#c39d94', materialCode: 'EGGER U325 ST9' },
  { name: ColorName.BiegeAlmond,  hexCode: '#baa397', materialCode: 'EGGER U211 ST9' },
  { name: ColorName.GreenSalvia,  hexCode: '#bdbda6', materialCode: 'EGGER U638 ST9' },
]

export function getColorItemByName(name: string): ColorItem | undefined {
  return colorDictionary.find(c => c.name.toLowerCase() === name.toLowerCase())
}
