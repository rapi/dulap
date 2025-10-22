import { ProductComponent } from '~/components/ProductPage/TVStandProductPage'
import { useState, useEffect, useMemo } from 'react'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { ColumnConfigurationType, getConfigurationMetadata } from '~/types/columnConfigurationTypes'
import { getConstraints } from '~/config/furnitureConstraints'
import { useFurnitureConstraints } from '~/hooks/useFurnitureConstraints'
import { getValidColumnCounts, getFirstValidColumnCount } from '~/utils/columnValidation'
import { findNearestAvailableConfiguration } from '~/utils/columnConfigurationFallback'
import { isConfigurationValid } from '~/config/columnConstraints'

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

  // Update column configurations ONLY when number of columns changes
  useEffect(() => {
    setColumnConfigurations((prev) => {
      const dimensions = { 
        width: width / selectedColumns, 
        height: height - plintHeight, 
        depth: depth 
      }
      
      // Create new configurations array, preserving existing ones
      const newConfigs = Array(selectedColumns).fill(null).map((_, i) => {
        // Always try to preserve existing configuration first
        if (prev[i]) {
          // Check if it's still valid with new dimensions
          if (isConfigurationValid(prev[i], dimensions)) {
            return prev[i]
          }
          // If not valid, find nearest alternative
          const nearestConfig = findNearestAvailableConfiguration(prev[i], dimensions)
          return nearestConfig || prev[i]
        }
        
        // For new columns (when expanding), use default
        const defaultConfig = ColumnConfigurationType.DRAWERS_2
        const nearestConfig = findNearestAvailableConfiguration(defaultConfig, dimensions)
        return nearestConfig || defaultConfig
      })
      
      return newConfigs as ColumnConfigurationType[]
    })
  }, [selectedColumns]) // Only trigger when column count changes!
  
  // Validate existing configurations when dimensions change
  useEffect(() => {
    const dimensions = { 
      width: width / selectedColumns, 
      height: height - plintHeight, 
      depth: depth 
    }
    
    setColumnConfigurations((prev) => {
      // Check if any configuration needs updating
      const needsUpdate = prev.some(config => !isConfigurationValid(config, dimensions))
      
      if (!needsUpdate) {
        return prev // No changes needed
      }
      
      // Update only invalid configurations
      return prev.map(config => {
        if (isConfigurationValid(config, dimensions)) {
          return config // Keep valid ones
        }
        // Replace invalid with nearest available
        const nearestConfig = findNearestAvailableConfiguration(config, dimensions)
        return nearestConfig || config
      })
    })
  }, [width, height, depth, plintHeight, selectedColumns]) // Trigger on dimension changes

  // Calculate individual column dimensions for constraint evaluation
  const columnWidth = useMemo(() => width / selectedColumns, [width, selectedColumns])
  const columnHeight = useMemo(() => height - plintHeight, [height, plintHeight])
  const columnDepth = depth

  // Check which column counts are valid based on dimensions
  const validColumnCounts = useMemo(
    () => getValidColumnCounts(width, height, depth, plintHeight),
    [width, height, depth, plintHeight]
  )

  // Create column options with disabled states
  const columnOptions = useMemo(() => [
    { value: '1', label: 1, disabled: !validColumnCounts[1] },
    { value: '2', label: 2, disabled: !validColumnCounts[2] },
    { value: '3', label: 3, disabled: !validColumnCounts[3] },
    { value: '4', label: 4, disabled: !validColumnCounts[4] },
  ], [validColumnCounts])

  // Auto-select valid column count when current becomes invalid
  useEffect(() => {
    if (!validColumnCounts[selectedColumns]) {
      // Try to keep a count close to the current selection
      const preferences = [
        selectedColumns,
        selectedColumns - 1,
        selectedColumns + 1,
        2, 1, 3, 4
      ].filter(n => n >= 1 && n <= 4)
      const validCount = getFirstValidColumnCount(validColumnCounts, preferences)
      setSelectedColumns(validCount)
    }
  }, [validColumnCounts, selectedColumns])

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
      options: columnOptions,
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
