import { ProductComponent } from '~/components/ProductPage/TVStandProductPage'
import { useState, useEffect, useMemo } from 'react'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { getConstraints } from '~/config/furnitureConstraints'
import { useFurnitureConstraints } from '~/hooks/useFurnitureConstraints'

// Get TV stand constraints
const CONSTRAINTS = getConstraints('tv-stand')

export const DEFAULT_TV_STAND = {
  width: CONSTRAINTS.dimensions.width.default,
  height: CONSTRAINTS.dimensions.height.default,
  depth: CONSTRAINTS.dimensions.depth.default,
  plintHeight: CONSTRAINTS.dimensions.plintHeight.default,
  selectedColor: '#fcfbf5', // White
  columns: CONSTRAINTS.columns.default,
  sections: CONSTRAINTS.sections.default,
}

export const TVStandProductConfigurator: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(DEFAULT_TV_STAND.width)
  const [height, setHeight] = useState(DEFAULT_TV_STAND.height)
  const [depth, setDepth] = useState(DEFAULT_TV_STAND.depth)
  const [plintHeight, setPlintHeight] = useState(DEFAULT_TV_STAND.plintHeight)
  const [selectedSections, setSelectedSections] = useState(DEFAULT_TV_STAND.sections)
  const [selectedColumns, setSelectedColumns] = useState(DEFAULT_TV_STAND.columns)
  const [columnConfigurations, setColumnConfigurations] = useState<ColumnConfigurationType[]>([
    ColumnConfigurationType.DRAWERS_2,
    ColumnConfigurationType.DRAWERS_2
  ])
  const [selectedColor, setSelectedColor] = useState(DEFAULT_TV_STAND.selectedColor)
  const [guides, setGuides] = useState(
    'homepage.configurator.fittings.guides.options.1'
  )
  const [openingOption, setOpeningOption] = useState<OpeningType>(OpeningType.Push)
  const [imageColor, setImageColor] = useState('White')

  // Derive sections from column configurations (for new 3D system)
  const derivedSections = useMemo(() => {
    const maxSections = Math.max(...columnConfigurations.map(config => {
      const metadata = getConfigurationMetadata(config)
      return metadata.drawerCount > 0 ? metadata.drawerCount : metadata.shelfCount
    }))
    return maxSections > 0 ? maxSections : 2
  }, [columnConfigurations])

  // Use centralized constraints hook for automatic calculations
  const {
    price,
    availableSections,
    imageHeight,
    imageWidth,
    imagePlintHeight,
  } = useFurnitureConstraints(
    'tv-stand',
    { width, height, depth, plintHeight },
    selectedSections, // Old system uses selectedSections
    guides === 'homepage.configurator.fittings.guides.options.2'
  )

  // Convert available sections to active sections (for old system)
  const activeSections = useMemo(() => availableSections.map(String), [availableSections])

  // Update column configurations when number of columns changes
  useEffect(() => {
    setColumnConfigurations((prev) => {
      const newConfigs = Array(selectedColumns).fill(ColumnConfigurationType.DRAWERS_2).map((_, i) => prev[i] || ColumnConfigurationType.DRAWERS_2)
      return newConfigs as ColumnConfigurationType[]
    })
  }, [selectedColumns])

  // Calculate individual column dimensions for constraint evaluation
  const columnWidth = useMemo(() => width / selectedColumns, [width, selectedColumns])
  const columnHeight = useMemo(() => height - plintHeight, [height, plintHeight])
  const columnDepth = depth

  // Map color names for image paths
  useEffect(() => {
    if (selectedColor === 'Biege') {
      setImageColor('Biege')
    } else if (selectedColor === 'White') {
      setImageColor('White')
    } else if (selectedColor === 'Light Grey') {
      setImageColor('Light Grey')
    } else if (selectedColor === 'Grey') {
      setImageColor('Grey')
    } else setImageColor('White')
  }, [selectedColor])

  return [
    {
      type: 'dimensions',
      widthRange: [CONSTRAINTS.dimensions.width.min, CONSTRAINTS.dimensions.width.max],
      heightRange: [CONSTRAINTS.dimensions.height.min, CONSTRAINTS.dimensions.height.max],
      depthRange: [CONSTRAINTS.dimensions.depth.min, CONSTRAINTS.dimensions.depth.max],
      plintHeightRange: [CONSTRAINTS.dimensions.plintHeight.min, CONSTRAINTS.dimensions.plintHeight.max],
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
      colors: CONSTRAINTS.colors,
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
      type: 'columns',
      selectedColumns,
      setSelectedColumns,
    },
    {
      type: 'individualColumns',
      selectedColumns,
      columnConfigurations,
      setColumnConfigurations,
      columnWidth,
      columnHeight,
      columnDepth,
    },
    {
      type: 'furniture',
      openingOption: openingOption as string | OpeningType,
      selectedOpeningMethod: openingOption as string | OpeningType,
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
    {
      type: 'metadata',
      derivedSections, // Provide derivedSections for new 3D system
    },
  ]
}
