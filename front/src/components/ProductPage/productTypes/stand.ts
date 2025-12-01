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
  selectedColor: 'Biege Almond',
}

export const StandProductConfigurator: () => ProductComponent[] = () => {
  // Get URL context
  const urlCtx = useConfiguratorConfigOptional()

  const [width, setWidth] = useState(
    () => urlCtx?.config.width ?? DEFAULT_STAND.width
  )
  const [height, setHeight] = useState(
    () => urlCtx?.config.height ?? DEFAULT_STAND.height
  )
  const [depth, setDepth] = useState(
    () => urlCtx?.config.depth ?? DEFAULT_STAND.depth
  )
  const [plintHeight, setPlintHeight] = useState(
    () => urlCtx?.config.plintHeight ?? DEFAULT_STAND.plintHeight
  )

  // Initialize columns and configurations from URL if available
  const [selectedColumns, setSelectedColumns] = useState(
    () => urlCtx?.config.columns ?? CONSTRAINTS.columns.default
  )
  const [columnConfigurations, setColumnConfigurations] = useState<
    ColumnConfigurationWithOptions[]
  >(() =>
    urlCtx?.config.columnConfigurations &&
    urlCtx.config.columnConfigurations.length > 0
      ? urlCtx.config.columnConfigurations
      : [{ type: ColumnConfigurationType.DRAWERS_3 }]
  )
  const [selectedColor, setSelectedColor] = useState(
    () => urlCtx?.config.color ?? DEFAULT_STAND.selectedColor
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
  // Track previous value to detect actual changes - DO NOT initialize with current value!
  const prevSelectedColumnsRef = useRef<number | null>(null)
  // Track previous column configurations to prevent infinite URL sync loops
  // Initialize with current configs to prevent immediate sync on mount
  const prevColumnConfigsRef = useRef<string>(
    JSON.stringify(
      urlCtx?.config.columnConfigurations &&
        urlCtx.config.columnConfigurations.length > 0
        ? urlCtx.config.columnConfigurations
        : [{ type: ColumnConfigurationType.DRAWERS_3 }]
    )
  )

  // Mark hydration as complete after first render
  useEffect(() => {
    hasHydratedRef.current = true
  }, [])

  // Sync local state with URL context changes (for dimensions and columns count ONLY)
  // NOTE: Do NOT sync columnConfigurations here - they are managed by their own effects
  // and syncing them here creates infinite loops with validation
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
    return maxSections > 0 ? maxSections : 3
  }, [columnConfigurations])

  // Use centralized constraints hook for automatic calculations
  const { price } = useFurnitureConstraints(
    'stand',
    { width, height, depth, plintHeight },
    selectedColumns,
    columnConfigurations.map((config) => config.type),
    openingOption === OpeningType.Push
  )

  // Update column configurations when number of columns changes OR on first mount if count mismatch
  useEffect(() => {
    setColumnConfigurations((prev) => {
      // Check if this is first run
      const isFirstRun = prevSelectedColumnsRef.current === null

      // If not first run and value didn't change, skip
      if (!isFirstRun && prevSelectedColumnsRef.current === selectedColumns) {
        return prev
      }

      // If we already have the correct number of configurations, don't recreate them
      // This prevents overwriting configurations loaded from URL during hydration
      if (prev.length === selectedColumns) {
        // Update the ref since we're keeping the config
        if (isFirstRun || prevSelectedColumnsRef.current !== selectedColumns) {
          prevSelectedColumnsRef.current = selectedColumns
        }
        return prev
      }

      prevSelectedColumnsRef.current = selectedColumns

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
              'stand',
              i,
              selectedColumns
            )
          }
          return createConfigurationForNewColumn(
            prev,
            dimensions,
            3,
            'stand',
            i,
            selectedColumns
          )
        })

      return newConfigs
    })
  }, [selectedColumns, width, height, depth, plintHeight])

  // Validate existing configurations when dimensions change
  useEffect(() => {
    // Skip validation until hydration completes
    if (!hasHydratedRef.current) return

    // Skip if columns and configs are mismatched (indicates we're mid-update)
    setColumnConfigurations((prev) => {
      if (prev.length !== selectedColumns) return prev

      const dimensions = {
        width: width / selectedColumns,
        height: height - plintHeight,
        depth: depth,
      }

      return validateAndUpdateConfigurations(prev, dimensions, 'stand')
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

  // Map color names for image paths (MAIN)
  useEffect(() => {
    setImageColor(mapColorToImageColor(selectedColor))
  }, [selectedColor])

  // Map color names for image paths (GALLERY)
  useEffect(() => {
    setGalleryImageColor(mapColorToImageColor(galleryColor))
  }, [galleryColor])

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
