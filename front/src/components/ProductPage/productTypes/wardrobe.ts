import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { ImageOptionProps } from '~/components/ImageSelect/ImageSelect'
import {
  openingMap,
  widthMap,
  imageWidthMap,
} from '~/components/ProductPage/productTypes/wardrobeMap'
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

export type MainImageParams = {
  imageWidth: number
  imageSections: number
}

const SECTION_VALUE: Record<number, number> = {
  1: 150,
  2: 1350,
  3: 2550,
  4: 400,
  5: 2700,
  6: 0,
}

const GUIDES_NR: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 0,
  5: 4,
  6: 0,
}

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
    return columnLayout.columnWidths.map((colWidth) => {
      const defaultTemplateId = 'FULL_HANGING_WITH_1_SHELF'
      const template = WARDROBE_TEMPLATES[defaultTemplateId]
      return {
        zones: template?.zones || [],
        totalHeight: height - plintHeight,
        doorType: colWidth > 60 ? 'split' : 'single',
        doorOpeningSide: colWidth <= 60 ? 'right' : undefined,
        templateId: defaultTemplateId,
      }
    })
  })

  // Track if we've initialized from URL
  const [urlInitialized, setUrlInitialized] = useState(false)
  const [imageSide, setImageSide] = useState('right')
  const [imageWidth, setImageWidth] = useState(50)
  const [imageHeight, setImageHeight] = useState(2100)
  const [imageSections, setImageSections] = useState(1)
  const [imagePlintHeight, setImagePlintHeight] = useState(20)
  const [imageColor, setImageColor] = useState('Biege Almond')
  const [guides, setGuides] = useState('standart')
  const [selectedMaxSections, setSelectedMaxSections] = useState(1)
  const [selectedMirrorOption, setSelectedMirrorOption] = useState('standard')

  // Opening option should behave like in StandProductConfigurator
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

  const [activeSections, setActiveSections] = useState<ImageOptionProps[]>([])
  const [activeOpening, setActiveOpening] = useState<ImageOptionProps[]>([])
  const [maxSections, setMaxSections] = useState(5)
  const [minSections, setMinSections] = useState(1)
  const [selectedSections, setSelectedSections] = useState<ImageOptionProps[]>(
    []
  )
  const [doorsNr, setDoorsNr] = useState(3)

  // --- NEW: independent gallery color + who changed last ---
  const [galleryColor, setGalleryColor] = useState<string>('Biege Almond')
  const [galleryImageColor, setGalleryImageColor] = useState<string>('Biege Almond')
  const [lastColorChanged, setLastColorChanged] = useState<'main' | 'gallery'>(
    'main'
  )
  // ---------------------------------------------------------

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
            const templateId = templateIds[index] || (colWidth > 60 ? 'SHELVES_ONLY' : 'FULL_HANGING_WITH_1_SHELF')
            const template = WARDROBE_TEMPLATES[templateId]
            return {
              zones: template?.zones || [],
              totalHeight: height - plintHeight,
              doorType: (colWidth > 60 ? 'split' : 'single') as
                | 'split'
                | 'single',
              doorOpeningSide: (colWidth <= 60 ? 'right' : undefined) as
                | 'left'
                | 'right'
                | undefined,
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
    // Skip if we haven't initialized from URL yet
    if (!urlInitialized) return

    const newLayout = calculateWardrobeColumnLayout(width)

    setColumnConfigurations((prev) => {
      // Preserve configurations if column count hasn't changed
      if (prev.length === newLayout.columnCount) {
        // Keep existing template selections, just update dimensions
        return prev.map((config, index) => ({
          ...config,
          totalHeight: height - plintHeight,
          doorType: newLayout.columnWidths[index] > 60 ? 'split' : 'single',
          doorOpeningSide:
            newLayout.columnWidths[index] <= 60 ? 'right' : undefined,
        }))
      }

      // Reset configurations if column count changed
      return newLayout.columnWidths.map((colWidth, index) => {
        // Try to preserve existing template if index exists
        const existingTemplate = prev[index]?.templateId
        const defaultTemplateId =
          existingTemplate || (colWidth > 60 ? 'SHELVES_ONLY' : 'FULL_HANGING_WITH_1_SHELF')
        const template = WARDROBE_TEMPLATES[defaultTemplateId]
        return {
          zones: template?.zones || [],
          totalHeight: height - plintHeight,
          doorType: colWidth > 60 ? 'split' : 'single',
          doorOpeningSide: colWidth <= 60 ? 'right' : undefined,
          templateId: defaultTemplateId,
        }
      })
    })
  }, [width, height, plintHeight, urlInitialized])

  useEffect(() => {
    setSelectedSections((prev) => {
      const newLen = activeSections.length
      if (newLen > prev.length)
        return [...prev, ...activeSections.slice(prev.length)]
      if (newLen < prev.length) return prev.slice(0, newLen)
      return prev
    })
  }, [activeSections])

  useEffect(() => {
    setSelectedSections((prev) =>
      prev.map((item, i) => ({
        ...item,
        width: activeSections[i]?.width ?? item.width,
        height: activeSections[i]?.height ?? item.height,
      }))
    )
  }, [activeSections])

  useEffect(() => {
    for (const map of imageWidthMap) {
      if (width <= map.maxWidth) {
        const [{ imageWidth: w, imageSections: s }] =
          map.imageParams(selectedMaxSections)
        setImageWidth(w)
        setImageSections(s)
        break
      }
    }
  }, [width, selectedMaxSections])

  useEffect(() => {
    if (height <= 210) {
      setImageHeight(2100)
    } else setImageHeight(2400)
  }, [height])

  useEffect(() => {
    setDepth(depth)
  }, [depth])

  useEffect(() => {
    setGuides(guides)
  }, [guides])

  // Main color -> image folder key
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

  // Gallery color -> image folder key (independent)
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

  // Keep gallery picker visually in sync with main color until user changes gallery explicitly
  useEffect(() => {
    if (lastColorChanged === 'main') {
      setGalleryColor(selectedColor)
    }
  }, [selectedColor, lastColorChanged])

  // Build active sections based on current main color
  useEffect(() => {
    for (const map of widthMap) {
      if (width <= map.maxWidth) {
        setMinSections(map.minSections)
        setMaxSections(map.maxSections)
        const newActiveSections = map
          .activeSections(width, height, selectedMaxSections)
          .map((section) => ({
            src: `/wardrobe/filling/${imageColor}/${imageHeight}/${section.src}`,
            width: section.width,
            height: section.height,
          }))
        setActiveSections(newActiveSections)
        break
      }
    }
  }, [width, height, selectedMaxSections, imageColor, imageHeight])

  useEffect(() => {
    for (const map of openingMap) {
      if (width <= map.maxWidth) {
        setActiveOpening(map.activeOpening(width, height, selectedMaxSections))
        break
      }
    }
  }, [width, height, selectedMaxSections])

  useEffect(() => {
    let newDoors: number

    if (width <= 60) {
      newDoors = 1
    } else if (width <= 100) {
      newDoors = 2
    } else if (width <= 150) {
      newDoors = width < 120 ? 2 : 3
    } else if (width < 200) {
      newDoors = selectedMaxSections === 2 ? 4 : 3
    } else if (width === 200) {
      newDoors = selectedMaxSections === 2 ? 4 : 5
    } else {
      newDoors = selectedMaxSections === 3 ? 5 : 4
    }
    setDoorsNr(newDoors)
  }, [width, selectedMaxSections])

  const sectionsPrice = useMemo(() => {
    return selectedSections.reduce((sum, { src }) => {
      const m = src.match(/(\d+)(?=\.\w+$)/)
      return m ? sum + (SECTION_VALUE[Number(m[1])] ?? 0) : sum
    }, 0)
  }, [selectedSections])

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
        sectionsPrice,
        templatesExtraCost,
      }),
    [width, height, depth, doorsNr, sectionsPrice, templatesExtraCost]
  )

  useEffect(() => {
    if (selectedMirrorOption === 'standard') {
      setImageSide('right')
    } else setImageSide('left')
  }, [selectedMirrorOption])

  const recolor = (items: ImageOptionProps[]) =>
    items.map(({ src, width: w, height: h }) => {
      const suffix = src.substring(src.lastIndexOf('/') + 1)
      return {
        src: `/wardrobe/filling/${imageColor}/${imageHeight}/${suffix}`,
        width: w,
        height: h,
      }
    })

  const recoloredSelectedSections = useMemo(
    () => recolor(selectedSections),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSections, imageColor, imageHeight]
  )

  useEffect(() => {
    if (plintHeight >= 2 && plintHeight < 5) {
      setImagePlintHeight(20)
    } else {
      setImagePlintHeight(60)
    }
  }, [plintHeight])

  // Choose last changed color for gallery visuals
  const activeGalleryImageColor = useMemo(
    () => (lastColorChanged === 'gallery' ? galleryImageColor : imageColor),
    [lastColorChanged, galleryImageColor, imageColor]
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
      setSelectedColor: (v: string) => {
        setSelectedColor(v)
        setLastColorChanged('main')
      },
    },
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
      type: 'wardrobeColumns',
      selectedColumns: columnLayout.columnCount,
      columnConfigurations,
      setColumnConfigurations: updateColumnConfigurations,
      columnWidth: columnLayout.columnWidths[0], // Will be dynamic per column in future
      columnHeight: height - plintHeight,
      columnDepth: depth,
    } as unknown as ProductComponent,
    {
      type: 'price',
      price,
    },
    // Expose independent gallery color control (if your ProductPage renders it)
    {
      type: 'galleryColors',
      colors: ['White', 'Biege', 'Light Grey', 'Grey'],
      selectedColor: galleryColor,
      setSelectedColor: (v: string) => {
        setGalleryColor(v)
        setLastColorChanged('gallery')
      },
    } as unknown as ProductComponent,
    {
      type: 'gallery',
      images: [
        `/wardrobe/renders/render-wardrobe-1-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-2-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-1-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-2-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-1-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-2-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-1-${activeGalleryImageColor}.png`,
        `/wardrobe/renders/render-wardrobe-2-${activeGalleryImageColor}.png`,
      ],
    },
  ]
}
