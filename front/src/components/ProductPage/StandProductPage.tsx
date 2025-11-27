import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC, useState, useCallback, useRef, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'

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
  ProductColumns,
  ProductColumnsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductColumns'
import {
  ProductIndividualColumns,
  ProductIndividualColumnsComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductIndividualColumns'
import type { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'

import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/ProductFurniture'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'
import { ProductMetadataComponent } from '~/components/ProductPage/productTypeComponents/ProductMetadata'
import {
  ProductGallery,
  ProductGalleryComponent,
} from '~/components/ProductPage/productTypeComponents/ProductGallery'
import {
  ProductGalleryColors,
  ProductGalleryColorsConfig,
} from '~/components/ProductPage/productTypeComponents/ProductGalleryColors'

import { FurnitureViewer, FurnitureViewerRef } from '~/components/ThreeDModel/FurnitureViewer'
import { use3DFurnitureProps } from '~/hooks/use3DFurnitureProps'
import { useCart } from '~/context/cartContext'
import { Dimension } from '~/components/ProductListPage/products'
import { DEFAULT_STAND } from './productTypes/stand'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { productInfoBarContent } from '~/components/InfoBar/ProductInfoBarContent'

// Mobile section labels & order
import {
  NavSection,
  NAV_ORDER,
  SECTION_LABELS,
  isNavSection,
} from '~/components/ProductPage/productTypeComponents/sectionRegistry'

export type ProductComponent =
  | ProductGalleryComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductColumnsComponent
  | ProductIndividualColumnsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
  | ProductMetadataComponent
  | ProductGalleryColorsConfig

export type PredefinedValue = {
  sections?: number
  columns?: number
  gallery?: string[]
  imageSelect?: string
  imageCarousel?: string[]
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
  const deselectColumnRef = useRef<(() => void) | null>(null)
  const furnitureViewerRef = useRef<FurnitureViewerRef>(null)

  const currentComponents = components()
  const furniture3DProps = use3DFurnitureProps(
    currentComponents,
    values,
    DEFAULT_STAND,
    false, // isWardrobe = false
    'stand' // furnitureType
  )

  const priceComponent = currentComponents.find((c) => c.type === 'price') as
    | ProductPriceComponent
    | undefined

  const galleryColorsComp = currentComponents.find(
    (c) => c.type === 'galleryColors'
  ) as ProductGalleryColorsConfig | undefined

  const galleryComponent = currentComponents.find(
    (c) => c.type === 'gallery'
  ) as ProductGalleryComponent | undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const route =
    router.pathname.match(/^\/[^/]+\/product(\/.+?)\/[^/]+$/)?.[1] ?? ''
  const configuratorRoute = '/configurator' + route

  const handleColumnClick = useCallback((index: number | null) => {
    if (index !== null) {
      // Column clicked: update both activeTab and selectedColumn
      setActiveColumnTab(index)
      setSelectedColumnIndex(index)
    } else {
      // Background clicked: only deselect column, keep activeTab
      setSelectedColumnIndex(null)
    }
  }, [])
  const handleDeselectFunctionReady = useCallback((fn: () => void) => {
    deselectColumnRef.current = fn
  }, [])

  // ---------- DESKTOP renderer (unchanged stack) ----------
  const getComponent = (component: ProductComponent): React.ReactNode => {
    switch (component.type) {
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
      case 'columns':
        return (
          <ProductColumns
            configuration={component}
            predefinedValue={values?.columns ?? undefined}
            options={(component as ProductColumnsComponent).options}
          />
        )
      case 'individualColumns':
        return (
          <ProductIndividualColumns
            configuration={component}
            activeTab={activeColumnTab}
            onActiveTabChange={setActiveColumnTab}
            onActiveColumnChange={setSelectedColumnIndex}
          />
        )
      case 'select':
        return (
          <ProductSelect
            configuration={component}
            predefinedValue={values?.select ?? undefined}
          />
        )
      case 'furniture': {
        const furnitureConfig = {
          ...(component as ProductFurnitureComponent),
          is3DEnabled: true,
        }
        return (
          <ProductFurniture
            configuration={furnitureConfig}
            predefinedValue={values?.furniture ?? undefined}
          />
        )
      }
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
      case 'columns':
        return (
          <ProductColumns
            configuration={comp as ProductColumnsComponent}
            predefinedValue={values?.columns ?? undefined}
            options={(comp as ProductColumnsComponent).options}
          />
        )
      case 'individualColumns':
        return (
          <ProductIndividualColumns
            configuration={comp as ProductIndividualColumnsComponent}
            activeTab={activeColumnTab}
            onActiveTabChange={setActiveColumnTab}
            onActiveColumnChange={setSelectedColumnIndex}
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
        const furnitureConfig = {
          ...(comp as ProductFurnitureComponent),
          is3DEnabled: true,
        }
        return (
          <ProductFurniture
            configuration={furnitureConfig}
            predefinedValue={values?.furniture ?? undefined}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <>
      <div className={styles.contentContainer}>
        {/* Left: 3D Viewer */}
        <div className={styles.leftContainer}>
          <FurnitureViewer
            ref={furnitureViewerRef}
            {...furniture3DProps}
            selectedColumnIndex={selectedColumnIndex}
            onColumnClick={handleColumnClick}
            onDeselectFunctionReady={handleDeselectFunctionReady}
          />
        </div>

        {/* Right: details */}
        <div className={styles.detailsContainer}>
          <h1 className={styles.visuallyHiddenTitle}>
            <FormattedMessage id="meta.header.configurator.stand" />
          </h1>
          <h2 className={styles.title}>
            <FormattedMessage id={name} />
          </h2>

          <div className={styles.priceCont}>
            {priceComponent && (
              <ProductPrice
                onAddItem={() => {
                  // Capture screenshot before adding to cart
                  const screenshot = furnitureViewerRef.current?.captureScreenshot() || undefined
                  addItem('stand', currentComponents, { ...(values ?? {}), screenshot })
                }}
                configuration={priceComponent}
                predefinedValue={values?.price ?? undefined}
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
                      // pass the i18n id; ButtonSelect renders <FormattedMessage id="..." />
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

              {/* Always render colors component (hidden) so effects run and color changes apply immediately */}
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

      {/* Gallery */}
      <div>
        {galleryComponent && (
          <ProductGallery
            configuration={
              values?.gallery
                ? { type: 'gallery', images: values.gallery }
                : galleryComponent
            }
          />
        )}
      </div>
    </>
  )
}
