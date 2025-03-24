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
const defaultSectionSrc = '/wardrobe/3.png'
const widthMap: WidthMap[] = [
  {
    maxWidth: 60,
    minSections: 1,
    maxSections: 1,
    activeSections: (width, height) => [{ src: defaultSectionSrc, width: width, height: height }],
  },
  {
    maxWidth: 100,
    minSections: 1,
    maxSections: 2,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 1) {
        return [
          { src: defaultSectionSrc, width: width, height: height },
        ]
      } else  return [
        { src: defaultSectionSrc, width: width / 2 },
        { src: defaultSectionSrc, width: width / 2 },
      ]
    }
  },
  {
    maxWidth: 119,
    minSections: 2,
    maxSections: 2,
    activeSections: (width, height) => [
      { src: defaultSectionSrc, width: width / 2, height },
      { src: defaultSectionSrc, width: width / 2, height },
    ],
  },
  {
    maxWidth: 159,
    minSections: 2,
    maxSections: 3,
    activeSections: (width, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: defaultSectionSrc, width: width / 3 },
          { src: defaultSectionSrc, width: width / 3 * 2 },
        ]
      } else  return [
        { src: defaultSectionSrc, width: width / 3 },
        { src: defaultSectionSrc, width: width / 3 },
        { src: defaultSectionSrc, width: width / 3 },
      ]
    }
  },
  {
    maxWidth: 200,
    minSections: 2,
    maxSections: 4,
    activeSections: (width, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: defaultSectionSrc, width: width / 2 },
          { src: defaultSectionSrc, width: width / 2 },
        ]
      } else if (selectedMaxSections === 3) {
        return [
          { src: defaultSectionSrc, width: width / 3 },
          { src: defaultSectionSrc, width: width / 3 },
          { src: defaultSectionSrc, width: width / 3 },
        ]
      } else return [
        { src: defaultSectionSrc, width: width / 4 },
        { src: defaultSectionSrc, width: width / 4 },
        { src: defaultSectionSrc, width: width / 4 },
        { src: defaultSectionSrc, width: width / 4 },
      ]
    }
  },
  {
    maxWidth: 250,
    minSections: 3,
    maxSections: 5,
    activeSections: (width, selectedMaxSections) => {
      if (selectedMaxSections === 3) {
        return [
          { src: defaultSectionSrc, width: width / 5 * 2 },
          { src: defaultSectionSrc, width: width / 5 * 2 },
          { src: defaultSectionSrc, width: width / 5 },
        ]
      }  else if (selectedMaxSections === 4) {
        return [
          { src: defaultSectionSrc, width: width / 4 },
          { src: defaultSectionSrc, width: width / 4 },
          { src: defaultSectionSrc, width: width / 4 },
          { src: defaultSectionSrc, width: width / 4 },
        ]
      } else return [
        { src: defaultSectionSrc, width: width / 5 },
        { src: defaultSectionSrc, width: width / 5 },
        { src: defaultSectionSrc, width: width / 5 },
        { src: defaultSectionSrc, width: width / 5 },
        { src: defaultSectionSrc, width: width / 5 },
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
    activeOpening: (width) => [{ src: leftOpening, width: width }],
  },
  {
    maxWidth: 99,
    minSections: 1,
    maxSections: 2,
    activeOpening: (width, selectedMaxSections) => {
      if (selectedMaxSections === 1) {
        return [
          { src: doubleOpening, width: width },
        ]
      } else  return [
        { src: leftOpening, width: width / 2 },
        { src: rightOpening, width: width / 2 },
      ]
    }
  },
  {
    maxWidth: 119,
    minSections: 2,
    maxSections: 2,
    activeOpening: (width) => [
      { src: leftOpening, width: width / 2 },
      { src: rightOpening, width: width / 2 },
    ],
  },
  {
    maxWidth: 159,
    minSections: 2,
    maxSections: 3,
    activeOpening: (width, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: doubleOpening, width: width / 3 * 2 },
          { src: rightOpening, width: width / 3 },
        ]
      } else  return [
        { src: leftOpening, width: width / 3 },
        { src: rightOpening, width: width / 3 },
        { src: rightOpening, width: width / 3 },
      ]
    }
  },
  {
    maxWidth: 200,
    minSections: 2,
    maxSections: 4,
    activeOpening: (width, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: doubleOpening, width: width / 2 },
          { src: doubleOpening, width: width / 2 },
        ]
      } else if (selectedMaxSections === 3) {
        return [
          { src: leftOpening, width: width / 3 },
          { src: rightOpening, width: width / 3 },
          { src: rightOpening, width: width / 3 },
        ]
      } else return [
        { src: leftOpening, width: width / 4 },
        { src: rightOpening, width: width / 4 },
        { src: leftOpening, width: width / 4 },
        { src: rightOpening, width: width / 4 },
      ]
    }
  },
  {
    maxWidth: 250,
    minSections: 3,
    maxSections: 5,
    activeOpening: (width, selectedMaxSections) => {
      if (selectedMaxSections === 3) {
        return [
          { src: doubleOpening, width: width / 5 * 2 },
          { src: doubleOpening, width: width / 5 * 2 },
          { src: rightOpening, width: width / 5 },
        ]
      }  else if (selectedMaxSections === 4) {
        return [
          { src: leftOpening, width: width / 4 },
          { src: rightOpening, width: width / 4 },
          { src: leftOpening, width: width / 4 },
          { src: rightOpening, width: width / 4 },
        ]
      } else return [
        { src: leftOpening, width: width / 5 },
        { src: rightOpening, width: width / 5 },
        { src: leftOpening, width: width / 5 },
        { src: rightOpening, width: width / 5 },
        { src: rightOpening, width: width / 5 },
      ]
    }
  },
]
export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(40)
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
        console.log(width, map.maxWidth, activeSections)

        setMinSections(map.minSections)
        setMaxSections(map.maxSections)
        setActiveSections(map.activeSections(width, height, selectedMaxSections))
        break
      }
    }
    //eslint-disable-next-line
  }, [width, selectedMaxSections])
  useEffect(() => {
    for (const map of openingMap) {
      if (width <= map.maxWidth) {
        setActiveOpening(map.activeOpening(width, height, selectedMaxSections))
        break
      }
    }
    //eslint-disable-next-line
  }, [width, selectedMaxSections])
  useEffect(() => {
    setPrice(width)
  })
  
  return [
    {
      type: 'dimensions',
      widthRange: [40, 250],
      heightRange: [190, 240],
      depthRange: [35, 60],
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
      selectedMaxSections,
      setSelectedMaxSections
    },
    {
      type: 'price',
      price,
    },
  ]
}
