// src/utils/colorDictionary.ts
export interface ColorItem {
  hexCode: string
  materialCode: string
  name: string
}

export const colorDictionary: ColorItem[] = [
  { name: 'Biege', hexCode: '#f1e0d2', materialCode: 'EGGER U115 ST9' },
  { name: 'White', hexCode: '#fcfbf5', materialCode: 'EGGER W1000 ST9' },
  { name: 'Light Grey', hexCode: '#d6d6d6', materialCode: 'EGGER U763 ST9' },
  { name: 'Grey', hexCode: '#9c9c9c', materialCode: 'EGGER U788 ST9' },
  { name: 'Dark Grey', hexCode: '#4b4b4b', materialCode: 'EGGER U963 ST9' },
  { name: 'Grey Cubanit', hexCode: '#877d73', materialCode: 'EGGER U767 ST9' },
  { name: 'Grey Stone', hexCode: '#a29587', materialCode: 'EGGER U727 ST9' },
  {
    name: 'Beige Cashmere',
    hexCode: '#d9c9be',
    materialCode: 'EGGER U702 ST9',
  },
  { name: 'Beige Sand', hexCode: '#e7d5c3', materialCode: 'EGGER U156 ST9' },
  { name: 'Rose Antique', hexCode: '#c39d94', materialCode: 'EGGER U325 ST9' },
  { name: 'Biege Almond', hexCode: '#baa397', materialCode: 'EGGER U211 ST9' },
  { name: 'Green Salvia', hexCode: '#bdbda6', materialCode: 'EGGER U638 ST9' },
]

export function getColorItemByName(name: string): ColorItem | undefined {
  return colorDictionary.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  )
}
