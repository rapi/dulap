import { ProductComponent } from '~/components/ProductPage/OfficeTableProductPage'
import { useEffect, useState } from 'react'
export type MainImageParams = {
  imageWidth: number
  imageSections: number
}
export const OfficeTableConfiguration: () => ProductComponent[] = () => {
  const [selectedColor, setSelectedColor] = useState('#ded9d3')
  const [dimension, setDimension] = useState('1400x700')
  const [imageColor, setImageColor] = useState('White')
  const [price, setPrice] = useState(1586)
  const [selectedPCstandOption, setSelectedPCstandOption] = useState('noPC')
  const [selectedPartitionOption, setSelectedPartitionOption] = useState('noPartition')
  useEffect(() => {
    // if (selectedColor === '#ded9d3') {
      setImageColor('White')
    // } else setImageColor('Dark Grey')
  }, [selectedColor])
  useEffect(() => {
    setPrice(5646)
  }, [dimension])
  return [
    {
      type: 'dimensions',
      dimension,
      setDimension
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
      selectedPCstandOption,
      setSelectedPCstandOption,
      selectedPartitionOption,
      setSelectedPartitionOption
    },
    {
      type: 'price',
      price,
    },
    {
      type: 'imageCarousel',
      images: [
        `/office-table/${imageColor}/${selectedPCstandOption}/${selectedPartitionOption}/${dimension}.png`,
        `/office-table/${imageColor}/${selectedPCstandOption}/${selectedPartitionOption}/${dimension}.png`,
        `/office-table/${imageColor}/${selectedPCstandOption}/${selectedPartitionOption}/${dimension}.png`,
      ],
    },
  ]
}
