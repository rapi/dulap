import { ProductComponent } from '~/components/ProductPage/OfficeTableProductPage'
import { useState, useMemo } from 'react'
import { 
  useBaseProductConfigurator, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { OFFICE_TABLE_CONSTRAINTS, OFFICE_TABLE_PRICING } from '../shared/ProductConfigs'

export type MainImageParams = {
  imageWidth: number
  imageSections: number
}

export const OfficeTableConfiguration: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(OFFICE_TABLE_CONSTRAINTS, OFFICE_TABLE_PRICING)
  
  // Office table-specific state
  const [dimension, setDimension] = useState('1400x700')
  const [selectedPCstandOption, setSelectedPCstandOption] = useState('noPC')
  const [selectedPartitionOption, setSelectedPartitionOption] = useState('noPartition')

  // Office table-specific price calculation
  const officeTablePrice = useMemo(() => {
    const [width, depth] = dimension.split('x').map(Number)
    return Math.round(
      (OFFICE_TABLE_PRICING.baseCost +
       width * OFFICE_TABLE_PRICING.widthMultiplier +
       depth * OFFICE_TABLE_PRICING.depthMultiplier) *
       OFFICE_TABLE_PRICING.markup
    )
  }, [dimension])

  return [
    // Office table-specific dimensions component
    {
      type: 'dimensions',
      dimension,
      setDimension,
    },
    
    // Office table colors (different from standard)
    {
      type: 'colors',
      colors: ['#ded9d3', '#fcfbf5', '#d6d6d6', '#9c9c9c'],
      selectedColor: base.selectedColor,
      setSelectedColor: base.setSelectedColor,
    },
    
    // Office table-specific options component
    {
      type: 'options',
      selectedPCstandOption,
      setSelectedPCstandOption,
      selectedPartitionOption,
      setSelectedPartitionOption,
    },
    
    // Use calculated price
    createPriceComponent(officeTablePrice),
    
    // Office table-specific image carousel
    {
      type: 'imageCarousel',
      images: [
        `/office-table/${base.imageColor}/${selectedPCstandOption}/${selectedPartitionOption}/${dimension}.png`,
        `/office-table/${base.imageColor}/${selectedPCstandOption}/${selectedPartitionOption}/${dimension}.png`,
        `/office-table/${base.imageColor}/${selectedPCstandOption}/${selectedPartitionOption}/${dimension}.png`,
      ],
    },
  ]
}
