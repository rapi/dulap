import { ProductComponent } from '~/components/ProductPage/BedsideProductPage'
import { useState, useEffect, useMemo } from 'react'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import {
  ColumnConfigurationType,
  getConfigurationMetadata,
} from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { getConstraints } from '~/config/furnitureConstraints'
import { useFurnitureConstraints } from '~/hooks/useFurnitureConstraints'
import {
  getValidColumnCounts,
  getFirstValidColumnCount,
} from '~/utils/columnValidation'
import { findNearestAvailableConfiguration } from '~/utils/columnConfigurationFallback'
import { isConfigurationValid } from '~/config/columnConstraints'

// Get bedside constraints
const CONSTRAINTS = getConstraints('bedside')

export const DEFAULT_BEDSIDE = {
  width: CONSTRAINTS.dimensions.width.default,
  height: CONSTRAINTS.dimensions.height.default,
  depth: CONSTRAINTS.dimensions.depth.default,
  plintHeight: CONSTRAINTS.dimensions.plintHeight.default,
  selectedColor: '#fcfbf5', // White
  columns: CONSTRAINTS.columns.default,
  sections: CONSTRAINTS.sections.default,
}

export const BedsideProductConfigurator: () => ProductComponent[] = () => {
  const [width, setWidth] = useState(DEFAULT_BEDSIDE.width)
  const [height, setHeight] = useState(DEFAULT_BEDSIDE.height)
  const [depth, setDepth] = useState(DEFAULT_BEDSIDE.depth)
  const [plintHeight, setPlintHeight] = useState(DEFAULT_BEDSIDE.plintHeight)
  const [selectedSections, setSelectedSections] = useState(
    DEFAULT_BEDSIDE.sections
  )
  const [selectedColumns, setSelectedColumns] = useState(
    DEFAULT_BEDSIDE.columns
  )
  const [columnConfigurations, setColumnConfigurations] = useState<
    ColumnConfigurationWithOptions[]
  >([{ type: ColumnConfigurationType.DRAWERS_2 }])
  const [selectedColor, setSelectedColor] = useState(
    DEFAULT_BEDSIDE.selectedColor
  )
  const [guides, setGuides] = useState(
    'homepage.configurator.fittings.guides.options.1'
  )
  const [openingOption, setOpeningOption] = useState<OpeningType>(
    OpeningType.Push
  )
  const [imageColor, setImageColor] = useState('White')
  const [hinges] = useState('standart')

  // --- NEW: independent gallery color + who changed last ---
  const [galleryColor, setGalleryColor] = useState<string>('White')
  const [galleryImageColor, setGalleryImageColor] = useState<string>('White')
  const [lastColorChanged, setLastColorChanged] = useState<'main' | 'gallery'>(
    'main'
  )
  // ---------------------------------------------------------

  // Derive sections from column configurations (for new 3D system)
  const derivedSections = useMemo(() => {
    const maxSections = Math.max(
      ...columnConfigurations.map((config) => {
        const metadata = getConfigurationMetadata(config.type)
        return metadata?.drawerCount > 0
          ? metadata?.drawerCount
          : metadata?.shelfCount
      })
    )
    return maxSections > 0 ? maxSections : 2
  }, [columnConfigurations])

  // Use centralized constraints hook for automatic calculations
  const { price, imageHeight, imageWidth, imagePlintHeight } =
    useFurnitureConstraints(
      'bedside',
      { width, height, depth, plintHeight },
      selectedSections, // Old system uses selectedSections
      guides === 'homepage.configurator.fittings.guides.options.2'
    )

  // Auto-adjust sections based on height (for old system)
  useEffect(() => {
    const autoSections =
      CONSTRAINTS.sections.autoCalculate?.({ width, height }) ?? 1
    setSelectedSections(autoSections)
  }, [width, height])

  // Update column configurations ONLY when number of columns changes
  useEffect(() => {
    setColumnConfigurations((prev) => {
      const dimensions = {
        width: width / selectedColumns,
        height: height - plintHeight,
        depth: depth,
      }

      // Create new configurations array, preserving existing ones
      const newConfigs = Array(selectedColumns)
        .fill(null)
        .map((_, i) => {
          // Always try to preserve existing configuration first
          if (prev[i]) {
            // Check if it's still valid with new dimensions
            if (isConfigurationValid(prev[i].type, dimensions)) {
              return prev[i] // Preserve both type and doorOpeningSide
            }
            // If not valid, find nearest alternative (preserve doorOpeningSide if applicable)
            const nearestType = findNearestAvailableConfiguration(
              prev[i].type,
              dimensions
            ) || prev[i].type
            
            const metadata = getConfigurationMetadata(nearestType)
            const doorOpeningSide = metadata?.doorCount === 1 
              ? (prev[i].doorOpeningSide || 'left')
              : undefined
            
            return { type: nearestType, doorOpeningSide }
          }

          // For new columns (when expanding), use default
          const defaultType = ColumnConfigurationType.DRAWERS_2
          const nearestType = findNearestAvailableConfiguration(
            defaultType,
            dimensions
          ) || defaultType
          
          return { type: nearestType }
        })

      return newConfigs
    })
  }, [selectedColumns, width, height, depth, plintHeight]) // Trigger when column count or dimensions change

  // Validate existing configurations when dimensions change
  useEffect(() => {
    const dimensions = {
      width: width / selectedColumns,
      height: height - plintHeight,
      depth: depth,
    }

    setColumnConfigurations((prev) => {
      // Check if any configuration needs updating
      const needsUpdate = prev.some(
        (config) => !isConfigurationValid(config.type, dimensions)
      )

      if (!needsUpdate) {
        return prev // No changes needed
      }

      // Update only invalid configurations (preserve doorOpeningSide)
      return prev.map((config) => {
        if (isConfigurationValid(config.type, dimensions)) {
          return config // Keep valid ones
        }
        // Replace invalid with nearest available (preserve doorOpeningSide if applicable)
        const nearestType = findNearestAvailableConfiguration(
          config.type,
          dimensions
        ) || config.type
        
        const metadata = getConfigurationMetadata(nearestType)
        const doorOpeningSide = metadata?.doorCount === 1 
          ? (config.doorOpeningSide || 'left')
          : undefined
        
        return { type: nearestType, doorOpeningSide }
      })
    })
  }, [width, height, depth, plintHeight, selectedColumns]) // Trigger on dimension changes

  // Calculate individual column dimensions for constraint evaluation
  const columnWidth = useMemo(
    () => width / selectedColumns,
    [width, selectedColumns]
  )
  const columnHeight = useMemo(
    () => height - plintHeight,
    [height, plintHeight]
  )
  const columnDepth = depth

  // Check which column counts are valid based on dimensions
  const validColumnCounts = useMemo(
    () => getValidColumnCounts(width, height, depth, plintHeight),
    [width, height, depth, plintHeight]
  )

  // Create column options with disabled states
  const columnOptions = useMemo(
    () => [
      { value: '1', label: 1, disabled: !validColumnCounts[1] },
      { value: '2', label: 2, disabled: !validColumnCounts[2] },
      { value: '3', label: 3, disabled: !validColumnCounts[3] },
      { value: '4', label: 4, disabled: !validColumnCounts[4] },
    ],
    [validColumnCounts]
  )

  // Auto-select valid column count when current becomes invalid
  useEffect(() => {
    if (!validColumnCounts[selectedColumns]) {
      // Try to keep a count close to the current selection
      const preferences = [
        selectedColumns,
        selectedColumns - 1,
        selectedColumns + 1,
        1,
        2,
        3,
        4,
      ].filter((n) => n >= 1 && n <= 4)
      const validCount = getFirstValidColumnCount(
        validColumnCounts,
        preferences
      )
      setSelectedColumns(validCount)
    }
  }, [validColumnCounts, selectedColumns])

  // Map color names for image paths (MAIN)
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

  // Map color names for image paths (GALLERY)
  useEffect(() => {
    if (galleryColor === 'Biege') {
      setGalleryImageColor('Biege')
    } else if (galleryColor === 'White') {
      setGalleryImageColor('White')
    } else if (galleryColor === 'Light Grey') {
      setGalleryImageColor('Light Grey')
    } else if (galleryColor === 'Grey') {
      setGalleryImageColor('Grey')
    } else setGalleryImageColor('White')
  }, [galleryColor])

  // Keep gallery picker in sync with main color until user changes gallery explicitly
  useEffect(() => {
    if (lastColorChanged === 'main') {
      setGalleryColor(selectedColor)
    }
  }, [selectedColor, lastColorChanged])

  // Choose last changed color for gallery visuals
  const activeGalleryImageColor = useMemo(
    () => (lastColorChanged === 'gallery' ? galleryImageColor : imageColor),
    [lastColorChanged, galleryImageColor, imageColor]
  )

  return [
    {
      type: 'dimensions',
      widthRange: [
        CONSTRAINTS.dimensions.width.min,
        CONSTRAINTS.dimensions.width.max,
      ],
      heightRange: [
        CONSTRAINTS.dimensions.height.min,
        CONSTRAINTS.dimensions.height.max,
      ],
      depthRange: [
        CONSTRAINTS.dimensions.depth.min,
        CONSTRAINTS.dimensions.depth.max,
      ],
      plintHeightRange: [
        CONSTRAINTS.dimensions.plintHeight.min,
        CONSTRAINTS.dimensions.plintHeight.max,
      ],
      heightStep: CONSTRAINTS.steps?.heightStep ?? 1,
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
      setSelectedColor: (v: string) => {
        setSelectedColor(v)
        setLastColorChanged('main')
      },
    },
    {
      type: 'sections',
      selectedSections,
      setSelectedSections,
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
      productType: 'bedside' as const,
    },
    {
      type: 'furniture',
      openingOption: openingOption as string | OpeningType,
      hinges,
      setOpeningOption,
      selectedOpeningMethod: openingOption as string | OpeningType,
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
        `/bedside/render/${imageColor} 1.png`,
        `/bedside/render/${imageColor} 2.png`,
      ],
    },
    // Expose independent gallery color control (if your ProductPage renders it)
    {
      type: 'galleryColors',
      colors: CONSTRAINTS.colors,
      selectedColor: galleryColor,
      setSelectedColor: (v: string) => {
        setGalleryColor(v)
        setLastColorChanged('gallery')
      },
    } as unknown as ProductComponent,
    {
      type: 'gallery',
      images: [
        `/bedside/render/${activeGalleryImageColor} 1.png`,
        `/bedside/render/${activeGalleryImageColor} 2.png`,
        `/bedside/render/${activeGalleryImageColor} 1.png`,
        `/bedside/render/${activeGalleryImageColor} 2.png`,
        `/bedside/render/${activeGalleryImageColor} 1.png`,
        `/bedside/render/${activeGalleryImageColor} 2.png`,
        `/bedside/render/${activeGalleryImageColor} 1.png`,
        `/bedside/render/${activeGalleryImageColor} 2.png`,
      ],
    },
    {
      type: 'metadata',
      derivedSections, // Provide derivedSections for new 3D system
    },
  ]
}
