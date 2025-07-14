// src/utils/colorDictionary.ts
export interface ColorItem {
  hexCode: string
  materialCode: string
  name: string
}

export const colorDictionary: ColorItem[] = [
  { name: 'Biege',         hexCode: '#ded9d3', materialCode: 'EGGER U115 ST9' },
  { name: 'White',         hexCode: '#fcfbf5', materialCode: 'EGGER W1000 ST9' },
  { name: 'Light Grey',    hexCode: '#d6d6d6', materialCode: 'EGGER U763 ST9' },
  { name: 'Grey',          hexCode: '#9c9c9c', materialCode: 'EGGER U788 ST9' },
  { name: 'Dark Grey',     hexCode: '#4b4b4b', materialCode: 'EGGER U963 ST9' },
  { name: 'Grey Cubanit',  hexCode: '#877d73', materialCode: 'EGGER U767 ST9' },
  { name: 'Grey Stone',    hexCode: '#a29587', materialCode: 'EGGER U727 ST9' },
  { name: 'Green Eucalypt',hexCode: '#6e786d', materialCode: 'EGGER U604 ST9' },
  { name: 'Green Fjord',   hexCode: '#8d9c9a', materialCode: 'EGGER U636 ST9' },
  { name: 'Rose Antique',  hexCode: '#c39d94', materialCode: 'EGGER U325 ST9' },
  { name: 'Biege Almond',  hexCode: '#baa397', materialCode: 'EGGER U211 ST9' },
  { name: 'Green Salvia',  hexCode: '#bdbda6', materialCode: 'EGGER U638 ST9' },
]

export function getColorItemByName(name: string): ColorItem | undefined {
  return colorDictionary.find(c => c.name.toLowerCase() === name.toLowerCase())
}
