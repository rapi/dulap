import { ProductComponent } from '~/components/ProductPage/ProductPage'

export const storageProductConfiguration: () => ProductComponent[] = () => {
  return [
    {
      type: 'imageSelect',
      options: [
        { value: '1x1', imageURL: '/storage/1x1.svg' },
        { value: '2x1', imageURL: '/storage/2x1.svg' },
        { value: '3x1', imageURL: '/storage/3x1.svg' },
        { value: '1x2', imageURL: '/storage/1x2.svg' },
        { value: '2x2', imageURL: '/storage/2x2.svg' },
        { value: '3x2', imageURL: '/storage/3x2.svg' },
        { value: '1x3', imageURL: '/storage/1x3.svg' },
        { value: '2x3', imageURL: '/storage/2x3.svg' },
        { value: '3x3', imageURL: '/storage/3x3.svg' },
      ],
    },
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
      type: 'select',
      options: ['Standard (cu bile)', 'Premium', 'Deluxe'],
      title: 'Furnitura',
      subTitle: 'Glisiere pentru sertare:',
    },
  ]
}
