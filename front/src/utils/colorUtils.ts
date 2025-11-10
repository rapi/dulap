/**
 * Maps color name to image color name for product images
 */
export function mapColorToImageColor(color: string): string {
  const colorMap: Record<string, string> = {
    Biege: 'Biege',
    White: 'White',
    'Light Grey': 'Light Grey',
    Grey: 'Grey',
  }
  return colorMap[color] || 'White'
}

