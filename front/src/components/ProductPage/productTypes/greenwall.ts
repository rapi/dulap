import { ProductComponent } from '~/components/ProductPage/GreenWallProductPage'
import { useEffect, useState } from 'react'
export type MainImageParams = {
  imageWidth: number
  imageSections: number
}
export const GreenWallConfiguration: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(210)
  const [selectedColor, setSelectedColor] = useState('#ded9d3')
  const [imageHeight, setImageHeight] = useState(2400)
  const [imageColor, setImageColor] = useState('White')
  const [price, setPrice] = useState(40)
  const [selectedFixationMethod, setSelectedFixationMethod] = useState('wall')
  const [selectedStandOption, setSelectedStandOption] = useState('noStand')
  useEffect(() => {
    if (height <= 245) {
      setImageHeight(2400);
    } else if (height <= 255) {
      setImageHeight(2500);
    } else if (height <= 265) {
      setImageHeight(2600);
    } else if (height <= 275){
      setImageHeight(2700);
    } else if (height <= 285) {
      setImageHeight(2800);
    } else {
      setImageHeight(2900);
    }
  }, [height]);
  useEffect(() => {
    // if (selectedColor === '#ded9d3') {
      setImageColor('White')
    // } else setImageColor('Dark Grey')
  }, [selectedColor])
  useEffect(() => {
    setPrice((width * 4.5 + height * 1.2) * 7)
  }, [width, height])
  return [
    {
      type: 'dimensions',
      widthRange: [800, 1000],
      heightRange: [240, 290],
      width,
      setWidth,
      height,
      setHeight,
    },
    {
      type: 'colors',
      colors: [
        '#ded9d3',
        '#fcfbf5',
        '#d6d6d6',
        '#9c9c9c',
      ],
      selectedColor,
      setSelectedColor,
    },
    {
      type: 'options',
      selectedFixationMethod,
      setSelectedFixationMethod,
      selectedStandOption,
      setSelectedStandOption
    },
    {
      type: 'price',
      price,
    },
    {
      type: 'imageCarousel',
      images: [
        `/greenwall/${imageColor}/${selectedFixationMethod}/${width}/${selectedStandOption}/${imageHeight}.png`,
        `/greenwall/${imageColor}/${selectedFixationMethod}/${width}/${selectedStandOption}/${imageHeight}.png`,
        `/greenwall/${imageColor}/${selectedFixationMethod}/${width}/${selectedStandOption}/${imageHeight}.png`,
      ],
    },
  ]
}
