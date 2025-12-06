import { ProductComponent } from '~/components/ProductPage/BookcaseProductPage'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { colorHexCodes, ColorName } from '~/utils/colorDictionary'
import { BookcaseColumnConfiguration } from '~/types/bookcaseConfigurationTypes'
import { calculateBookcaseColumnLayout } from '~/utils/bookcaseColumnLayout'
import { BOOKCASE_TEMPLATES, calculateZonesFromTemplate } from '~/config/bookcaseTemplates'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'
import {
  encodeBookcaseColumnConfigs,
  decodeBookcaseColumnConfigs,
} from '~/utils/bookcaseColumnConfigUrl'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'
import { calculateBookcasePrice } from '~/config/furnitureConstraints'

export const DEFAULT_BOOKCASE = {
  width: 120,
  height: 200,
  depth: 35,
  plintHeight: 0, // Bookcases have no plinth
  selectedColor: 'Biege Almond',
}

export const BookcaseProductConfigurator: () => ProductComponent[] = () => {
  // Get URL context
  const urlCtx = useConfiguratorConfigOptional()
  const router = useRouter()

  const [width, setWidth] = useState(120)
  const [height, setHeight] = useState(200)
  const [depth, setDepth] = useState(35)
  const [plintHeight, setPlintHeight] = useState(0) // Bookcases have no plinth
  const [selectedColor, setSelectedColor] = useState(
    colorHexCodes[ColorName.White]
  )

  // Column configuration state
  const columnLayout = useMemo(
    () => calculateBookcaseColumnLayout(width),
    [width]
  )

  // Initialize column configurations
  const [columnConfigurations, setColumnConfigurations] = useState<
    BookcaseColumnConfiguration[]
  >(() => {
    // Default initialization with dynamic zone calculation
    return columnLayout.columnWidths.map(() => {
      const defaultTemplateId = 'OPEN_SHELVES_ONLY'
      const template = BOOKCASE_TEMPLATES[defaultTemplateId]
      const calculatedZones = calculateZonesFromTemplate(
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
  const prevDimensionsRef = useRef({ width: 120, height: 200, plintHeight: 2, columnCount: columnLayout.columnCount })

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
    (configs: BookcaseColumnConfiguration[]) => {
      setColumnConfigurations(configs)

      // Sync to URL via context
      if (urlCtx) {
        const encoded = encodeBookcaseColumnConfigs(configs)
        urlCtx.setConfig({
          ...urlCtx.config,
          bookcaseCfg: encoded,
        })
      }
    },
    [urlCtx]
  )

  // Initialize from URL after component mounts
  useEffect(() => {
    if (!urlInitialized && router.isReady && urlCtx) {
      const bookcaseCfgStr = urlCtx.config.bookcaseCfg

      if (bookcaseCfgStr && typeof bookcaseCfgStr === 'string') {
        // Decode configurations from URL
        const templateIds = decodeBookcaseColumnConfigs(bookcaseCfgStr)
        if (templateIds.length > 0) {
          // Calculate layout based on URL width, not current state width
          const urlWidth = urlCtx.config.width
          const urlLayout = calculateBookcaseColumnLayout(urlWidth)

          const newConfigs = urlLayout.columnWidths.map((colWidth, index) => {
            const templateId = templateIds[index] || 'OPEN_SHELVES_ONLY'
            const template = BOOKCASE_TEMPLATES[templateId]
            const calculatedZones = calculateZonesFromTemplate(
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
    
    // Recalculate all zones with new height
    setColumnConfigurations((prevConfigs) =>
      prevConfigs.map((config) => {
        if (!config.templateId) return config
        
        const template = BOOKCASE_TEMPLATES[config.templateId]
        if (!template) return config
        
        const newZones = calculateZonesFromTemplate(
          template,
          height - plintHeight
        )
        
        return {
          ...config,
          zones: newZones,
          totalHeight: height - plintHeight,
        }
      })
    )
    
    // Update height in ref (width updated in other effect)
    prevDimensionsRef.current = { ...prev, height, plintHeight }
  }, [height, plintHeight, urlInitialized])

  // Update column configurations when dimensions change
  useEffect(() => {
    // Skip if we haven't initialized from URL yet or haven't hydrated
    if (!urlInitialized || !hasHydratedRef.current) {
      return
    }

    const newLayout = calculateBookcaseColumnLayout(width)
    const prev = prevDimensionsRef.current
    
    // Check if we actually need to update (avoid calling setter unnecessarily)
    const columnCountChanged = prev.columnCount !== newLayout.columnCount
    
    if (!columnCountChanged) {
      return // Don't even call setColumnConfigurations
    }
    
    // Update ref for next comparison (only width and columnCount, height handled separately)
    prevDimensionsRef.current = { ...prev, width, columnCount: newLayout.columnCount }

    if (columnCountChanged) {
      // Reset configurations if column count changed with dynamic zone calculation
      setColumnConfigurations((prevConfigs) => 
        newLayout.columnWidths.map((colWidth, index) => {
          const existingTemplate = prevConfigs[index]?.templateId
          const defaultTemplateId =
            existingTemplate || 'OPEN_SHELVES_ONLY'
          const template = BOOKCASE_TEMPLATES[defaultTemplateId]
          const calculatedZones = calculateZonesFromTemplate(
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
      const template = BOOKCASE_TEMPLATES[config.templateId || '']
      const extra = template?.extraCost ?? 0
      return sum + extra
    }, 0)
  }, [columnConfigurations])

  const price = useMemo(
    () =>
      calculateBookcasePrice({
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
      widthRange: [40, 250],
      heightRange: [80, 270],
      depthRange: [25, 65],
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
      type: 'bookcaseColumns',
      selectedColumns: columnLayout.columnCount,
      columnConfigurations,
      setColumnConfigurations: updateColumnConfigurations,
      columnWidth: columnLayout.columnWidths[0],
      columnHeight: height - plintHeight,
      columnDepth: depth,
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
