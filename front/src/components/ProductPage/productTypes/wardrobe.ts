import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { colorHexCodes, ColorName } from '~/utils/colorDictionary'
import { WardrobeColumnConfiguration } from '~/types/wardrobeConfigurationTypes'
import { calculateWardrobeColumnLayout } from '~/utils/wardrobeColumnLayout'
import { WARDROBE_TEMPLATES } from '~/config/wardrobeTemplates'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'
import {
  encodeWardrobeColumnConfigs,
  decodeWardrobeColumnConfigs,
} from '~/utils/wardrobeColumnConfigUrl'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { calculateWardrobePrice } from '~/config/furnitureConstraints'

export const DEFAULT_WARDROBE = {
  width: 200,
  height: 260,
  depth: 50,
  plintHeight: 2,
  selectedColor: 'Biege Almond',
}

export const WardrobeProductConfigurator: () => ProductComponent[] = () => {
  // Get URL context
  const urlCtx = useConfiguratorConfigOptional()
  const router = useRouter()

  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(260)
  const [depth, setDepth] = useState(50)
  const [plintHeight, setPlintHeight] = useState(2)
  const [selectedColor, setSelectedColor] = useState(
    colorHexCodes[ColorName.White]
  )

  // Mirror state - tracks if wardrobe columns should be reversed
  const [isMirrored, setIsMirrored] = useState(false)

  // Column configuration state - calculate layout with mirroring applied
  const columnLayout = useMemo(() => {
    return calculateWardrobeColumnLayout(width, isMirrored)
  }, [width, isMirrored])

  // Initialize column configurations
  const [columnConfigurations, setColumnConfigurations] = useState<
    WardrobeColumnConfiguration[]
  >(() => {
    // Default initialization
    return columnLayout.columnWidths.map((colWidth, index) => {
      const defaultTemplateId = 'FULL_HANGING_WITH_1_SHELF'
      const template = WARDROBE_TEMPLATES[defaultTemplateId]
      return {
        zones: template?.zones || [],
        totalHeight: height - plintHeight,
        doorType: colWidth > 60 ? 'split' : 'single',
        doorOpeningSide: columnLayout.doorOpeningSides[index],
        templateId: defaultTemplateId,
        hasDoor: true, // Default to closed (has door)
      }
    })
  })

  // Track if we've initialized from URL
  const [urlInitialized, setUrlInitialized] = useState(false)
  const [guides, setGuides] = useState('standart')

  // Opening option should behave like in StandProductConfigurator
  const [openingOption, setOpeningOption] = useState<OpeningType>(() => {
    if (!urlCtx?.config.openingType) return OpeningType.ProfileHandleLong
    if (urlCtx.config.openingType === 'profile') {
      return OpeningType.ProfileHandle
    }
    if (urlCtx.config.openingType === 'profile-long') {
      return OpeningType.ProfileHandleLong
    }
    if (urlCtx.config.openingType === 'round') {
      return OpeningType.RoundHandle
    }
    // Fallback to long profile handle if push is specified (push no longer supported for wardrobes)
    return OpeningType.ProfileHandleLong
  })

  // Initialize isMirrored from URL
  useEffect(() => {
    if (urlCtx?.config.isMirrored !== undefined) {
      setIsMirrored(urlCtx.config.isMirrored)
    }
  }, [urlCtx?.config.isMirrored])

  // Calculate doors number based on width (used for pricing)
  const doorsNr = useMemo(() => {
    if (width <= 60) return 1
    if (width <= 100) return 2
    if (width <= 150) return width < 120 ? 2 : 3
    if (width < 200) return 3
    if (width === 200) return 5
    return 4
  }, [width])

  // Track if initial render has happened (to prevent URL sync during initialization)
  const hasHydratedRef = useRef(false)

  // Track previous mirror state to detect actual changes (not initialization)
  const prevMirroredRef = useRef(isMirrored)

  // Track previous values to avoid unnecessary state updates
  const prevDimensionsRef = useRef({
    width: 200,
    height: 260,
    plintHeight: 2,
    columnCount: columnLayout.columnCount,
  })

  // Mark hydration as complete after first render
  useEffect(() => {
    hasHydratedRef.current = true
  }, [])

  // Sync local state with URL context changes (for dimensions ONLY)
  // This prevents state mismatches during rapid updates
  useEffect(() => {
    if (!urlCtx || !hasHydratedRef.current) return

    // Sync dimensions - only update if URL context value differs from local state
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    urlCtx?.config.width,
    urlCtx?.config.height,
    urlCtx?.config.depth,
    urlCtx?.config.plintHeight,
  ])

  // Function to update column configurations with URL sync
  const updateColumnConfigurations = useCallback(
    (configs: WardrobeColumnConfiguration[]) => {
      setColumnConfigurations(configs)

      // Sync to URL via context
      if (urlCtx) {
        const encoded = encodeWardrobeColumnConfigs(configs)
        urlCtx.setConfig({
          ...urlCtx.config,
          wardrobeCfg: encoded,
        })
      }
    },
    [urlCtx]
  )

  // Function to toggle mirror state with URL sync
  const toggleMirror = useCallback(() => {
    const newMirrorState = !isMirrored
    setIsMirrored(newMirrorState)

    // Sync mirror state to URL (configurations will be synced by the effect below)
    if (urlCtx) {
      urlCtx.setConfig({
        ...urlCtx.config,
        isMirrored: newMirrorState,
      })
    }
  }, [isMirrored, urlCtx, width, columnConfigurations])

  // Reverse configurations when mirror state changes (but not during initialization)
  useEffect(() => {
    // Skip if not initialized yet
    if (!urlInitialized || !hasHydratedRef.current) {
      return
    }

    // Skip if mirror state hasn't actually changed (prevents reversal on mount)
    if (prevMirroredRef.current === isMirrored) {
      return
    }

    // Update ref for next comparison
    prevMirroredRef.current = isMirrored

    // Calculate the NEW layout with the NEW mirror state
    const newLayout = calculateWardrobeColumnLayout(width, isMirrored)

    // When mirror state changes, reverse the configurations to match the new layout
    setColumnConfigurations((prevConfigs) => {
      const reversed = [...prevConfigs].reverse()

      // Also update door opening sides for single doors after mirroring
      const reversedWithUpdatedDoors = reversed.map((config, index) => {
        // Get the new column width and door side from the NEW layout
        const newColumnWidth = newLayout.columnWidths[index]
        const newDoorOpeningSide = newLayout.doorOpeningSides[index]

        // Only update if it's a single door (narrow column)
        if (config.doorType === 'single' && newColumnWidth <= 60) {
          return {
            ...config,
            doorOpeningSide: newDoorOpeningSide,
          }
        }
        return config
      })

      // Sync to URL
      if (urlCtx) {
        const encoded = encodeWardrobeColumnConfigs(reversedWithUpdatedDoors)
        urlCtx.setConfig({
          ...urlCtx.config,
          wardrobeCfg: encoded,
        })
      }

      return reversedWithUpdatedDoors
    })
  }, [isMirrored, urlInitialized, urlCtx, width])

  // Initialize from URL after component mounts
  useEffect(() => {
    if (!urlInitialized && router.isReady && urlCtx) {
      const wardrobeCfgStr = urlCtx.config.wardrobeCfg

      if (wardrobeCfgStr && typeof wardrobeCfgStr === 'string') {
        // Decode configurations from URL (now includes hasDoor state)
        const decodedConfigs = decodeWardrobeColumnConfigs(wardrobeCfgStr)

        if (decodedConfigs.length > 0) {
          // Calculate layout based on URL width and mirror state
          const urlWidth = urlCtx.config.width
          const urlMirrored = urlCtx.config.isMirrored ?? false

          const urlLayout = calculateWardrobeColumnLayout(urlWidth, urlMirrored)

          const newConfigs = urlLayout.columnWidths.map((colWidth, index) => {
            const decoded = decodedConfigs[index] || {
              templateId: 'FULL_HANGING_WITH_1_SHELF',
              hasDoor: true,
            }
            const templateId = decoded.templateId
            const template = WARDROBE_TEMPLATES[templateId]

            return {
              zones: template?.zones || [],
              totalHeight: height - plintHeight,
              doorType: (colWidth > 60 ? 'split' : 'single') as
                | 'split'
                | 'single',
              doorOpeningSide: urlLayout.doorOpeningSides[index],
              templateId,
              hasDoor: decoded.hasDoor, // Use decoded hasDoor state from URL
            }
          })
          setColumnConfigurations(newConfigs)

          // IMPORTANT: Set prevMirroredRef to current mirror state to prevent
          // the mirror effect from reversing configs on initial load
          prevMirroredRef.current = urlMirrored
        }
      }
      setUrlInitialized(true)
    }
  }, [router.isReady, urlCtx, urlInitialized, height, plintHeight])

  // Update column configurations when dimensions change
  useEffect(() => {
    // Skip if we haven't initialized from URL yet or haven't hydrated
    if (!urlInitialized || !hasHydratedRef.current) {
      return
    }

    const newLayout = calculateWardrobeColumnLayout(width, isMirrored)
    const prev = prevDimensionsRef.current

    // Check if we actually need to update (avoid calling setter unnecessarily)
    const columnCountChanged = prev.columnCount !== newLayout.columnCount
    const dimensionsChanged =
      prev.height !== height || prev.plintHeight !== plintHeight

    if (!columnCountChanged && !dimensionsChanged) {
      return // Don't even call setColumnConfigurations
    }

    // Update ref for next comparison
    prevDimensionsRef.current = {
      width,
      height,
      plintHeight,
      columnCount: newLayout.columnCount,
    }

    if (columnCountChanged) {
      // Reset configurations if column count changed
      setColumnConfigurations((prevConfigs) =>
        newLayout.columnWidths.map((colWidth, index) => {
          const existingConfig = prevConfigs[index]
          const existingTemplate = existingConfig?.templateId
          const existingHasDoor = existingConfig?.hasDoor ?? true // Preserve hasDoor state
          const defaultTemplateId =
            existingTemplate || 'FULL_HANGING_WITH_1_SHELF'
          const template = WARDROBE_TEMPLATES[defaultTemplateId]
          return {
            zones: template?.zones || [],
            totalHeight: height - plintHeight,
            doorType: colWidth > 60 ? 'split' : 'single',
            doorOpeningSide: newLayout.doorOpeningSides[index],
            templateId: defaultTemplateId,
            hasDoor: existingHasDoor, // Preserve existing hasDoor state
          }
        })
      )
    } else {
      // Just update dimensions, keep existing template selections
      setColumnConfigurations((prevConfigs) =>
        prevConfigs.map((config, index) => ({
          ...config,
          totalHeight: height - plintHeight,
          doorType: newLayout.columnWidths[index] > 60 ? 'split' : 'single',
          doorOpeningSide: newLayout.doorOpeningSides[index],
        }))
      )
    }
  }, [
    width,
    height,
    plintHeight,
    urlInitialized,
    columnLayout.columnCount,
    isMirrored,
  ])

  const templatesExtraCost = useMemo(() => {
    return columnConfigurations.reduce((sum, config) => {
      const template = WARDROBE_TEMPLATES[config.templateId || '']
      const extra = template?.extraCost ?? 0
      return sum + extra
    }, 0)
  }, [columnConfigurations])

  const price = useMemo(
    () =>
      calculateWardrobePrice({
        width,
        height,
        depth,
        doors: doorsNr,
        sectionsPrice: 0, // Gallery sections removed
        templatesExtraCost,
      }),
    [width, height, depth, doorsNr, templatesExtraCost]
  )

  return [
    {
      type: 'dimensions',
      widthRange: [40, 250],
      heightRange: [237, 280],
      depthRange: [35, 60],
      plintHeightRange: [2, 8],
      heightStep: 1,
      width,
      setWidth,
      height,
      setHeight,
      plintHeight,
      setPlintHeight,
      depth,
      setDepth,
    },
    {
      type: 'colors',
      colors: ['White', 'Biege', 'Light Grey', 'Grey'],
      selectedColor,
      setSelectedColor,
    },
    {
      type: 'wardrobeColumns',
      selectedColumns: columnLayout.columnCount,
      columnConfigurations,
      setColumnConfigurations: updateColumnConfigurations,
      columnWidths: columnLayout.columnWidths, // Pass array of all column widths
      columnWidth: columnLayout.columnWidths[0], // Keep for backwards compatibility
      columnHeight: height - plintHeight,
      columnDepth: depth,
      onMirrorToggle: toggleMirror,
      isMirrored, // Pass mirror state for 3D rendering
      doorOpeningSides: columnLayout.doorOpeningSides, // Pass calculated door opening sides
    } as unknown as ProductComponent,
    {
      type: 'furniture',
      openingOption,
      selectedOpeningMethod: openingOption, // same API as stand.ts
      hinges: '',
      setOpeningOption,
      guides,
      setGuides,
      is3DEnabled: true,
    },
    {
      type: 'price',
      price,
    },
  ]
}
