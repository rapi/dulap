import { ProductComponent } from '~/components/ProductPage/TVStandProductPage'
import { useState, useEffect, useMemo } from 'react'

export const TVStandProductConfigurator: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(160)
  const [height, setHeight] = useState(45)
  const [depth, setDepth] = useState(40)
  const [plintHeight, setPlintHeight] = useState(2)
  const [selectedSections, setSelectedSections] = useState(2)
  const [activeSections, setActiveSections] = useState(['1', '2', '3', '4'])
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
      (300 +
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
    if (height < 45) {
      setImageHeight(300)
    } else setImageHeight(400)
  }, [height])

  useEffect(() => {
    setSelectedSections(selectedSections)
  }, [selectedSections])

  useEffect(() => {
    if (width < 100) {
      setImageWidth(800)
    } else if (width < 120) {
      setImageWidth(1000)
    } else if (width < 150) {
      setImageWidth(1200)
    } else if (width < 190) {
      setImageWidth(1600)
    } else setImageWidth(2000)
  }, [width])

  useEffect(() => {
    let possibleSections = ['']
    if (width < 120) {
      possibleSections = ['1', '2']
    } else if (width < 150) {
      possibleSections = ['1', '2', '3']
    } else if (width < 190) {
      possibleSections = ['2']
    } else possibleSections = ['2', '4']
    setActiveSections(possibleSections)
    console.log('possibleSections ', possibleSections)
  }, [width])

  useEffect(() => {
    setHeight(height)
  }, [height])
  useEffect(() => {
    setWidth(width)
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
      widthRange: [80, 240],
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
      type: 'sections',
      selectedSections,
      setSelectedSections,
      activeSections,
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
        `/tv-stand/${imageColor}/${openingOption}/Base ${imagePlintHeight}/H${imageHeight}/${imageWidth}-${selectedSections}.png`,
        `/tv-stand/render/${imageColor} 1.png`,
        `/tv-stand/render/${imageColor} 2.png`,
      ],
    },
  ]
}
