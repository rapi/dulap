import { ProductComponent } from '~/components/ProductPage/BedsideProductPage'
import { useState, useEffect, useMemo } from 'react'

export const BedsideProductConfigurator: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(60)
  const [height, setHeight] = useState(40)
  const [depth, setDepth] = useState(40)
  const [plintHeight, setPlintHeight] = useState(2)
  const [selectedColor, setSelectedColor] = useState('#fcfbf5')
  const [guides, setGuides] = useState(
    'homepage.configurator.fittings.guides.options.1'
  )

  const [openingOption, setOpeningOption] = useState('push')
  const [imageColor, setImageColor] = useState('White')
  const [hinges] = useState('standart')

  const [imageWidth, setImageWidth] = useState(600)
  const [imageHeight, setImageHeight] = useState(300)
  const [imagePlintHeight, setImagePlintHeight] = useState(20)

  const price = useMemo(() => {
    let selectedSections = 1
    if (height > 35) {
      selectedSections = 2
    }
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
  }, [width, height, depth, guides])

  useEffect(() => {
    if (plintHeight >= 2 && plintHeight < 5) {
      setImagePlintHeight(20)
    } else {
      setImagePlintHeight(60)
    }
  }, [plintHeight])

  useEffect(() => {
    if (height < 36) {
      setImageHeight(300)
    } else setImageHeight(400)
  }, [height])

  useEffect(() => {
    if (width < 50) {
      setImageWidth(500)
    } else if (width < 70) {
      setImageWidth(600)
    } else setImageWidth(800)
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
      widthRange: [40, 80],
      heightRange: [30, 60],
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
      type: 'furniture',
      openingOption,
      hinges,
      setOpeningOption,
      selectedOpeningMethod: openingOption,
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
        `/bedside/${imageColor}/${openingOption}/Base ${imagePlintHeight}/H${imageHeight}/${imageWidth}.png`,
        `/bedside/renders/${imageColor} 1.png`,
        `/bedside/renders/${imageColor} 2.png`,
      ],
    },
  ]
}
