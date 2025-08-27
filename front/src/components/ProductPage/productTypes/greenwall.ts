import { ProductComponent } from '~/components/ProductPage/GreenWallProductPage'
import { useEffect, useState, useMemo } from 'react'
import { 
  useBaseProductConfigurator, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { GREEN_WALL_CONSTRAINTS, GREEN_WALL_PRICING } from '../shared/ProductConfigs'

export type MainImageParams = {
  imageWidth: number
  imageSections: number
}

export const GreenWallConfiguration: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(GREEN_WALL_CONSTRAINTS, GREEN_WALL_PRICING)
  
  // Green wall-specific state
  const [selectedFixationMethod, setSelectedFixationMethod] = useState('wall')
  const [selectedStandOption, setSelectedStandOption] = useState('noStand')

  // Green wall-specific image height logic
  useEffect(() => {
    if (base.height <= 245) {
      base.setImageHeight(2400)
    } else if (base.height <= 255) {
      base.setImageHeight(2500)
    } else if (base.height <= 265) {
      base.setImageHeight(2600)
    } else if (base.height <= 275) {
      base.setImageHeight(2700)
    } else if (base.height <= 285) {
      base.setImageHeight(2800)
    } else {
      base.setImageHeight(2900)
    }
  }, [base.height, base.setImageHeight])

  // Green wall-specific price calculation
  const greenWallPrice = useMemo(() => {
    return Math.round(
      (base.width * GREEN_WALL_PRICING.widthMultiplier + 
       base.height * GREEN_WALL_PRICING.heightMultiplier) * 
       GREEN_WALL_PRICING.markup
    )
  }, [base.width, base.height])

  return [
    // Use shared components with custom ranges
    {
      type: 'dimensions',
      widthRange: [800, 1000],
      heightRange: [240, 290],
      depthRange: [10, 30], // Not used but required
      plintHeightRange: [0, 10], // Not used but required
      width: base.width,
      setWidth: base.setWidth,
      height: base.height,
      setHeight: base.setHeight,
      depth: base.depth,
      setDepth: base.setDepth,
      plintHeight: base.plintHeight,
      setPlintHeight: base.setPlintHeight,
    },
    
    // Green wall colors (different from standard)
    {
      type: 'colors',
      colors: ['#ded9d3', '#fcfbf5', '#d6d6d6', '#9c9c9c'],
      selectedColor: base.selectedColor,
      setSelectedColor: base.setSelectedColor,
    },
    
    // Green wall-specific options component
    {
      type: 'options',
      selectedFixationMethod,
      setSelectedFixationMethod,
      selectedStandOption,
      setSelectedStandOption
    },
    
    // Use calculated price
    createPriceComponent(greenWallPrice),
    
    // Green wall-specific image carousel
    {
      type: 'imageCarousel',
      images: [
        `/greenwall/${base.imageColor}/${selectedFixationMethod}/${base.width}/${selectedStandOption}/${base.imageHeight}.png`,
        `/greenwall/${base.imageColor}/${selectedFixationMethod}/${base.width}/${selectedStandOption}/${base.imageHeight}.png`,
        `/greenwall/${base.imageColor}/${selectedFixationMethod}/${base.width}/${selectedStandOption}/${base.imageHeight}.png`,
      ],
    },
  ]
}
