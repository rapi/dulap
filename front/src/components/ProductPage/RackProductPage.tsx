import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC, useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { useMediaQuery } from '@mui/material'
import {
  ProductImageSelect,
  ProductImageSelectComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductImageSelect'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductColors'
import {
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/ProductSelect'
import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/ProductFurniture'
import {
  ProductSectionPredefinedValue,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSections'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'
import {
  ProductGallery,
  ProductGalleryComponent,
} from '~/components/ProductPage/productTypeComponents/ProductGallery'
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { use3DFurnitureProps } from '~/hooks/use3DFurnitureProps'
import { DEFAULT_RACK } from './productTypes/rack'
import { FurnitureViewer, FurnitureViewerRef } from '../ThreeDModel/FurnitureViewer'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { productInfoBarContent } from '~/components/InfoBar/ProductInfoBarContent'
import {
  ProductGalleryColors,
  ProductGalleryColorsConfig,
} from '~/components/ProductPage/productTypeComponents/ProductGalleryColors'
import { useConfiguratorConfigOptional } from '~/context/urlConfigContext'
import {
  ProductRackColumns,
  ProductRackColumnsComponent,
} from '~/components/ProductPage/productTypeComponents/rack/ProductRackColumns'
import type { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import {
  NavSection,
  NAV_ORDER,
  SECTION_LABELS,
  isNavSection,
} from '~/components/ProductPage/productTypeComponents/sectionRegistry'

export type ProductComponent =
  | ProductImageSelectComponent
  | ProductGalleryComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
  | ProductGalleryColorsConfig
  | ProductRackColumnsComponent
export type PredefinedValue = {
  sections?: ProductSectionPredefinedValue
  imageSelect?: string
  imageCarousel?: string[]
  gallery?: string[]
  dimensions?: Dimension
  colors?: string
  galleryColors?: string
  select?: string
  furniture?: ProductFurniturePredefinedValue
  price?: number
  screenshot?: string
}
interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
  values?: PredefinedValue
}

// Helpers
const filterNavigable = (components: ProductComponent[]) =>
  components.filter((c): c is Extract<ProductComponent, { type: NavSection }> =>
    isNavSection(c.type as string)
  )

export const ProductPage: FC<ProductPageProps> = ({
  components,
  name,
  values,
}) => {
  const { addItem } = useCart()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [activeColumnTab, setActiveColumnTab] = useState(0)
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null)
  const furnitureViewerRef = useRef<FurnitureViewerRef>(null)
  
  // Get current config for share functionality
  const urlConfigCtx = useConfiguratorConfigOptional()

  // Handle tab change from UI to update 3D selection
  const handleTabChange = useCallback((index: number) => {
    setActiveColumnTab(index)
    setSelectedColumnIndex(index)
  }, [])

  const currentComponents = components()

  // ---------- DESKTOP renderer (unchanged stack) ----------
  const getComponent = (component: ProductComponent): React.ReactNode => {
    switch (component.type) {
      case 'imageSelect':
        return (
          <ProductImageSelect
            configuration={component}
            predefinedValue={values?.imageSelect ?? undefined}
          />
        )
      case 'dimensions':
        return (
          <ProductDimensions
            configuration={component}
            predefinedValue={values?.dimensions ?? undefined}
          />
        )
      case 'colors':
        return (
          <ProductColors
            configuration={component}
            predefinedValue={values?.colors ?? undefined}
          />
        )
      case 'select':
        return (
          <ProductSelect
            configuration={component}
            predefinedValue={values?.select ?? undefined}
          />
        )
      case 'furniture':
        return (
          <ProductFurniture
            configuration={component}
            predefinedValue={values?.furniture ?? undefined}
          />
        )
      case 'rackColumns':
        return (
          <ProductRackColumns
            configuration={component}
            activeColumnIndex={activeColumnTab}
            onActiveColumnChange={handleTabChange}
          />
        )
      default:
        return null
    }
  }

  // ---------- MOBILE: chips + core-only panel ----------
  // Build available sections (present + valid for current mode)
  const navComponents = filterNavigable(currentComponents)
    .sort(
      (a, b) =>
        NAV_ORDER.indexOf(a.type as NavSection) -
        NAV_ORDER.indexOf(b.type as NavSection)
    )

  const [activeSection, setActiveSection] = useState<NavSection | null>(
    navComponents[0]?.type ?? null
  )

  // Update activeSection when navComponents changes
  useEffect(() => {
    if (navComponents.length > 0) {
      const currentActive = navComponents.find((c) => c.type === activeSection)
      if (!currentActive) {
        setActiveSection(navComponents[0]?.type ?? null)
      }
    } else {
      setActiveSection(null)
    }
  }, [navComponents, activeSection])

  // Automatically select column when entering rackColumns tab
  useEffect(() => {
    if (activeSection === 'rackColumns') {
      setSelectedColumnIndex((prevIndex) => {
        if (prevIndex === null) {
          setActiveColumnTab(0)
          return 0
        } else {
          setActiveColumnTab(prevIndex)
          return prevIndex
        }
      })
    } else if (activeSection === 'furniture') {
      setSelectedColumnIndex(null)
    }
  }, [activeSection])

  const renderCore = (type: NavSection) => {
    const comp = currentComponents.find((c) => c.type === type)
    if (!comp) return null

    switch (type) {
      case 'dimensions':
        return (
          <ProductDimensions
            configuration={comp as ProductDimensionsComponent}
            predefinedValue={values?.dimensions ?? undefined}
          />
        )
      case 'colors':
        return (
          <ProductColors
            configuration={comp as ProductColorsComponent}
            predefinedValue={values?.colors ?? undefined}
          />
        )
      case 'rackColumns':
        return (
          <ProductRackColumns
            configuration={comp as ProductRackColumnsComponent}
            activeColumnIndex={activeColumnTab}
            onActiveColumnChange={handleTabChange}
          />
        )
      case 'select':
        return (
          <ProductSelect
            configuration={comp as ProductSelectComponent}
            predefinedValue={values?.select ?? undefined}
          />
        )
      case 'furniture': {
        return (
          <ProductFurniture
            configuration={comp as ProductFurnitureComponent}
            predefinedValue={values?.furniture ?? undefined}
          />
        )
      }
      default:
        return null
    }
  }

  const priceComponent = currentComponents.find(
    (component) => component.type === 'price'
  )
  const galleryComponent = currentComponents.find(
    (component) => component.type === 'gallery'
  )
  const galleryColorsComp = currentComponents.find(
    (c) => c.type === 'galleryColors'
  ) as ProductGalleryColorsConfig | undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Extract all 3D props using shared hook (rack uses automatic column layout)
  const furniture3DProps = use3DFurnitureProps(
    currentComponents,
    values,
    DEFAULT_RACK,
    true, // isWardrobe = true (enables automatic column layout)
    'rack' // furnitureType
  )

  // Handle column click from 3D viewer to update active tab
  const handleColumnClick = useCallback((index: number | null) => {
    if (index !== null) {
      setActiveColumnTab(index)
      setSelectedColumnIndex(index)
    } else {
      setSelectedColumnIndex(null)
    }
  }, [])

  return (
    <>
      <div className={styles.contentContainer}>
        {/* Left Side: 3D Viewer */}
        <div className={styles.leftContainer}>
          <FurnitureViewer
            ref={furnitureViewerRef}
            {...furniture3DProps}
            selectedColumnIndex={selectedColumnIndex}
            onColumnClick={handleColumnClick}
          />
        </div>
        {/* Right Side: Product Details */}
        <div className={styles.detailsContainer}>
          <h1 className={styles.visuallyHiddenTitle}>
            <FormattedMessage id="meta.header.configurator.rack" />
          </h1>
          <h2 className={styles.title}>
            <FormattedMessage id={name} />
          </h2>
          <div className={styles.priceCont}>
            {priceComponent && (
              <ProductPrice
                onAddItem={() => {
                  const screenshot = furnitureViewerRef.current?.captureScreenshot() || undefined
                  addItem('rack', currentComponents, { ...(values ?? {}), screenshot })
                }}
                configuration={priceComponent}
                predefinedValue={values?.price ?? undefined}
                shareConfig={urlConfigCtx?.config}
                shareProduct="rack"
              />
            )}
          </div>

          {/* MOBILE: chips + core */}
          {isMobile && activeSection && navComponents.length > 0 ? (
            <>
              <div className={styles.mobileNavChips}>
                <ButtonSelect<NavSection>
                  options={
                    navComponents.map((c) => ({
                      value: c.type as NavSection,
                      label: SECTION_LABELS[c.type as NavSection].id,
                    })) as ButtonOptionsType<NavSection>[]
                  }
                  defaultSelected={activeSection}
                  size="medium"
                  className={styles.mobileNavChipsRow}
                  onChange={(val) => setActiveSection(val as NavSection)}
                />
              </div>

              <div className={styles.mobileCorePanel}>
                {renderCore(activeSection)}
              </div>

              {/* Always render colors component (hidden) so effects run */}
              {(() => {
                const colorsComponent = navComponents.find((c) => c.type === 'colors')
                if (colorsComponent && colorsComponent.type !== activeSection) {
                  return (
                    <div key="colors-hidden" style={{ display: 'none' }}>
                      {renderCore('colors')}
                    </div>
                  )
                }
                return null
              })()}
            </>
          ) : (
            // DESKTOP: original stacked layout
            currentComponents.map((component, index) => (
              <div key={index + component.type}>{getComponent(component)}</div>
            ))
          )}
        </div>
      </div>
      <br />
      <br />
      <br />
      <InfoBar items={productInfoBarContent} />
      <br />
      <br />
      <br />
      {galleryColorsComp && (
        <div className={styles.galleryColorContainer}>
          <ProductGalleryColors
            configuration={galleryColorsComp}
            predefinedValue={values?.galleryColors ?? undefined}
          />
        </div>
      )}
      <div>
        {galleryComponent && (
          <ProductGallery
            configuration={
              values?.gallery
                ? {
                    type: 'gallery',
                    images: values.gallery,
                  }
                : galleryComponent
            }
          />
        )}
      </div>
    </>
  )
}
