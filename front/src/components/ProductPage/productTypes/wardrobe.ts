import { ProductComponent } from '~/components/ProductPage/ProductPage'
import { useEffect, useState } from 'react'

export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(60)
  const [price, setPrice] = useState(60)
  const [maxSections, setMaxSections] = useState(4)
  useEffect(() => {
    setPrice(width)
    if (width < 100) {
      setMaxSections(2)
    } else {
      setMaxSections(4)
    }
  }, [width])
  return [
    {
      type: 'dimensions',
      widthRange: [60, 120],
      heightRange: [60, 120],
      depthRange: [30, 60],
      width,
      setWidth,
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
      maxNumber: maxSections,
      possibleSections: [
        '/wardeobe/1.svg',
        '/wardeobe/2.svg',
        '/wardeobe/3.svg',
        '/wardeobe/4.svg',
      ],
    },
    {
      type: 'price',
      price,
    },
  ]
}
