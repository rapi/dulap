import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
import { MainImageParams } from './wardrobe'
const editSrc = '/wardrobe/0-edit.png'
const defaultSectionSrc = '/wardrobe/1.png'
type WidthMap = {
  maxWidth: number
  minSections: number
  maxSections: number
  activeSections: (
    width: number,
    height: number,
    selectedMaxSections: number
  ) => ImageOptionProps[]
}
type OpeningMap = {
  maxWidth: number
  minSections: number
  maxSections: number
  activeOpening: (
    width: number,
    height: number,
    selectedMaxSections: number
  ) => ImageOptionProps[]
}
type ImageWidthMap = {
  maxWidth: number
  imageParams: (
    selectedMaxSections: number
  ) => MainImageParams[]
}

const leftOpening = '/wardrobe/opening-left.png'
const rightOpening = '/wardrobe/opening-right.png'
const doubleOpening = '/wardrobe/opening-double.png'

export const openingMap: OpeningMap[] = [
  {
    maxWidth: 60,
    minSections: 1,
    maxSections: 1,
    activeOpening: (width, height) => [
      { src: leftOpening, width: width, height: height + 14 },
    ],
  },
  {
    maxWidth: 100,
    minSections: 1,
    maxSections: 2,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 1) {
        return [{ src: doubleOpening, width: width, height: height + 14 }]
      } else
        return [
          { src: leftOpening, width: width / 2, height: height + 14 },
          { src: rightOpening, width: width / 2, height: height + 14 },
        ]
    },
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
          { src: doubleOpening, width: (width / 3) * 2, height: height + 14 },
          { src: rightOpening, width: width / 3, height: height + 14 },
        ]
      } else
        return [
          { src: leftOpening, width: width / 3, height: height + 14 },
          { src: rightOpening, width: width / 3, height: height + 14 },
          { src: rightOpening, width: width / 3, height: height + 14 },
        ]
    },
  },
  {
    maxWidth: 190,
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
      } else
        return [
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
        ]
    },
  },
  {
    maxWidth: 200,
    minSections: 2,
    maxSections: 5,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: doubleOpening, width: width / 2, height: height + 14 },
          { src: doubleOpening, width: width / 2, height: height + 14 },
        ]
      } else if (selectedMaxSections === 3) {
        return [
          { src: doubleOpening, width: (width / 5) * 2, height: height + 14 },
          { src: doubleOpening, width: (width / 5) * 2, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
        ]
      } else if (selectedMaxSections === 4) {
        return [
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
        ]
      } else
        return [
          { src: doubleOpening, width: (width / 5) * 2, height: height + 14 },
          { src: doubleOpening, width: (width / 5) * 2, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
        ]
    },
  },
  {
    maxWidth: 250,
    minSections: 3,
    maxSections: 5,
    activeOpening: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 3) {
        return [
          { src: doubleOpening, width: (width / 5) * 2, height: height + 14 },
          { src: doubleOpening, width: (width / 5) * 2, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
        ]
      } else if (selectedMaxSections === 4) {
        return [
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
          { src: leftOpening, width: width / 4, height: height + 14 },
          { src: rightOpening, width: width / 4, height: height + 14 },
        ]
      } else
        return [
          { src: leftOpening, width: width / 5, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
          { src: leftOpening, width: width / 5, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
          { src: rightOpening, width: width / 5, height: height + 14 },
        ]
    },
  },
]

export const widthMap: WidthMap[] = [
  {
    maxWidth: 60,
    minSections: 1,
    maxSections: 1,
    activeSections: (width, height) => [
      { src: editSrc, width: width, height: height },
    ],
  },
  {
    maxWidth: 100,
    minSections: 1,
    maxSections: 2,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 1) {
        return [{ src: editSrc, width: width, height: height }]
      } else
        return [
          { src: editSrc, width: width / 2, height: height },
          { src: defaultSectionSrc, width: width / 2, height: height },
        ]
    },
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
          { src: editSrc, width: (width / 3) * 2, height: height },
          { src: defaultSectionSrc, width: width / 3, height: height },
        ]
      } else
        return [
          { src: editSrc, width: width / 3, height: height },
          { src: defaultSectionSrc, width: width / 3, height: height },
          { src: defaultSectionSrc, width: width / 3, height: height },
        ]
    },
  },
  {
    maxWidth: 190,
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
    },
  },
  {
    maxWidth: 200,
    minSections: 2,
    maxSections: 5,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 2) {
        return [
          { src: editSrc, width: width / 2, height: height },
          { src: defaultSectionSrc, width: width / 2, height: height },
        ]
      } else if (selectedMaxSections === 3) {
        return [
          { src: editSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
        ]
      } else if (selectedMaxSections === 4) {
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
    },
  },
  {
    maxWidth: 250,
    minSections: 3,
    maxSections: 5,
    activeSections: (width, height, selectedMaxSections) => {
      if (selectedMaxSections === 3) {
        return [
          { src: editSrc, width: (width / 5) * 2, height: height },
          { src: defaultSectionSrc, width: (width / 5) * 2, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
        ]
      } else if (selectedMaxSections === 4) {
        return [
          { src: editSrc, width: width / 4, height: height },
          { src: defaultSectionSrc, width: width / 4, height: height },
          { src: defaultSectionSrc, width: width / 4, height: height },
          { src: defaultSectionSrc, width: width / 4, height: height },
        ]
      } else
        return [
          { src: editSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
          { src: defaultSectionSrc, width: width / 5, height: height },
        ]
    },
  }
]

export const imageWidthMap: ImageWidthMap[] = [
  {
    maxWidth: 40,
    imageParams: () => [{ imageWidth: 400, imageSections: 1}]
  }, 
  {
    maxWidth: 60,
    imageParams: () => [{ imageWidth: 500, imageSections: 1}]

  },
  {
    maxWidth: 90,
    imageParams: () => [{ imageWidth: 800, imageSections: 2}]
  },
  {
    maxWidth: 110,
    imageParams: () => [{ imageWidth: 1000, imageSections: 2}]
  },
  {
    maxWidth: 130,
    imageParams: () => [{ imageWidth: 1200, imageSections: 3}]
  },
  {
    maxWidth: 150,
    imageParams: () => [{ imageWidth: 1500, imageSections: 3}]
  },
  {
    maxWidth: 180,
    imageParams: (selectedMaxSections) => {
      if (selectedMaxSections === 2 || selectedMaxSections === 4) {
        return [{ imageWidth: 1600, imageSections: 4}]
      } else return [{ imageWidth: 1600, imageSections: 3}]
    },
  },

  {
    maxWidth: 200,
    imageParams: (selectedMaxSections) => {
      if (selectedMaxSections === 2 || selectedMaxSections === 4) {
        return [{ imageWidth: 2000, imageSections: 4}]
      } else if (selectedMaxSections === 5) {
        return [{ imageWidth: 2000, imageSections: 5}]
      } else return [{ imageWidth: 1600, imageSections: 3}]
    },
  },
  {
    maxWidth: 240,
    imageParams: (selectedMaxSections) => {
      if (selectedMaxSections === 3 || selectedMaxSections === 5) {
        return [{ imageWidth: 2000, imageSections: 5}]
      } else return [{ imageWidth: 2000, imageSections: 4}]
    },
  },
  {
    maxWidth: 250,
    imageParams: (selectedMaxSections) => {
      if (selectedMaxSections === 3 || selectedMaxSections === 5) {
        return [{ imageWidth: 2500, imageSections: 5}]
      } else return [{ imageWidth: 2500, imageSections: 4}]
    },
  },
]
