import { ProductComponent } from '~/components/ProductPage/BedsideProductPage'
import { useState, useEffect, useMemo } from 'react'
import { 
  useBaseProductConfigurator, 
  createDimensionsComponent, 
  createColorsComponent, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { BEDSIDE_CONSTRAINTS, BEDSIDE_PRICING } from '../shared/ProductConfigs'

export const BedsideProductConfigurator: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(BEDSIDE_CONSTRAINTS, BEDSIDE_PRICING)
  
  // Bedside-specific state
  const [hinges] = useState('standart')

  // Bedside-specific image dimension logic
  useEffect(() => {
    if (base.height < 36) {
      base.setImageHeight(300)
    } else {
      base.setImageHeight(400)
    }
  }, [base.height, base.setImageHeight])

  useEffect(() => {
    if (base.width < 50) {
      base.setImageWidth(500)
    } else if (base.width < 70) {
      base.setImageWidth(600)
    } else {
      base.setImageWidth(800)
    }
  }, [base.width, base.setImageWidth])

  // Bedside-specific price calculation
  const bedsidePrice = useMemo(() => {
    let selectedSections = 1
    if (base.height > 35) {
      selectedSections = 2
    }
    let fittingsPrice = 0
    if (base.guides === 'homepage.configurator.fittings.guides.options.2') {
      fittingsPrice = selectedSections * BEDSIDE_PRICING.fittingsCost
    }
    return Math.round(
      (BEDSIDE_PRICING.baseCost +
        selectedSections * BEDSIDE_PRICING.sectionCost +
        base.width * BEDSIDE_PRICING.widthMultiplier +
        (base.height - 190) * BEDSIDE_PRICING.heightMultiplier +
        (base.depth - 30) * BEDSIDE_PRICING.depthMultiplier +
        fittingsPrice) *
        BEDSIDE_PRICING.markup
    )
  }, [base.width, base.height, base.depth, base.guides])

  return [
    // Use shared components
    createDimensionsComponent(base),
    createColorsComponent(base),
    
    // Bedside-specific furniture component
    {
      type: 'furniture',
      openingOption: base.openingOption,
      selectedOpeningMethod: base.openingOption,
      hinges,
      setOpeningOption: base.setOpeningOption,
      guides: base.guides,
      setGuides: base.setGuides,
    },
    
    // Use calculated price
    createPriceComponent(bedsidePrice),
    
    // Bedside-specific image carousel
    {
      type: 'imageCarousel',
      images: [
        `/bedside/${base.imageColor}/${base.openingOption}/Base ${base.imagePlintHeight}/H${base.imageHeight}/${base.imageWidth}.png`,
        `/bedside/render/${base.imageColor} 1.png`,
        `/bedside/render/${base.imageColor} 2.png`,
      ],
    },
  ]
}
