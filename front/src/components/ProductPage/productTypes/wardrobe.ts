import { ProductComponent } from '~/components/ProductPage/ProductPage'
import { useEffect, useState } from 'react'
import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
type WidthMap = {
  maxWidth: number
  minSections: number
  maxSections: number
  activeSections: (width: number, height: number, selectedMaxSections: number) => ImageOptionProps[]
}
type OpeningMap = {
  maxWidth: number
  minSections: number
  maxSections: number
  activeOpening: (width: number, height: number, selectedMaxSections: number) => ImageOptionProps[]
}
const defaultSectionSrc = '/wardrobe/1.png'
const editSrc = '/wardrobe/0-edit.png'
const widthMap: WidthMap[] = [
  {
    maxWidth: 60,
    minSections: 1,
    maxSections: 1,
    activeSections: (width, height) => [{ src: editSrc, width: width, height: height }],
  },
  {
    maxWidth: 100,
    minSections: 1,
    maxSections: 2,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 1) {
        return [
          { src: editSrc, width: width, height: height },
        ]
      } else  return [
        { src: editSrc, width: width / 2, height: height },
        { src: defaultSectionSrc, width: width / 2, height: height },
      ]
    }
  },
  {
    maxWidth: 119,
    minSections: 2,
    maxSections: 2,
    activeSections: (width, height) => [
      { src: editSrc, width: width / 2, height: height },
      { src: defaultSectionSrc, width: width / 2, height: height },
    ],
  },
  {
    maxWidth: 159,
    minSections: 2,
    maxSections: 3,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: editSrc, width: width / 3 * 2, height: height },
          { src: defaultSectionSrc, width: width / 3, height: height },
        ]
      } else  return [
        { src: editSrc, width: width / 3, height: height },
        { src: defaultSectionSrc, width: width / 3, height: height },
        { src: defaultSectionSrc, width: width / 3, height: height },
      ]
    }
  },
  {
    maxWidth: 200,
    minSections: 2,
    maxSections: 4,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: editSrc, width: width / 2, height: height },
          { src: defaultSectionSrc, width: width / 2, height: height },
        ]
      } else if (selectedMaxSections === 3) {
        return [
          { src: editSrc, width: width / 3, height: height },
          { src: defaultSectionSrc, width: width / 3, height: height },
          { src: defaultSectionSrc, width: width / 3, height: height },
        ]
      } else return [
        { src: editSrc, width: width / 4, height: height },
        { src: defaultSectionSrc, width: width / 4, height: height },
        { src: defaultSectionSrc, width: width / 4, height: height },
        { src: defaultSectionSrc, width: width / 4, height: height },
      ]
    }
  },
  {
    maxWidth: 250,
    minSections: 3,
    maxSections: 5,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 3) {
        return [
          { src: editSrc, width: width / 5 * 2, height: height },
          { src: defaultSectionSrc, width: width / 5 * 2, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
        ]
      }  else if (selectedMaxSections === 4) {
        return [
          { src: editSrc, width: width / 4, height: height },
          { src: defaultSectionSrc, width: width / 4, height: height },
          { src: defaultSectionSrc, width: width / 4, height: height },
          { src: defaultSectionSrc, width: width / 4, height: height },
        ]
      } else return [
        { src: editSrc, width: width / 5, height: height },
        { src: defaultSectionSrc, width: width / 5, height: height },
        { src: defaultSectionSrc, width: width / 5, height: height },
        { src: defaultSectionSrc, width: width / 5, height: height },
        { src: defaultSectionSrc, width: width / 5, height: height },
      ]
    }
  },
]

const leftOpening = '/wardrobe/opening-left.png'
const rightOpening = '/wardrobe/opening-right.png'
const doubleOpening = '/wardrobe/opening-double.png'

const openingMap: OpeningMap[] = [
  {
    maxWidth: 60,
    minSections: 1,
    maxSections: 1,
    activeOpening: (width, height) => [{ src: leftOpening, width: width, height: height + 14 }],
  },
  {
    maxWidth: 100,
    minSections: 1,
    maxSections: 2,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 1) {
        return [
          { src: doubleOpening, width: width, height: height + 14 },
        ]
      } else  return [
        { src: leftOpening, width: width / 2, height: height + 14 },
        { src: rightOpening, width: width / 2, height: height + 14 },
      ]
    }
  },
  {
    maxWidth: 119,
    minSections: 2,
    maxSections: 2,
    activeOpening: (width, height) => [
      { src: leftOpening, width: width / 2, height: height + 14 },
      { src: rightOpening, width: width / 2, height: height + 14 },
    ],
  },
  {
    maxWidth: 159,
    minSections: 2,
    maxSections: 3,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: doubleOpening, width: width / 3 * 2, height: height + 14 },
          { src: rightOpening, width: width / 3, height: height + 14 },
        ]
      } else  return [
        { src: leftOpening, width: width / 3, height: height + 14 },
        { src: rightOpening, width: width / 3, height: height + 14 },
        { src: rightOpening, width: width / 3, height: height + 14 },
      ]
    }
  },
  {
    maxWidth: 200,
    minSections: 2,
    maxSections: 4,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: doubleOpening, width: width / 2, height: height + 14 },
          { src: doubleOpening, width: width / 2, height: height + 14 },
        ]
      } else if (selectedMaxSections === 3) {
        return [
          { src: leftOpening, width: width / 3, height: height + 14 },
          { src: rightOpening, width: width / 3, height: height + 14 },
          { src: rightOpening, width: width / 3, height: height + 14 },
        ]
      } else return [
        { src: leftOpening, width: width / 4, height: height + 14 },
        { src: rightOpening, width: width / 4, height: height + 14 },
        { src: leftOpening, width: width / 4, height: height + 14 },
        { src: rightOpening, width: width / 4, height: height + 14 },
      ]
    }
  },
  {
    maxWidth: 250,
    minSections: 3,
    maxSections: 5,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 3) {
        return [
          { src: doubleOpening, width: width / 5 * 2, height: height + 14 },
          { src: doubleOpening, width: width / 5 * 2, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
        ]
      }  else if (selectedMaxSections === 4) {
        return [
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
        ]
      } else return [
        { src: leftOpening, width: width / 5, height: height + 14 },
        { src: rightOpening, width: width / 5, height: height + 14 },
        { src: leftOpening, width: width / 5, height: height + 14 },
        { src: rightOpening, width: width / 5, height: height + 14 },
        { src: rightOpening, width: width / 5, height: height + 14 },
      ]
    }
  },
]
export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(50)
  const [height, setHeight] = useState(210)
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
        setActiveSections(map.activeSections(width, height, selectedMaxSections))
        break
      }
    }
    //eslint-disable-next-line
  }, [width, height, selectedMaxSections])
  useEffect(() => {
    for (const map of openingMap) {
      if (width <= map.maxWidth) {
        setActiveOpening(map.activeOpening(width, height, selectedMaxSections))
        break
      }
    }
    //eslint-disable-next-line
  }, [width, height, selectedMaxSections])
  useEffect(() => {
    setPrice(width)
  })
  
  return [
    {
      type: 'dimensions',
      widthRange: [50, 250],
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
      setSelectedMaxSections
    },
    {
      type: 'price',
      price,
    },
  ]
}
