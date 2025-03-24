import { ProductComponent } from '~/components/ProductPage/ProductPage'
import { useEffect, useState } from 'react'
import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
type WidthMap = {
  maxWidth: number
  minSections: number
  maxSections: number
  activeSections: (width: number) => ImageOptionProps[]
}
const widthMap: WidthMap[] = [
  {
    maxWidth: 60,
    minSections: 1,
    maxSections: 1,
    activeSections: () => [{ src: '/wardrobe/1.png', width: 40 }],
  },
  {
    maxWidth: 100,
    minSections: 1,
    maxSections: 2,
    activeSections: (width) => [
      { src: '/wardrobe/1.png', width: width - 80 },
      { src: '/wardrobe/2.png', width: 80 },
    ],
  },
  {
    maxWidth: 120,
    minSections: 2,
    maxSections: 2,
    activeSections: () => [
      { src: '/wardrobe/1.png', width: 40 },
      { src: '/wardrobe/2.png', width: 80 },
    ],
  },
  {
    maxWidth: 150,
    minSections: 2,
    maxSections: 2,
    activeSections: (width) => [
      { src: '/wardrobe/1.png', width: width - 140 },
      { src: '/wardrobe/2.png', width: 80 },
      { src: '/wardrobe/3.png', width: 80 },
      { src: '/wardrobe/4.png', width: 80 },
    ],
  },
]
export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(40)
  const [price, setPrice] = useState(40)
  const [activeSections, setActiveSections] = useState<ImageOptionProps[]>([])
  const [maxSections, setMaxSections] = useState(5)
  const [minSections, setMinSections] = useState(1)
  useEffect(() => {
    for (const map of widthMap) {
      if (width <= map.maxWidth) {
        console.log(width, map.maxWidth, activeSections)

        setMinSections(map.minSections)
        setMaxSections(map.maxSections)
        setActiveSections(map.activeSections(width))
        break
      }
    }
    //eslint-disable-next-line
  }, [width])
  // useEffect(() => {
  //   console.log('width', width)
  //   setPrice(width)
  //   if (width < 60) {
  //     setMinSections(1)
  //     setMaxSections(1)
  //     setSectionWidths([{ label: '1', values: [width + 'px'] }])
  //   } else {
  //     if (width >= 60 && width < 100) {
  //       setMinSections(1)
  //       setMaxSections(2)
  //       setSectionWidths([
  //         { label: '1', values: [width + 'px'] },
  //         { label: '2', values: [width / 2 + 'px', width / 2 + 'px'] },
  //       ])
  //     } else {
  //       if (width >= 100 && width < 120) {
  //         setMinSections(2)
  //         setMaxSections(2)
  //         setSectionWidths([
  //           { label: '2', values: [width / 2 + 'px', width / 2 + 'px'] },
  //         ])
  //       } else {
  //         if (width >= 120 && width < 160) {
  //           setMinSections(2)
  //           setMaxSections(3)
  //           setSectionWidths([
  //             {
  //               label: '2',
  //               values: [width / 3 + 'px', (width / 3) * 2 + 'px'],
  //             },
  //             {
  //               label: '3',
  //               values: [width / 3 + 'px', width / 3 + 'px', width / 3 + 'px'],
  //             },
  //           ])
  //         } else {
  //           if (width >= 160 && width <= 200) {
  //             setMinSections(2)
  //             setMaxSections(4)
  //             setSectionWidths([
  //               { label: '2', values: [width / 2 + 'px', width / 2 + 'px'] },
  //               {
  //                 label: '3',
  //                 values: [
  //                   width / 2 + 'px',
  //                   width / 4 + 'px',
  //                   width / 4 + 'px',
  //                 ],
  //               },
  //               { label: '4', values: [width / 2 + 'px', width / 2 + 'px'] },
  //             ])
  //           } else {
  //             setMinSections(3)
  //             setMaxSections(5)
  //             setSectionWidths([
  //               {
  //                 label: '3',
  //                 values: [
  //                   (width / 5) * 2 + 'px',
  //                   (width / 5) * 2 + 'px',
  //                   width / 5 + 'px',
  //                 ],
  //               },
  //               {
  //                 label: '4',
  //                 values: [
  //                   width / 4 + 'px',
  //                   width / 4 + 'px',
  //                   width / 4 + 'px',
  //                   width / 4 + 'px',
  //                 ],
  //               },
  //               {
  //                 label: '5',
  //                 values: [
  //                   width / 5 + 'px',
  //                   width / 5 + 'px',
  //                   width / 5 + 'px',
  //                   width / 5 + 'px',
  //                   width / 5 + 'px',
  //                 ],
  //               },
  //             ])
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, [width])
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
      activeSections: activeSections,
      possibleSections: [
        { src: '/wardrobe/1.png' },
        { src: '/wardrobe/2.png' },
        { src: '/wardrobe/3.png' },
        { src: '/wardrobe/4.png' },
      ],
    },
    {
      type: 'price',
      price,
    },
  ]
}
