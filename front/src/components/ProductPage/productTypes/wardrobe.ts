import { ProductComponent } from '~/components/ProductPage/ProductPage'
import { useEffect, useState } from 'react'
import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
import {
  openingMap,
  widthMap,
} from '~/components/ProductPage/productTypes/wardrobeMap'
// import { ProductSections } from '../productTypeComponents/ProductSections'

const imageWidths = [400, 500, 800, 1000, 1200, 1500, 1600, 2000, 2500]
export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(50)
  const [height, setHeight] = useState(210)
  const [imageSide, setImageSide] = useState('right')
  const [imageWidth, setImageWidth] = useState(50)
  const [selectedMaxSections, setSelectedMaxSections] = useState(1)
  const [price, setPrice] = useState(40)
  const [activeSections, setActiveSections] = useState<ImageOptionProps[]>([])
  const [activeOpening, setActiveOpening] = useState<ImageOptionProps[]>([])
  const [maxSections, setMaxSections] = useState(5)
  const [minSections, setMinSections] = useState(1)
  useEffect(() => {
    for (const map of widthMap) {
      if (width <= map.maxWidth) {
        setMinSections(map.minSections)
        setMaxSections(map.maxSections)
        setActiveSections(
          map.activeSections(width, height, selectedMaxSections)
        )
        break
      }
    }
  }, [width, height, selectedMaxSections])
  useEffect(() => {
    for (const map of openingMap) {
      if (width <= map.maxWidth) {
        setActiveOpening(map.activeOpening(width, height, selectedMaxSections))
        break
      }
    }
  }, [width, height, selectedMaxSections])
  useEffect(() => {
    const newImageWidth = imageWidths.find((w) => w >= width * 10) || 50
    setImageWidth(newImageWidth)
    if (selectedMaxSections % 2 === 0) {
      setImageSide('center')
    } else {
      setImageSide('right')
    }
    // if (mirrorOption === 'standard') {
    //   setImageSide('right')
    // } else {
    //   setImageSide('left')
    // }
    setPrice(width)
  }, [width, selectedMaxSections])
  return [
    {
      type: 'dimensions',
      widthRange: [40, 250],
      heightRange: [190, 240],
      depthRange: [35, 60],
      plintHeightRange: [2, 8],
      width,
      setWidth,
      height,
      setHeight,
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
      activeSections: activeSections,
      activeOpening: activeOpening,
      possibleSections: [
        { src: '/wardrobe/1.png' },
        { src: '/wardrobe/2.png' },
        { src: '/wardrobe/3.png' },
        { src: '/wardrobe/4.png' },
      ],
      selectedSections: [],
      selectedMaxSections,
      setSelectedMaxSections,
    },
    {
      type: 'price',
      price,
    },
    {
      type: 'imageCarousel',
      images: [
        `/wardrobe/Biege/Handle/Base 20/H2100/${imageWidth}-${selectedMaxSections}-${imageSide}.png`,
      ],
    },
  ]
}
