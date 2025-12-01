import { ProductComponent } from '~/components/ProductPage/TVStandProductPage'
import { useState, useEffect, useMemo, useRef } from 'react'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import {
  ColumnConfigurationType,
  getConfigurationMetadata,
} from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'
import { getConstraints } from '~/config/furnitureConstraints'
import { useFurnitureConstraints } from '~/hooks/useFurnitureConstraints'
import { getFirstValidColumnCount } from '~/utils/columnValidation'
import {
  createConfigurationForExistingColumn,
  createConfigurationForNewColumn,
  validateAndUpdateConfigurations,
} from '~/utils/columnConfigurationUtils'
import { getValidColumnCountsForTVStand } from '~/config/columnConstraints.tvstand'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'

// Get TV stand constraints
const CONSTRAINTS = getConstraints('tv-stand')

export const DEFAULT_TV_STAND = {
  width: CONSTRAINTS.dimensions.width.default,
  height: CONSTRAINTS.dimensions.height.default,
  depth: CONSTRAINTS.dimensions.depth.default,
  plintHeight: CONSTRAINTS.dimensions.plintHeight.default,
  selectedColor: 'Biege Almond',
  columns: CONSTRAINTS.columns.default,
  sections: CONSTRAINTS.sections.default,
}

export const TVStandProductConfigurator: () => ProductComponent[] = () => {
  // Get URL context
  const urlCtx = useConfiguratorConfigOptional()

  const [width, setWidth] = useState(
    () => urlCtx?.config.width ?? DEFAULT_TV_STAND.width
  )
  const [height, setHeight] = useState(
    () => urlCtx?.config.height ?? DEFAULT_TV_STAND.height
  )
  const [depth, setDepth] = useState(
    () => urlCtx?.config.depth ?? DEFAULT_TV_STAND.depth
  )
  const [plintHeight, setPlintHeight] = useState(
    () => urlCtx?.config.plintHeight ?? DEFAULT_TV_STAND.plintHeight
  )
  const [selectedSections, setSelectedSections] = useState(
    DEFAULT_TV_STAND.sections
  )

  // Initialize columns and configurations from URL if available
  const [selectedColumns, setSelectedColumns] = useState(
    () => urlCtx?.config.columns ?? DEFAULT_TV_STAND.columns
  )
  const [columnConfigurations, setColumnConfigurations] = useState<
    ColumnConfigurationWithOptions[]
  >(() =>
    urlCtx?.config.columnConfigurations &&
    urlCtx.config.columnConfigurations.length > 0
      ? urlCtx.config.columnConfigurations
      : [
          { type: ColumnConfigurationType.DRAWERS_2 },
          { type: ColumnConfigurationType.DRAWERS_2 },
        ]
  )
  const [selectedColor, setSelectedColor] = useState(
    () => urlCtx?.config.color ?? DEFAULT_TV_STAND.selectedColor
  )
  const [guides, setGuides] = useState(
    'homepage.configurator.fittings.guides.options.1'
  )
  const [openingOption, setOpeningOption] = useState<OpeningType>(() => {
    if (!urlCtx?.config.openingType) return OpeningType.Push
    if (urlCtx.config.openingType === 'profile')
      return OpeningType.ProfileHandle
    if (urlCtx.config.openingType === 'round') return OpeningType.RoundHandle
    return OpeningType.Push
  })
  const [imageColor, setImageColor] = useState('Biege Almond')

  // --- NEW: independent gallery color + who changed last ---
  const [galleryColor, setGalleryColor] = useState<string>('Biege Almond')
  const [galleryImageColor, setGalleryImageColor] = useState<string>('Biege Almond')
  const [lastColorChanged, setLastColorChanged] = useState<'main' | 'gallery'>(
    'main'
  )
  // ---------------------------------------------------------

  // Track if initial render has happened (to prevent URL sync during initialization)
  const hasHydratedRef = useRef(false)
  // Track previous column configurations to prevent infinite URL sync loops
  const prevColumnConfigsRef = useRef<string>(
    JSON.stringify(
      urlCtx?.config.columnConfigurations &&
        urlCtx.config.columnConfigurations.length > 0
        ? urlCtx.config.columnConfigurations
        : [
            { type: ColumnConfigurationType.DRAWERS_2 },
            { type: ColumnConfigurationType.DRAWERS_2 },
          ]
    )
  )

  // Mark hydration as complete after first render
  useEffect(() => {
    hasHydratedRef.current = true
  }, [])

  // Sync local state with URL context changes (for dimensions and columns count ONLY)
  useEffect(() => {
    if (!urlCtx) return

    // Sync dimensions
    if (urlCtx.config.width !== undefined && urlCtx.config.width !== width) {
      setWidth(urlCtx.config.width)
    }
    if (urlCtx.config.height !== undefined && urlCtx.config.height !== height) {
      setHeight(urlCtx.config.height)
    }
    if (urlCtx.config.depth !== undefined && urlCtx.config.depth !== depth) {
      setDepth(urlCtx.config.depth)
    }
    if (
      urlCtx.config.plintHeight !== undefined &&
      urlCtx.config.plintHeight !== plintHeight
    ) {
      setPlintHeight(urlCtx.config.plintHeight)
    }

    // Sync columns count
    if (
      urlCtx.config.columns !== undefined &&
      urlCtx.config.columns !== selectedColumns
    ) {
      setSelectedColumns(urlCtx.config.columns)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    urlCtx?.config.width,
    urlCtx?.config.height,
    urlCtx?.config.depth,
    urlCtx?.config.plintHeight,
    urlCtx?.config.columns,
  ])

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
  const { price } = useFurnitureConstraints(
    'tv-stand',
    { width, height, depth, plintHeight },
    selectedColumns,
    columnConfigurations.map((config) => config.type),
    openingOption === OpeningType.Push
  )

  // Update column configurations ONLY when number of columns changes
  useEffect(() => {
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
            return createConfigurationForExistingColumn(
              prev[i],
              dimensions,
              'tv-stand',
              i,
              selectedColumns
            )
          }
          return createConfigurationForNewColumn(
            prev,
            dimensions,
            2,
            'tv-stand',
            i,
            selectedColumns
          )
        })

      return newConfigs
    })
  }, [selectedColumns, width, height, depth, plintHeight])

  // Validate existing configurations when dimensions change
  useEffect(() => {
    const dimensions = {
      width: width / selectedColumns,
      height: height - plintHeight,
      depth: depth,
    }

    setColumnConfigurations((prev) =>
      validateAndUpdateConfigurations(prev, dimensions, 'tv-stand')
    )
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

  // Check which column counts are valid based on TV stand width rules
  const validColumnCounts = useMemo(
    () => getValidColumnCountsForTVStand(width),
    [width]
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
    // Skip auto-adjustment during initial hydration
    if (!hasHydratedRef.current) return

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

      // Update both local state AND URL context
      setSelectedColumns(validCount)
      if (urlCtx) {
        const ctx = urlCtx
        const setConfig = ctx.setConfig as (
          config: Partial<typeof ctx.config>
        ) => void
        setConfig({ columns: validCount })
      }
    }
  }, [validColumnCounts, selectedColumns, urlCtx])

  // Sync column configurations to URL (only after hydration completes)
  useEffect(() => {
    if (!urlCtx || !hasHydratedRef.current) return
    if (columnConfigurations.length === 0) return

    // Only sync if the value actually changed (deep comparison via JSON)
    const currentSerialized = JSON.stringify(columnConfigurations)
    if (prevColumnConfigsRef.current === currentSerialized) return

    prevColumnConfigsRef.current = currentSerialized

    // Type assertion needed because context definition doesn't reflect that setConfig accepts partials
    const ctx = urlCtx
    const setConfig = ctx.setConfig as (
      config: Partial<typeof ctx.config>
    ) => void
    setConfig({ columnConfigurations })
  }, [columnConfigurations, urlCtx])

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
    } else if (selectedColor === 'Biege Almond') {
      setImageColor('Biege Almond')
    } else setImageColor('Biege Almond')
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
    } else if (galleryColor === 'Biege Almond') {
      setGalleryImageColor('Biege Almond')
    } else setGalleryImageColor('Biege Almond')
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
      productType: 'tv-stand' as const,
    },
    {
      type: 'furniture',
      openingOption: openingOption,
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
        `/tv-stand/render/${activeGalleryImageColor} 1.png`,
        `/tv-stand/render/${activeGalleryImageColor} 2.png`,
        `/tv-stand/render/${activeGalleryImageColor} 1.png`,
        `/tv-stand/render/${activeGalleryImageColor} 2.png`,
        `/tv-stand/render/${activeGalleryImageColor} 1.png`,
        `/tv-stand/render/${activeGalleryImageColor} 2.png`,
        `/tv-stand/render/${activeGalleryImageColor} 1.png`,
        `/tv-stand/render/${activeGalleryImageColor} 2.png`,
      ],
    },
    {
      type: 'metadata',
      derivedSections, // Provide derivedSections for new 3D system
    },
  ]
}
