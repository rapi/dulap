import { ProductComponent } from '~/components/ProductPage/TVStandProductPage'
import { useState, useEffect, useMemo } from 'react'
import { 
  useBaseProductConfigurator, 
  createDimensionsComponent, 
  createColorsComponent, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { TV_STAND_CONSTRAINTS, TV_STAND_PRICING } from '../shared/ProductConfigs'

export const TVStandProductConfigurator: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(TV_STAND_CONSTRAINTS, TV_STAND_PRICING)
  
  // TV Stand-specific state
  const [selectedSections, setSelectedSections] = useState(2)
  const [activeSections, setActiveSections] = useState(['1', '2', '3', '4'])

  // TV Stand-specific image dimension logic
  useEffect(() => {
    if (base.height < 45) {
      base.setImageHeight(300)
    } else {
      base.setImageHeight(400)
    }
  }, [base.height, base.setImageHeight])

  useEffect(() => {
    if (base.width < 100) {
      base.setImageWidth(800)
    } else if (base.width < 120) {
      base.setImageWidth(1000)
    } else if (base.width < 150) {
      base.setImageWidth(1200)
    } else if (base.width < 190) {
      base.setImageWidth(1600)
    } else {
      base.setImageWidth(2000)
    }
  }, [base.width, base.setImageWidth])

  // TV Stand-specific section logic
  useEffect(() => {
    let possibleSections = ['']
    if (base.width < 120) {
      possibleSections = ['1', '2']
    } else if (base.width < 150) {
      possibleSections = ['1', '2', '3']
    } else if (base.width < 190) {
      possibleSections = ['2']
    } else {
      possibleSections = ['2', '4']
    }
    setActiveSections(possibleSections)
  }, [base.width])

  // TV Stand-specific price calculation
  const tvStandPrice = useMemo(() => {
    let fittingsPrice = 0
    if (base.guides === 'homepage.configurator.fittings.guides.options.2') {
      fittingsPrice = selectedSections * TV_STAND_PRICING.fittingsCost
    }
    return Math.round(
      (TV_STAND_PRICING.baseCost +
        selectedSections * TV_STAND_PRICING.sectionCost +
        base.width * TV_STAND_PRICING.widthMultiplier +
        (base.height - 190) * TV_STAND_PRICING.heightMultiplier +
        (base.depth - 30) * TV_STAND_PRICING.depthMultiplier +
        fittingsPrice) *
        TV_STAND_PRICING.markup
    )
  }, [base.width, base.height, base.depth, selectedSections, base.guides])

  return [
    // Use shared components
    createDimensionsComponent(base),
    createColorsComponent(base),
    
    // TV Stand-specific sections component
    {
      type: 'sections',
      selectedSections,
      setSelectedSections,
      activeSections,
    },
    
    // TV Stand-specific furniture component
    {
      type: 'furniture',
      openingOption: base.openingOption,
      selectedOpeningMethod: base.openingOption,
      hinges: '',
      setOpeningOption: base.setOpeningOption,
      guides: base.guides,
      setGuides: base.setGuides,
    },
    
    // Use calculated price
    createPriceComponent(tvStandPrice),
    
    // TV Stand-specific image carousel
    {
      type: 'imageCarousel',
      images: [
        `/tv-stand/${base.imageColor}/${base.openingOption}/Base ${base.imagePlintHeight}/H${base.imageHeight}/S${selectedSections}/${base.imageWidth}.png`,
        `/tv-stand/render/${base.imageColor} 1.png`,
        `/tv-stand/render/${base.imageColor} 2.png`,
      ],
    },
  ]
}
