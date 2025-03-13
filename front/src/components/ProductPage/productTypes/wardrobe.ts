import { ProductComponent } from '~/components/ProductPage/ProductPage'

export const wardrobeProductConfiguration: () => ProductComponent[] = () => {
  return [
    {
      type: 'dimensions',
      widthRange: [60, 120],
      heightRange: [60, 120],
      depthRange: [30, 60],
    },
    {
      type: 'colors',
      colors: ['#eeeeee', '#b5b5b5', '#d7d0c5'],
    },
    {
      type: 'furniture',
    },
    {
      type: 'sections',
      maxNumber: 4,
    },
  ]
}
