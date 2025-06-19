import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'
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
  const [width, setWidth] = useState(160)
  const [height, setHeight] = useState(210)
  const [depth, setDepth] = useState(50)
  const [plintHeight, setPlintHeight] = useState(5)
  const [selectedColor, setSelectedColor] = useState('#ded9d3')
  const [imageSide, setImageSide] = useState('right')
  const [imageWidth, setImageWidth] = useState(50)
  const [imageHeight, setImageHeight] = useState(2100)
  const [imageSections, setImageSections] = useState(1)
  const [imagePlintHeight, setImagePlintHeight] = useState(20)
  const [imageColor, setImageColor] = useState('Biege')
  const [hinges, setHinges] = useState('standart')
  const [guides, setGuides] = useState('standart')
  const [selectedMaxSections, setSelectedMaxSections] = useState(1)
  const [selectedMirrorOption, setSelectedMirrorOption] = useState('standard')
  const [selectedOpeningMethod, setSelectedOpeningMethod] = useState('maner')
  const [price, setPrice] = useState(40)
  const [activeSections, setActiveSections] = useState<ImageOptionProps[]>([])
  const [activeOpening, setActiveOpening] = useState<ImageOptionProps[]>([])
  const [maxSections, setMaxSections] = useState(5)
  const [minSections, setMinSections] = useState(1)

  const [doorsNr, setDoorsNr] = useState(3)
  useEffect(() => {
    if (height <= 210) {
      setImageHeight(2100)
    } else setImageHeight(2400)
    }
  , [height])
  useEffect(() => {
    setDepth(depth)
  }, [depth])
  useEffect(() => {
    setHinges(hinges)
  }, [hinges])
  useEffect(() => {
    setGuides(guides)
  }, [guides])
  useEffect(() => {
    if (selectedColor === '#ded9d3') {
      setImageColor('Biege')
    } else if (selectedColor === '#fcfbf5') {
        setImageColor('White')
      } else if (selectedColor === '#d6d6d6') {
        setImageColor('Light Grey')
      } else if (selectedColor === '#9c9c9c') {
        setImageColor('Grey')
      } else setImageColor('Dark Grey')
    }
  , [selectedColor])
  useEffect(() => {
    let newDoors: number

    if (width <= 60) {
      newDoors = 1
    } else if (width <= 100) {
      newDoors = 2
    } else if (width <= 150) {
      newDoors = width < 120 ? 2 : 3
    } else if (width < 200) {
      newDoors = selectedMaxSections === 2 ? 4 : 3
    } else if (width === 200) {
      newDoors = selectedMaxSections === 2 ? 4 : 5
    } else {
      newDoors = selectedMaxSections === 3 ? 5 : 4
    }

    console.log('doors →', newDoors)
    setDoorsNr(newDoors)
  }, [width, selectedMaxSections])
  useEffect(() => {
    if (selectedMaxSections === 1) {
      if (width <= 60) { setDoorsNr(1) }
    }
    setPrice(width*29+(height-190)*4.5*doorsNr)
  }, [width, height, selectedMaxSections, doorsNr])
  useEffect(() => {
    if (selectedMirrorOption === 'standard') {
      setImageSide('right')
    } else setImageSide('left')
  }, [selectedMirrorOption])

  useEffect(() => {
    for (const map of widthMap) {
      if (width <= map.maxWidth) {
        setMinSections(map.minSections)
        setMaxSections(map.maxSections)
        const newActiveSections = map.activeSections(width, height, selectedMaxSections).map(section => ({
          src: `/wardrobe/filling/${imageColor}/${imageHeight}/${section.src}`,
          width: section.width,
          height: section.height
        }));
        setActiveSections(newActiveSections)    
        break
      }
    }
  }, [width, height, selectedMaxSections, imageColor, imageHeight])
  
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
    for (const map of openingMap) {
      if (width <= map.maxWidth) {
        setActiveOpening(map.activeOpening(width, height, selectedMaxSections))
        break
      }
    }
  }, [width, height, selectedMaxSections])
  useEffect(() => {
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
      depth,
      setDepth,
    },
    {
      type: 'colors',
      colors: [
        '#ded9d3', 
        '#fcfbf5', 
        '#d6d6d6', 
        '#9c9c9c', 
        // '#7a7a7a'
      ],
      selectedColor,
      setSelectedColor,
    },
    {
      type: 'sections',
      maxNumber: maxSections,
      minNumber: minSections,
      activeSections: activeSections,
      activeOpening: activeOpening,
      possibleSections: [
        { src: `/wardrobe/filling/${imageColor}/${imageHeight}/1.png` },
        { src: `/wardrobe/filling/${imageColor}/${imageHeight}/2.png` },
        { src: `/wardrobe/filling/${imageColor}/${imageHeight}/3.png` },
        { src: `/wardrobe/filling/${imageColor}/${imageHeight}/4.png` },
        { src: `/wardrobe/filling/${imageColor}/${imageHeight}/5.png` },
        { src: `/wardrobe/filling/${imageColor}/${imageHeight}/6.png` },
      ],
      selectedSections: [],
      selectedMaxSections,
      setSelectedMaxSections,
      selectedMirrorOption,
      setSelectedMirrorOption,
    },
    {
      type: 'furniture',
      selectedOpeningMethod,
      setSelectedOpeningMethod,
      hinges,
      setHinges,
      guides,
      setGuides,
    },
    {
      type: 'price',
      price,
    },
    {
      type: 'imageCarousel',
      images: [
        `/wardrobe/${imageColor}/${selectedOpeningMethod}/Base ${imagePlintHeight}/H${imageHeight}/${imageSide}/${imageWidth}-${imageSections}.png`,
        `/wardrobe/${imageColor}/${selectedOpeningMethod}/Base ${imagePlintHeight}/H${imageHeight}/${imageSide}/${imageWidth}-${imageSections}.png`,
        `/wardrobe/${imageColor}/${selectedOpeningMethod}/Base ${imagePlintHeight}/H${imageHeight}/${imageSide}/${imageWidth}-${imageSections}.png`,
      ],
    },
  ]
}
