import { ProductComponent } from '~/components/ProductPage/StandProductPage'
import { useState, useEffect, useMemo } from 'react'
import { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { getConstraints } from '~/config/furnitureConstraints'
import { useFurnitureConstraints } from '~/hooks/useFurnitureConstraints'

// Get stand constraints
const CONSTRAINTS = getConstraints('stand')

export const DEFAULT_STAND = {
  width: CONSTRAINTS.dimensions.width.default,
  height: CONSTRAINTS.dimensions.height.default,
  depth: CONSTRAINTS.dimensions.depth.default,
  plintHeight: CONSTRAINTS.dimensions.plintHeight.default,
  selectedColor: '#ded9d3', // Biege (the first from the list)
}

export const StandProductConfigurator: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(DEFAULT_STAND.width)
  const [height, setHeight] = useState(DEFAULT_STAND.height)
  const [depth, setDepth] = useState(DEFAULT_STAND.depth)
  const [plintHeight, setPlintHeight] = useState(DEFAULT_STAND.plintHeight)
  const [selectedSections, setSelectedSections] = useState(CONSTRAINTS.sections.default)
  const [selectedColumns, setSelectedColumns] = useState(CONSTRAINTS.columns.default)
  const [columnConfigurations, setColumnConfigurations] = useState<ColumnConfigurationType[]>([
    ColumnConfigurationType.DRAWERS_3
  ])
  const [selectedColor, setSelectedColor] = useState(DEFAULT_STAND.selectedColor)
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
    return maxSections > 0 ? maxSections : 3
  }, [columnConfigurations])

  // Use centralized constraints hook for automatic calculations
  const {
    price,
    availableSections,
    imageHeight,
    imageWidth,
    imagePlintHeight,
  } = useFurnitureConstraints(
    'stand',
    { width, height, depth, plintHeight },
    selectedSections, // Old system uses selectedSections
    guides === 'homepage.configurator.fittings.guides.options.2'
  )

  // Convert available sections to button options (for old system)
  const sectionOptions: ButtonOptionsType[] = useMemo(() => {
    const allOptions = [3, 4, 5]
    return allOptions.map(value => ({
      value: String(value),
      label: value,
      disabled: !availableSections.includes(value),
    }))
  }, [availableSections])

  // Auto-select valid section if current becomes invalid (for old system)
  useEffect(() => {
    if (!availableSections.includes(selectedSections)) {
      setSelectedSections(availableSections[0])
    }
  }, [availableSections, selectedSections])

  // Update column configurations when number of columns changes
  useEffect(() => {
    setColumnConfigurations((prev) => {
      const newConfigs = Array(selectedColumns).fill(ColumnConfigurationType.DRAWERS_3).map((_, i) => prev[i] || ColumnConfigurationType.DRAWERS_3)
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
      options: sectionOptions,
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
        `/stand2/${imageColor}/${openingOption}/Base ${imagePlintHeight}/H${imageHeight}/S${selectedSections}/${imageWidth}.png`,
        `/stand2/render/${imageColor} 1.png`,
        `/stand2/render/${imageColor} 2.png`,
      ],
    },
    {
      type: 'metadata',
      derivedSections, // Provide derivedSections for new 3D system
    },
  ]
}
