import { ProductComponent } from '~/components/ProductPage/StandProductPage'
import { useState, useEffect, useMemo } from 'react'

export const StandProductConfigurator: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(80)
  const [height, setHeight] = useState(70)
  const [depth, setDepth] = useState(40)
  const [plintHeight, setPlintHeight] = useState(2)
  const [selectedSections, setSelectedSections] = useState(4)
  const [selectedColor, setSelectedColor] = useState('#fcfbf5')
  const [guides, setGuides] = useState(
    'homepage.configurator.fittings.guides.options.1'
  )

  const [openingOption, setOpeningOption] = useState('push')
  const [imageColor, setImageColor] = useState('White')
  const [imageWidth, setImageWidth] = useState(1000)
  const [imageHeight, setImageHeight] = useState(900)
  const [imagePlintHeight, setImagePlintHeight] = useState(20)

  const price = useMemo(() => {
    let fittingsPrice = 0
    if (guides === 'homepage.configurator.fittings.guides.options.2') {
      fittingsPrice = selectedSections * 350
    }
    return Math.round(
      (600 +
        selectedSections * 600 +
        width * 20 +
        (height - 190) * 4.5 +
        (depth - 30) * 8 +
        fittingsPrice) *
        1.3
    )
  }, [width, height, depth, selectedSections, guides])

  useEffect(() => {
    if (plintHeight >= 2 && plintHeight < 5) {
      setImagePlintHeight(20)
    } else {
      setImagePlintHeight(60)
    }
  }, [plintHeight])

  useEffect(() => {
    if (height < 90) {
      setImageHeight(700)
    } else setImageHeight(900)
  }, [height])

  useEffect(() => {
    setSelectedSections(selectedSections)
  }, [selectedSections])

  useEffect(() => {
    if (width < 80) {
      setImageWidth(600)
    } else if (width < 100) {
      setImageWidth(800)
    } else setImageWidth(1000)
  }, [width])

  useEffect(() => {
    setDepth(depth)
  }, [depth])

  useEffect(() => {
    setGuides(guides)
  }, [guides])

  useEffect(() => {
    if (selectedColor === '#ded9d3') {
      setImageColor('Biege')
    } else if (selectedColor === '#fcfbf5') {
      setImageColor('White')
    } else if (selectedColor === '#d6d6d6') {
      setImageColor('Light Grey')
    } else if (selectedColor === '#9c9c9c') {
      setImageColor('Grey')
    } else setImageColor('Dark Grey')
  }, [selectedColor])

  return [
    {
      type: 'dimensions',
      widthRange: [50, 120],
      heightRange: [70, 110],
      depthRange: [30, 50],
      plintHeightRange: [2, 10],
      width,
      setWidth,
      height,
      setHeight,
      depth,
      setDepth,
      plintHeight,
      setPlintHeight,
    },
    {
      type: 'colors',
      colors: ['#ded9d3', '#fcfbf5', '#d6d6d6', '#9c9c9c'],
      selectedColor,
      setSelectedColor,
    },
    {
      type: 'sections',
      selectedSections,
      setSelectedSections,
    },
    {
      type: 'furniture',
      openingOption,
      selectedOpeningMethod: openingOption,
      hinges: '',
      setOpeningOption,
      guides,
      setGuides,
    },
    {
      type: 'price',
      price,
    },
    {
      type: 'imageCarousel',
      images: [
        `/stand/${imageColor}/${openingOption}/Base ${imagePlintHeight}/H${imageHeight}/S${selectedSections}/${imageWidth}.png`,
        `/stand/renders/${imageColor} 1.png`,
        `/stand/renders/${imageColor} 2.png`,
      ],
    },
  ]
}
