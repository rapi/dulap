import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'
import { useEffect, useState, useMemo } from 'react'
import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
import {
  openingMap,
  widthMap,
  imageWidthMap,
} from '~/components/ProductPage/productTypes/wardrobeMap'
import { 
  useBaseProductConfigurator, 
  createDimensionsComponent, 
  createColorsComponent, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { WARDROBE_CONSTRAINTS, WARDROBE_PRICING } from '../shared/ProductConfigs'

export type MainImageParams = {
  imageWidth: number
  imageSections: number
}

const SECTION_VALUE: Record<number, number> = {
  1: 150,
  2: 1350,
  3: 2550,
  4: 400,
  5: 2700,
  6: 0,
}

const GUIDES_NR: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 0,
  5: 4,
  6: 0,
} 

export const WardrobeProductConfiguration: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(WARDROBE_CONSTRAINTS, WARDROBE_PRICING)
  
  // Wardrobe-specific state
  const [imageSide, setImageSide] = useState('right')
  const [imageSections, setImageSections] = useState(1)
  const [hinges, setHinges] = useState('standart')
  const [selectedMaxSections, setSelectedMaxSections] = useState(1)
  const [selectedMirrorOption, setSelectedMirrorOption] = useState('standard')
  const [selectedOpeningMethod, setSelectedOpeningMethod] = useState('maner')
  const [activeSections, setActiveSections] = useState<ImageOptionProps[]>([])
  const [activeOpening, setActiveOpening] = useState<ImageOptionProps[]>([])
  const [maxSections, setMaxSections] = useState(5)
  const [minSections, setMinSections] = useState(1)
  const [selectedSections, setSelectedSections] = useState<ImageOptionProps[]>([])
  const [doorsNr, setDoorsNr] = useState(3)

  // Wardrobe-specific effects for sections
  useEffect(() => {
    setSelectedSections(prev => {
      const newLen = activeSections.length
      if (newLen > prev.length) return [...prev, ...activeSections.slice(prev.length)]
      if (newLen < prev.length) return prev.slice(0, newLen)
      return prev
    })
  }, [activeSections])

  useEffect(() => {
    setSelectedSections(prev =>
      prev.map((item, i) => ({
        ...item,
        width: activeSections[i]?.width ?? item.width,
        height: activeSections[i]?.height ?? item.height,
      }))
    )
  }, [activeSections])

  // Wardrobe-specific image width mapping
  useEffect(() => {
    for (const map of imageWidthMap) {
      if (base.width <= map.maxWidth) {
        const [{ imageWidth: w, imageSections: s }] =
          map.imageParams(selectedMaxSections)
        base.setImageWidth(w)
        setImageSections(s)
        break
      }
    }
  }, [base.width, selectedMaxSections, base.setImageWidth])

  // Wardrobe-specific image height logic
  useEffect(() => {
    if (base.height <= 210) {
      base.setImageHeight(2100)
    } else {
      base.setImageHeight(2400)
    }
  }, [base.height, base.setImageHeight])

  // Wardrobe-specific width mapping logic
  useEffect(() => {
    for (const map of widthMap) {
      if (base.width <= map.maxWidth) {
        setMinSections(map.minSections)
        setMaxSections(map.maxSections)
        const newActiveSections = map
          .activeSections(base.width, base.height, selectedMaxSections)
          .map((section) => ({
            src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/${section.src}`,
            width: section.width,
            height: section.height,
          }))
        setActiveSections(newActiveSections)
        break
      }
    }
  }, [base.width, base.height, selectedMaxSections, base.imageColor, base.imageHeight])

  // Wardrobe-specific opening mapping
  useEffect(() => {
    for (const map of openingMap) {
      if (base.width <= map.maxWidth) {
        setActiveOpening(map.activeOpening(base.width, base.height, selectedMaxSections))
        break
      }
    }
  }, [base.width, base.height, selectedMaxSections])

  // Wardrobe-specific doors calculation
  useEffect(() => {
    let newDoors: number

    if (base.width <= 60) {
      newDoors = 1
    } else if (base.width <= 100) {
      newDoors = 2
    } else if (base.width <= 150) {
      newDoors = base.width < 120 ? 2 : 3
    } else if (base.width < 200) {
      newDoors = selectedMaxSections === 2 ? 4 : 3
    } else if (base.width === 200) {
      newDoors = selectedMaxSections === 2 ? 4 : 5
    } else {
      newDoors = selectedMaxSections === 3 ? 5 : 4
    }
    setDoorsNr(newDoors)
  }, [base.width, selectedMaxSections])

  // Wardrobe-specific pricing calculations
  const sectionsPrice = useMemo(() => {
    return selectedSections.reduce((sum, { src }) => {
      const m = src.match(/(\d+)(?=\.\w+$)/)
      return m ? sum + (SECTION_VALUE[Number(m[1])] ?? 0) : sum
    }, 0)
  }, [selectedSections])

  const guidesExtraPrice = useMemo(() => {
    return selectedSections.reduce((sum, { src }) => {
      const match = src.match(/(\d+)\.\w+$/)
      const imageNr = match ? parseInt(match[1], 10) : 0
      const guideCount = GUIDES_NR[imageNr] || 0
      return sum + guideCount * 250
    }, 0)
  }, [selectedSections])

  const wardrobePrice = useMemo(() => {
    const hingesNr = base.height >= 230 ? doorsNr * 6 : doorsNr * 5
    let hingesExtraPrice = 0
    if (hinges === 'homepage.configurator.fittings.hinges.options.2') {
      hingesExtraPrice = hingesNr * 50
    }
    return Math.round(
      (base.width * WARDROBE_PRICING.widthMultiplier + 
       (base.height - 190) * WARDROBE_PRICING.heightMultiplier * doorsNr + 
       sectionsPrice + 
       hingesExtraPrice + 
       guidesExtraPrice + 
       WARDROBE_PRICING.baseCost * doorsNr + 
       WARDROBE_PRICING.baseCost) * WARDROBE_PRICING.markup
    )
  }, [base.width, base.height, doorsNr, sectionsPrice, hinges, guidesExtraPrice])

  // Mirror option effect
  useEffect(() => {
    if (selectedMirrorOption === 'standard') {
      setImageSide('right')
    } else {
      setImageSide('left')
    }
  }, [selectedMirrorOption])

  // Recolor function for sections
  const recolor = (items: ImageOptionProps[]) =>
    items.map(({ src, width, height }) => {
      const suffix = src.substring(src.lastIndexOf('/') + 1)
      return {
        src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/${suffix}`,
        width,
        height,
      }
    })

  const recoloredSelectedSections = useMemo(
    () => recolor(selectedSections),
    [selectedSections, base.imageColor, base.imageHeight]
  )

  return [
    // Use shared components
    createDimensionsComponent(base),
    createColorsComponent(base),
    
    // Wardrobe-specific sections component
    {
      type: 'sections',
      maxNumber: maxSections,
      minNumber: minSections,
      activeOpening: activeOpening,
      possibleSections: [
        { src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/1.png` },
        { src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/2.png` },
        { src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/3.png` },
        { src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/4.png` },
        { src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/5.png` },
        { src: `/wardrobe/filling/${base.imageColor}/${base.imageHeight}/6.png` },
      ],
      selectedSections: recoloredSelectedSections,
      setSelectedSections,
      selectedMaxSections,
      setSelectedMaxSections,
      selectedMirrorOption,
      setSelectedMirrorOption,
    },
    
    // Wardrobe-specific furniture component
    {
      type: 'furniture',
      selectedOpeningMethod,
      setSelectedOpeningMethod,
      hinges,
      setHinges,
      guides: base.guides,
      setGuides: base.setGuides,
    },
    
    // Use calculated price
    createPriceComponent(wardrobePrice),
    
    // Wardrobe-specific image carousel
    {
      type: 'imageCarousel',
      images: [
        `/wardrobe/${base.imageColor}/${selectedOpeningMethod}/Base ${base.imagePlintHeight}/H${base.imageHeight}/${imageSide}/${base.imageWidth}-${imageSections}.png`,
        `/wardrobe/renders/render-wardrobe-1-${base.imageColor}.png`,
        `/wardrobe/renders/render-wardrobe-2-${base.imageColor}.png`,
      ],
    },
  ]
}
