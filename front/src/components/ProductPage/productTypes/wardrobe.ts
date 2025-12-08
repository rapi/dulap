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

  // Column configuration state
  const columnLayout = useMemo(
    () => calculateWardrobeColumnLayout(width),
    [width]
  )

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
  
  // Track previous values to avoid unnecessary state updates
  const prevDimensionsRef = useRef({ width: 200, height: 260, plintHeight: 2, columnCount: columnLayout.columnCount })

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

  // Initialize from URL after component mounts
  useEffect(() => {
    if (!urlInitialized && router.isReady && urlCtx) {
      const wardrobeCfgStr = urlCtx.config.wardrobeCfg

      if (wardrobeCfgStr && typeof wardrobeCfgStr === 'string') {
        // Decode configurations from URL
        const templateIds = decodeWardrobeColumnConfigs(wardrobeCfgStr)
        if (templateIds.length > 0) {
          // Calculate layout based on URL width, not current state width
          const urlWidth = urlCtx.config.width
          const urlLayout = calculateWardrobeColumnLayout(urlWidth)

          const newConfigs = urlLayout.columnWidths.map((colWidth, index) => {
            const templateId = templateIds[index] || 'FULL_HANGING_WITH_1_SHELF'
            const template = WARDROBE_TEMPLATES[templateId]
            return {
              zones: template?.zones || [],
              totalHeight: height - plintHeight,
              doorType: (colWidth > 60 ? 'split' : 'single') as
                | 'split'
                | 'single',
              doorOpeningSide: urlLayout.doorOpeningSides[index],
              templateId,
            }
          })
          setColumnConfigurations(newConfigs)
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

    const newLayout = calculateWardrobeColumnLayout(width)
    const prev = prevDimensionsRef.current
    
    // Check if we actually need to update (avoid calling setter unnecessarily)
    const columnCountChanged = prev.columnCount !== newLayout.columnCount
    const dimensionsChanged = prev.height !== height || prev.plintHeight !== plintHeight
    
    if (!columnCountChanged && !dimensionsChanged) {
      return // Don't even call setColumnConfigurations
    }
    
    // Update ref for next comparison
    prevDimensionsRef.current = { width, height, plintHeight, columnCount: newLayout.columnCount }

    if (columnCountChanged) {
      // Reset configurations if column count changed
      setColumnConfigurations((prevConfigs) => 
        newLayout.columnWidths.map((colWidth, index) => {
          const existingTemplate = prevConfigs[index]?.templateId
          const defaultTemplateId =
            existingTemplate || 'FULL_HANGING_WITH_1_SHELF'
          const template = WARDROBE_TEMPLATES[defaultTemplateId]
          return {
            zones: template?.zones || [],
            totalHeight: height - plintHeight,
            doorType: colWidth > 60 ? 'split' : 'single',
            doorOpeningSide: newLayout.doorOpeningSides[index],
            templateId: defaultTemplateId,
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
  }, [width, height, plintHeight, urlInitialized, columnLayout.columnCount])

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
      heightRange: [237, 270],
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
      columnWidth: columnLayout.columnWidths[0], // Will be dynamic per column in future
      columnHeight: height - plintHeight,
      columnDepth: depth,
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
