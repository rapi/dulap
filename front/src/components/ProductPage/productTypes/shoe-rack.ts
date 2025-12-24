import { ProductComponent } from '~/components/ProductPage/RackProductPage'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { colorHexCodes, ColorName } from '~/utils/colorDictionary'
import { RackColumnConfiguration } from '~/types/rackConfigurationTypes'
import { calculateRackColumnLayout } from '~/utils/rackColumnLayout'
import {
  SHOE_RACK_TEMPLATES,
  calculateShoeRackZonesFromTemplate,
  getValidShoeRackTemplates,
} from '~/config/shoeRackTemplates'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'
import {
  encodeRackColumnConfigs,
  decodeRackColumnConfigs,
} from '~/utils/rackColumnConfigUrl'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { calculateRackPrice } from '~/config/furnitureConstraints'

export const DEFAULT_SHOE_RACK = {
  width: 120,
  height: 80,
  depth: 35,
  plintHeight: 0, // Shoe racks have no plinth
  selectedColor: 'Biege Almond',
}

export const ShoeRackProductConfigurator: () => ProductComponent[] = () => {
  // Get URL context
  const urlCtx = useConfiguratorConfigOptional()
  const router = useRouter()

  const [width, setWidth] = useState(120)
  const [height, setHeight] = useState(80)
  const [depth, setDepth] = useState(35)
  const [plintHeight, setPlintHeight] = useState(0) // Shoe racks have no plinth
  const [selectedColor, setSelectedColor] = useState(
    colorHexCodes[ColorName.White]
  )

  // Column configuration state
  const columnLayout = useMemo(() => calculateRackColumnLayout(width), [width])

  // Initialize column configurations
  const [columnConfigurations, setColumnConfigurations] = useState<
    RackColumnConfiguration[]
  >(() => {
    // Default initialization with dynamic zone calculation
    return columnLayout.columnWidths.map(() => {
      const defaultTemplateId = 'OPEN_SHELVES_ONLY'
      const template = SHOE_RACK_TEMPLATES[defaultTemplateId]
      const calculatedZones = calculateShoeRackZonesFromTemplate(
        template,
        height - plintHeight
      )

      return {
        zones: calculatedZones,
        totalHeight: height - plintHeight,
        doors: template?.doors || [],
        templateId: defaultTemplateId,
      }
    })
  })

  // Track if we've initialized from URL
  const [urlInitialized, setUrlInitialized] = useState(false)
  const [guides, setGuides] = useState('standart')

  // Opening option
  const [openingOption, setOpeningOption] = useState<OpeningType>(() => {
    if (!urlCtx?.config.openingType) return OpeningType.Push
    if (urlCtx.config.openingType === 'profile') {
      return OpeningType.ProfileHandle
    }
    if (urlCtx.config.openingType === 'round') {
      return OpeningType.RoundHandle
    }
    return OpeningType.Push
  })

  // Track if initial render has happened (to prevent URL sync during initialization)
  const hasHydratedRef = useRef(false)

  // Track previous values to avoid unnecessary state updates
  const prevDimensionsRef = useRef({
    width: 120,
    height: 80,
    plintHeight: 2,
    columnCount: columnLayout.columnCount,
  })

  // Mark hydration as complete after first render
  useEffect(() => {
    hasHydratedRef.current = true
  }, [])

  // Sync local state with URL context changes (for dimensions ONLY)
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
    (configs: RackColumnConfiguration[]) => {
      setColumnConfigurations(configs)

      // Sync to URL via context
      if (urlCtx) {
        const encoded = encodeRackColumnConfigs(configs)
        urlCtx.setConfig({
          ...urlCtx.config,
          shoeRackCfg: encoded,
        })
      }
    },
    [urlCtx]
  )

  // Initialize from URL after component mounts
  useEffect(() => {
    if (!urlInitialized && router.isReady && urlCtx) {
      const shoeRackCfgStr = urlCtx.config.shoeRackCfg

      if (shoeRackCfgStr && typeof shoeRackCfgStr === 'string') {
        // Decode configurations from URL
        const templateIds = decodeRackColumnConfigs(shoeRackCfgStr)
        if (templateIds.length > 0) {
          // Calculate layout based on URL width, not current state width
          const urlWidth = urlCtx.config.width
          const urlLayout = calculateRackColumnLayout(urlWidth)

          const newConfigs = urlLayout.columnWidths.map((colWidth, index) => {
            const templateId = templateIds[index] || 'OPEN_SHELVES_ONLY'
            const template = SHOE_RACK_TEMPLATES[templateId]
            const calculatedZones = calculateShoeRackZonesFromTemplate(
              template,
              height - plintHeight
            )
            return {
              zones: calculatedZones,
              totalHeight: height - plintHeight,
              doors: template.doors || [],
              templateId,
            }
          })
          setColumnConfigurations(newConfigs)
        }
      }
      setUrlInitialized(true)
    }
  }, [router.isReady, urlCtx, urlInitialized, height, plintHeight])

  // Recalculate zones when height changes (height-dependent dynamic calculation)
  useEffect(() => {
    if (!urlInitialized || !hasHydratedRef.current) return

    const prev = prevDimensionsRef.current

    // Only recalculate if height or plintHeight changed (width handled separately)
    if (prev.height === height && prev.plintHeight === plintHeight) return

    const availableHeight = height - plintHeight
    const columnWidth = columnLayout.columnWidths[0] || 60 // Default to 60cm if not available

    // Get valid templates for new height
    const validTemplates = getValidShoeRackTemplates(
      columnWidth,
      availableHeight
    )
    const validTemplateIds = new Set(validTemplates.map((t) => t.id))

    // Recalculate all zones with new height and validate configurations
    setColumnConfigurations((prevConfigs) => {
      const updatedConfigs = prevConfigs.map((config) => {
        if (!config.templateId) return config

        const template = SHOE_RACK_TEMPLATES[config.templateId]
        if (!template) return config

        // Check if current template is valid for new height
        const isTemplateValid = validTemplateIds.has(config.templateId)

        if (!isTemplateValid) {
          // Template is no longer valid - switch to HALF_OPEN_HALF_CLOSED as fallback
          const fallbackTemplateId = 'HALF_OPEN_HALF_CLOSED'
          const fallbackTemplate = SHOE_RACK_TEMPLATES[fallbackTemplateId]

          if (fallbackTemplate) {
            const newZones = calculateShoeRackZonesFromTemplate(
              fallbackTemplate,
              availableHeight
            )

            return {
              zones: newZones,
              totalHeight: availableHeight,
              doors: fallbackTemplate.doors || [],
              templateId: fallbackTemplateId,
            }
          }
        }

        // Template is valid - just recalculate zones
        const newZones = calculateShoeRackZonesFromTemplate(
          template,
          availableHeight
        )

        return {
          ...config,
          zones: newZones,
          totalHeight: availableHeight,
        }
      })

      return updatedConfigs
    })

    // Update height in ref (width updated in other effect)
    prevDimensionsRef.current = { ...prev, height, plintHeight }
  }, [height, plintHeight, urlInitialized, columnLayout.columnWidths, urlCtx])

  // Sync column configurations to URL whenever they change
  useEffect(() => {
    if (!urlInitialized || !hasHydratedRef.current || !urlCtx) return

    const encoded = encodeRackColumnConfigs(columnConfigurations)
    const currentEncoded = urlCtx.config.shoeRackCfg

    // Only update if the configuration actually changed
    if (encoded !== currentEncoded) {
      urlCtx.setConfig({
        ...urlCtx.config,
        shoeRackCfg: encoded,
      })
    }
  }, [columnConfigurations, urlInitialized, urlCtx])

  // Update column configurations when dimensions change
  useEffect(() => {
    // Skip if we haven't initialized from URL yet or haven't hydrated
    if (!urlInitialized || !hasHydratedRef.current) {
      return
    }

    const newLayout = calculateRackColumnLayout(width)
    const prev = prevDimensionsRef.current

    // Check if we actually need to update (avoid calling setter unnecessarily)
    const columnCountChanged = prev.columnCount !== newLayout.columnCount

    if (!columnCountChanged) {
      return // Don't even call setColumnConfigurations
    }

    // Update ref for next comparison (only width and columnCount, height handled separately)
    prevDimensionsRef.current = {
      ...prev,
      width,
      columnCount: newLayout.columnCount,
    }

    if (columnCountChanged) {
      // Reset configurations if column count changed with dynamic zone calculation
      setColumnConfigurations((prevConfigs) =>
        newLayout.columnWidths.map((colWidth, index) => {
          const existingTemplate = prevConfigs[index]?.templateId
          const defaultTemplateId = existingTemplate || 'OPEN_SHELVES_ONLY'
          const template = SHOE_RACK_TEMPLATES[defaultTemplateId]
          const calculatedZones = calculateShoeRackZonesFromTemplate(
            template,
            height - plintHeight
          )
          return {
            zones: calculatedZones,
            totalHeight: height - plintHeight,
            doors: template.doors || [],
            templateId: defaultTemplateId,
          }
        })
      )
    }
    // Height changes are handled in separate useEffect above
  }, [width, height, plintHeight, urlInitialized, columnLayout.columnCount])

  const templatesExtraCost = useMemo(() => {
    return columnConfigurations.reduce((sum, config) => {
      const template = SHOE_RACK_TEMPLATES[config.templateId || '']
      const extra = template?.extraCost ?? 0
      return sum + extra
    }, 0)
  }, [columnConfigurations])

  const price = useMemo(
    () =>
      calculateRackPrice({
        width,
        height,
        depth,
        columns: columnLayout.columnCount,
        templatesExtraCost,
      }),
    [width, height, depth, columnLayout.columnCount, templatesExtraCost]
  )

  return [
    {
      type: 'dimensions',
      widthRange: [30, 300],
      heightRange: [30, 120],
      depthRange: [25, 50],
      plintHeightRange: [2, 8],
      heightStep: 1,
      depthStep: 5,
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
      type: 'rackColumns',
      selectedColumns: columnLayout.columnCount,
      columnConfigurations,
      setColumnConfigurations: updateColumnConfigurations,
      columnWidth: columnLayout.columnWidths[0],
      columnHeight: height - plintHeight,
      columnDepth: depth,
      furnitureType: 'shoe-rack', // Specify shoe-rack type
    } as unknown as ProductComponent,
    {
      type: 'furniture',
      openingOption,
      selectedOpeningMethod: openingOption,
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
