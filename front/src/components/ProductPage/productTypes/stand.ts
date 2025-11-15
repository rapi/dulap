import { ProductComponent } from '~/components/ProductPage/StandProductPage'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
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
import {
  createConfigurationForExistingColumn,
  createConfigurationForNewColumn,
  validateAndUpdateConfigurations,
} from '~/utils/columnConfigurationUtils'
import { getValidColumnCountsForStand } from '~/config/columnConstraints.stand'
import { mapColorToImageColor } from '~/utils/colorUtils'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'

// Get stand constraints
const CONSTRAINTS = getConstraints('stand')

export const DEFAULT_STAND = {
  width: CONSTRAINTS.dimensions.width.default,
  height: CONSTRAINTS.dimensions.height.default,
  depth: CONSTRAINTS.dimensions.depth.default,
  plintHeight: CONSTRAINTS.dimensions.plintHeight.default,
  selectedColor: '#fcfbf5', // White (the first from the list)
}

export const StandProductConfigurator: () => ProductComponent[] = () => {
  // Get URL context
  const urlCtx = useConfiguratorConfigOptional()
  
  const [width, setWidth] = useState(DEFAULT_STAND.width)
  const [height, setHeight] = useState(DEFAULT_STAND.height)
  const [depth, setDepth] = useState(DEFAULT_STAND.depth)
  const [plintHeight, setPlintHeight] = useState(DEFAULT_STAND.plintHeight)
  const [selectedSections, setSelectedSections] = useState(
    CONSTRAINTS.sections.default
  )
  const [selectedColumns, setSelectedColumns] = useState(CONSTRAINTS.columns.default)
  const [columnConfigurations, setColumnConfigurations] = useState<
    ColumnConfigurationWithOptions[]
  >([{ type: ColumnConfigurationType.DRAWERS_3 }])
  const [selectedColor, setSelectedColor] = useState(
    DEFAULT_STAND.selectedColor
  )
  const [guides, setGuides] = useState(
    'homepage.configurator.fittings.guides.options.1'
  )
  const [openingOption, setOpeningOption] = useState<OpeningType>(
    OpeningType.Push
  )
  const [imageColor, setImageColor] = useState('White')

  // --- NEW: independent gallery color + who changed last ---
  const [galleryColor, setGalleryColor] = useState<string>('White')
  const [galleryImageColor, setGalleryImageColor] = useState<string>('White')
  const [lastColorChanged, setLastColorChanged] = useState<'main' | 'gallery'>(
    'main'
  )
  // ---------------------------------------------------------
  
  // Track if hydration has happened
  const hasHydratedRef = useRef(false)
  // Track previous value to detect actual changes - initialized to current value
  const prevSelectedColumnsRef = useRef<number>(selectedColumns)

  // Update ref after every render (this is the "usePrevious" pattern)
  useEffect(() => {
    prevSelectedColumnsRef.current = selectedColumns
  })

  // Hydrate from URL ONCE on mount
  useEffect(() => {
    if (!urlCtx || hasHydratedRef.current) return
    
    hasHydratedRef.current = true
    const { config } = urlCtx

    // Batch all state updates together
    if (config.columns !== undefined) {
      setSelectedColumns(config.columns)
    }

    if (config.columnConfigurations && config.columnConfigurations.length > 0) {
      setColumnConfigurations(config.columnConfigurations)
    }

    if (config.openingType) {
      let openingType: OpeningType
      if (config.openingType === 'profile') {
        openingType = OpeningType.ProfileHandle
      } else if (config.openingType === 'round') {
        openingType = OpeningType.RoundHandle
      } else {
        openingType = OpeningType.Push
      }
      setOpeningOption(openingType)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - run ONCE on mount

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
    return allOptions.map((value) => ({
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

  // Update column configurations ONLY when number of columns ACTUALLY changes (not on mount)
  useEffect(() => {
    // Skip if value didn't actually change
    if (prevSelectedColumnsRef.current === selectedColumns) {
      return
    }
    
    prevSelectedColumnsRef.current = selectedColumns
    
    setColumnConfigurations((prev) => {
      // If we already have the correct number of configurations, don't recreate them
      // This prevents overwriting configurations loaded from URL during hydration
      if (prev.length === selectedColumns) {
        return prev
      }

      const dimensions = {
        width: width / selectedColumns,
        height: height - plintHeight,
        depth: depth,
      }

      // Create new configurations array, preserving existing ones
      const newConfigs = Array(selectedColumns)
        .fill(null)
        .map((_, i) => {
          if (prev[i]) {
            return createConfigurationForExistingColumn(prev[i], dimensions, 'stand', i, selectedColumns)
          }
          return createConfigurationForNewColumn(prev, dimensions, 3, 'stand', i, selectedColumns)
        })

      return newConfigs
    })
  }, [selectedColumns, width, height, depth, plintHeight])

  // Validate existing configurations when dimensions change
  useEffect(() => {
    // Skip validation until hydration completes
    if (!hasHydratedRef.current) {
      return
    }
    
    // Skip if columns and configs are mismatched (indicates we're mid-update)
    setColumnConfigurations((prev) => {
      if (prev.length !== selectedColumns) {
        return prev
      }
      
      const dimensions = {
        width: width / selectedColumns,
        height: height - plintHeight,
        depth: depth,
      }
      
      const validated = validateAndUpdateConfigurations(prev, dimensions, 'stand')
      
      return validated
    })
  }, [width, height, depth, plintHeight, selectedColumns])

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

  // Check which column counts are valid based on dimensions AND stand-specific width rules
  const validColumnCounts = useMemo(() => {
    // Get valid counts based on column dimensions (width, height, depth)
    const dimensionBasedCounts = getValidColumnCounts(
      width,
      height,
      depth,
      plintHeight
    )

    // Get valid counts based on stand width rules
    const standWidthBasedCounts = getValidColumnCountsForStand(width)

    // Combine both: a count is valid only if it passes BOTH checks
    const combined: Record<number, boolean> = {
      1: dimensionBasedCounts[1] && standWidthBasedCounts[1],
      2: dimensionBasedCounts[2] && standWidthBasedCounts[2],
      3: dimensionBasedCounts[3] && standWidthBasedCounts[3],
      4: dimensionBasedCounts[4] && standWidthBasedCounts[4],
    }

    return combined
  }, [width, height, depth, plintHeight])

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
        2,
        1,
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
    setImageColor(mapColorToImageColor(selectedColor))
  }, [selectedColor])

  // Map color names for image paths (GALLERY)
  useEffect(() => {
    setGalleryImageColor(mapColorToImageColor(galleryColor))
  }, [galleryColor])

  // Choose last changed color for gallery visuals
  const activeGalleryImageColor = useMemo(
    () => (lastColorChanged === 'gallery' ? galleryImageColor : imageColor),
    [lastColorChanged, galleryImageColor, imageColor]
  )

  useEffect(() => {
    if (lastColorChanged === 'main') {
      setGalleryColor(selectedColor)
    }
  }, [selectedColor, lastColorChanged])

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
      options: sectionOptions,
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
        `/stand2/render/${activeGalleryImageColor} 1.png`,
        `/stand2/render/${activeGalleryImageColor} 2.png`,
        `/stand2/render/${activeGalleryImageColor} 1.png`,
        `/stand2/render/${activeGalleryImageColor} 2.png`,
        `/stand2/render/${activeGalleryImageColor} 1.png`,
        `/stand2/render/${activeGalleryImageColor} 2.png`,
        `/stand2/render/${activeGalleryImageColor} 1.png`,
        `/stand2/render/${activeGalleryImageColor} 2.png`,
      ],
    },
    {
      type: 'metadata',
      derivedSections, // Provide derivedSections for new 3D system
    },
  ]
}
