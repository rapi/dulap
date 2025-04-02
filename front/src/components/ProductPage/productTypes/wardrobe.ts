import { ProductComponent } from '~/components/ProductPage/ProductPage'
import { useEffect, useState } from 'react'
import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
import {
  openingMap,
  widthMap,
  imageWidthMap,
} from '~/components/ProductPage/productTypes/wardrobeMap'
export type MainImageParams = {
  imageWidth: number
  imageSections: number
}
export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(50)
  const [height, setHeight] = useState(210)
  const [plintHeight, setPlintHeight] = useState(2)
  const [selectedColor, setSelectedColor] = useState('#ded9d3')
  const [imageSide, setImageSide] = useState('right')
  const [imageWidth, setImageWidth] = useState(50)
  const [imageHeight, setImageHeight] = useState(2100)
  const [imageSections, setImageSections] = useState(1)
  const [imagePlintHeight, setImagePlintHeight] = useState(20)
  const [imageColor, setImageColor] = useState('Biege')
  const [selectedMaxSections, setSelectedMaxSections] = useState(1)
  const [selectedMirrorOption, setSelectedMirrorOption] = useState('standard')
  const [selectedOpeningMethod, setSelectedOpeningMethod] = useState('maner')
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
    if (height <= 210) {
      setImageHeight(2100)
    } else setImageHeight(2400)
    }
  , [height])
  useEffect(() => {
    if (selectedColor === '#ded9d3') {
      setImageColor('Biege')
    } else if (selectedColor === '#eeeeee') {
        setImageColor('Biege')
      } else setImageColor('Biege')
    }
  , [selectedColor])
  useEffect(() => {
    setPrice(width)
  }, [width])
  useEffect(() => {
    console.log('selectedMirrorOption', selectedMirrorOption)
    if (selectedMirrorOption === 'standard') {
      setImageSide('right')
    } else setImageSide('left')
  }, [selectedMirrorOption])
  useEffect(() => {
    for (const map of imageWidthMap) {
      if (width <= map.maxWidth) {
        const params = map.imageParams(selectedMaxSections)
        setImageSections(params[0].imageSections)
        setImageWidth(params[0].imageWidth)
        break
      }
    }
  }, [width, selectedMaxSections])
  useEffect(() => {
    console.log('plint height? ', plintHeight)
    if (plintHeight >= 2 && plintHeight < 5) {
      setImagePlintHeight(20)
    } else {
      setImagePlintHeight(60)
    }
  }, [plintHeight])
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
      plintHeight,
      setPlintHeight,
    },
    {
      type: 'colors',
      colors: ['#ded9d3', '#eeeeee', '#b5b5b5'],
      selectedColor,
      setSelectedColor,
    },
    {
      type: 'furniture',
      selectedOpeningMethod,
      setSelectedOpeningMethod,
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
      selectedMirrorOption,
      setSelectedMirrorOption,
    },
    {
      type: 'price',
      price,
    },
    {
      type: 'imageCarousel',
      images: [
        `/wardrobe/${imageColor}/${selectedOpeningMethod}/Base ${imagePlintHeight}/H${imageHeight}/${imageWidth}-${imageSections}-${imageSide}.png`,
      ],
    },
  ]
}
