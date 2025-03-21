import { ProductComponent } from '~/components/ProductPage/ProductPage'
import { useEffect, useState } from 'react'

export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(40)
  const [price, setPrice] = useState(40)
  const [sectionWidths, setSectionWidths] = useState<string[]>([])
  const [maxSections, setMaxSections] = useState(5)
  const [minSections, setMinSections] = useState(1)
  useEffect(() => {
    setPrice(width)
    if (width < 60) {
      setMinSections(1)
      setMaxSections(1)
      setSectionWidths([width + 'px'])
    } else {
      if (width >= 60 && width < 100) {
        setMinSections(1)
        setMaxSections(2)
        setSectionWidths([width + 'px', width + 'px'])
      } else {
        if (width >= 100 && width < 120) {
          setMinSections(2)
          setMaxSections(2)
        } else {
          if (width >= 120 && width < 160) {
            setMinSections(2)
            setMaxSections(3)
          } else {            
              if (width >= 160 && width <= 200) {
                setMinSections(2)
                setMaxSections(4)
              } else { 
                  setMinSections(3)           
                  setMaxSections(5)
                }
            }
          }
        }
      }
    }, [width])
  return [
    {
      type: 'dimensions',
      widthRange: [40, 250],
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
      minNumber: minSections,
      sectionWidths: sectionWidths,
      possibleSections: [
        '/wardrobe/1.png',
        '/wardrobe/2.png',
        '/wardrobe/3.png',
        '/wardrobe/4.png',
      ],
    },
    {
      type: 'price',
      price,
    },
  ]
}
