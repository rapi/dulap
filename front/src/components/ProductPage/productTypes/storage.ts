import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'

export const StorageProductConfiguration: () => ProductComponent[] = () => {
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
      plintHeightRange: [60, 120],
      width: 0,
      setWidth: () => {},
      height: 0,
      setHeight: () => {},
      depth: 0,
      setDepth: () => {},
      plintHeight: 0,
      setPlintHeight: () => {},
    },
    {
      type: 'colors',
      colors: ['#eeeeee', '#b5b5b5', '#d7d0c5'],
      selectedColor: '0',
      setSelectedColor: () => {},
    },
    {
      type: 'select',
      options: ['Standard (cu bile)', 'Premium', 'Deluxe'],
      title: 'Furnitura',
      subTitle: 'Glisiere pentru sertare:',
    },
    {
      type: 'furniture',
      selectedOpeningMethod: 'maner',
      setSelectedOpeningMethod: () => {},
      hinges: '',
      setHinges: () => {},
      guides: '',
      setGuides: () => {},
    },
    {
      type: 'price',
      price: 0,
    },
  ]
}
