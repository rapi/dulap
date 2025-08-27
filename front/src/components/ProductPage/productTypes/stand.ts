import { ProductComponent } from '~/components/ProductPage/StandProductPage'
import { useState, useEffect, useMemo } from 'react'
import { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import { 
  useBaseProductConfigurator, 
  createDimensionsComponent, 
  createColorsComponent, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { STAND_CONSTRAINTS, STAND_PRICING } from '../shared/ProductConfigs'

export const StandProductConfigurator: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(STAND_CONSTRAINTS, STAND_PRICING)
  
  // Stand-specific state
  const [selectedSections, setSelectedSections] = useState(4)

  // Stand-specific section options logic
  const sectionOptions: ButtonOptionsType[] = useMemo(() => {
    const disable34 = base.height >= 110
    const disable5 = base.height < 110
    return [
      { value: '3', label: 3, disabled: disable34 },
      { value: '4', label: 4, disabled: disable34 },
      { value: '5', label: 5, disabled: disable5 },
    ]
  }, [base.height])

  // Auto-adjust sections when constraints change
  useEffect(() => {
    const nowDisabled = sectionOptions.find(o => o.value === String(selectedSections))?.disabled
    if (nowDisabled) {
      const firstAllowed = sectionOptions.find(o => !o.disabled)
      if (firstAllowed) setSelectedSections(Number(firstAllowed.value))
    }
  }, [sectionOptions, selectedSections])

  // Stand-specific image dimension logic
  useEffect(() => {
    if (base.height < 90) {
      base.setImageHeight(700)
    } else if (base.height < 110) {
      base.setImageHeight(900)
    } else {
      base.setImageHeight(1200)
    }
  }, [base.height, base.setImageHeight])

  useEffect(() => {
    if (base.width < 80) {
      base.setImageWidth(600)
    } else if (base.width < 100) {
      base.setImageWidth(800)
    } else {
      base.setImageWidth(1000)
    }
  }, [base.width, base.setImageWidth])

  // Stand-specific price calculation
  const standPrice = useMemo(() => {
    let fittingsPrice = 0
    if (base.guides === 'homepage.configurator.fittings.guides.options.2') {
      fittingsPrice = selectedSections * STAND_PRICING.fittingsCost
    }
    return Math.round(
      (STAND_PRICING.baseCost +
        selectedSections * STAND_PRICING.sectionCost +
        base.width * STAND_PRICING.widthMultiplier +
        (base.height - 190) * STAND_PRICING.heightMultiplier +
        (base.depth - 30) * STAND_PRICING.depthMultiplier +
        fittingsPrice) *
        STAND_PRICING.markup
    )
  }, [base.width, base.height, base.depth, selectedSections, base.guides])

  return [
    // Use shared components
    createDimensionsComponent(base),
    createColorsComponent(base),
    
    // Stand-specific sections component
    {
      type: 'sections',
      selectedSections,
      setSelectedSections,
      options: sectionOptions,
    },
    
    // Stand-specific furniture component
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
    createPriceComponent(standPrice),
    
    // Stand-specific image carousel
    {
      type: 'imageCarousel',
      images: [
        `/stand/${base.imageColor}/${base.openingOption}/Base ${base.imagePlintHeight}/H${base.imageHeight}/S${selectedSections}/${base.imageWidth}.png`,
        `/stand/render/${base.imageColor} 1.png`,
        `/stand/render/${base.imageColor} 2.png`,
      ],
    },
  ]
}
