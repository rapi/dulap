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
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/ProductImageCarousel'
import {
  ProductGallery,
  ProductGalleryComponent,
} from '~/components/ProductPage/productTypeComponents/ProductGallery'
import { FurnitureViewer } from '~/components/ThreeDModel/FurnitureViewer'
import { use3DVersion } from '~/hooks/use3DVersion'
import { use3DFurnitureProps } from '~/hooks/use3DFurnitureProps'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { DEFAULT_BEDSIDE } from './productTypes/bedside'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { productInfoBarContent } from '~/components/InfoBar/ProductInfoBarContent'
import {
  ProductGalleryColors,
  ProductGalleryColorsConfig,
} from '~/components/ProductPage/productTypeComponents/ProductGalleryColors'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'

// Mobile section labels & order
import {
  NavSection,
  NAV_ORDER,
  SECTION_LABELS,
  isNavSection,
} from '~/components/ProductPage/productTypeComponents/sectionRegistry'

export type ProductComponent =
  | ProductImageCarouselComponent
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
  columns?: number
  imageCarousel?: string[]
  gallery?: string[]
  dimensions?: Dimension
  colors?: string
  galleryColors?: string
  select?: string
  furniture?: ProductFurniturePredefinedValue
  price?: number
}

interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
  values?: PredefinedValue
}

// Helpers – same style as stand/tv-stand
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
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(
    null
  )
  const deselectColumnRef = useRef<(() => void) | null>(null)

  const currentComponents = components()
  const isBedside3D = use3DVersion()

  // 3D props
  const furniture3DProps = use3DFurnitureProps(
    currentComponents,
    values,
    DEFAULT_BEDSIDE
  )

  const priceComponent = currentComponents.find(
    (component) => component.type === 'price'
  ) as ProductPriceComponent | undefined

  const imageCarouselComponent = currentComponents.find(
    (component) => component.type === 'imageCarousel'
  ) as ProductImageCarouselComponent | undefined

  const galleryColorsComp = currentComponents.find(
    (c) => c.type === 'galleryColors'
  ) as ProductGalleryColorsConfig | undefined

  const galleryComponent = currentComponents.find(
    (component) => component.type === 'gallery'
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
      setActiveColumnTab(index)
      setSelectedColumnIndex(index)
    } else {
      setSelectedColumnIndex(null)
    }
  }, [])

  const handleDeselectFunctionReady = useCallback((deselectFn: () => void) => {
    deselectColumnRef.current = deselectFn
  }, [])

  // ---------- DESKTOP renderer ----------
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
        return isBedside3D ? (
          <ProductColumns
            configuration={component}
            predefinedValue={values?.columns ?? undefined}
            options={(component as ProductColumnsComponent).options}
          />
        ) : null
      case 'individualColumns':
        return isBedside3D ? (
          <ProductIndividualColumns
            configuration={component}
            activeTab={activeColumnTab}
            onActiveTabChange={setActiveColumnTab}
            onActiveColumnChange={setSelectedColumnIndex}
          />
        ) : null
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
          is3DEnabled: isBedside3D,
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
  const navComponents = filterNavigable(currentComponents)
    .filter((c) => {
      if (
        (c.type === 'columns' || c.type === 'individualColumns') &&
        !isBedside3D
      )
        return false
      // bedside uses no 'sections' at all
      return true
    })
    .sort(
      (a, b) =>
        NAV_ORDER.indexOf(a.type as NavSection) -
        NAV_ORDER.indexOf(b.type as NavSection)
    )

  const [activeSection, setActiveSection] = useState<NavSection | null>(
    navComponents[0]?.type ?? null
  )

  // keep activeSection valid when navComponents changes
  useEffect(() => {
    if (navComponents.length > 0) {
      const stillExists = navComponents.find((c) => c.type === activeSection)
      if (!stillExists) {
        setActiveSection(navComponents[0]?.type ?? null)
      }
    } else {
      setActiveSection(null)
    }
  }, [navComponents, activeSection])

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
        return isBedside3D ? (
          <ProductColumns
            configuration={comp as ProductColumnsComponent}
            predefinedValue={values?.columns ?? undefined}
            options={(comp as ProductColumnsComponent).options}
          />
        ) : null
      case 'individualColumns':
        return isBedside3D ? (
          <ProductIndividualColumns
            configuration={comp as ProductIndividualColumnsComponent}
            activeTab={activeColumnTab}
            onActiveTabChange={setActiveColumnTab}
            onActiveColumnChange={setSelectedColumnIndex}
          />
        ) : null
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
          is3DEnabled: isBedside3D,
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
        {/* Left Side: Viewer or Image Carousel */}
        <div className={styles.leftContainer}>
          {isBedside3D ? (
            <FurnitureViewer
              {...furniture3DProps}
              selectedColumnIndex={selectedColumnIndex}
              onColumnClick={handleColumnClick}
              onDeselectFunctionReady={handleDeselectFunctionReady}
            />
          ) : (
            imageCarouselComponent && (
              <ProductImageCarousel
                configuration={
                  values?.imageCarousel
                    ? {
                        type: 'imageCarousel',
                        images: values.imageCarousel,
                      }
                    : imageCarouselComponent
                }
              />
            )
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className={styles.detailsContainer}>
          <h1 className={styles.visuallyHiddenTitle}>
            <FormattedMessage id="meta.header.configurator.bedside" />
          </h1>
          <h2 className={styles.title}>
            <FormattedMessage id={name} />
          </h2>
          <div className={styles.priceCont}>
            {priceComponent && (
              <ProductPrice
                onAddItem={() => {
                  // bedside is still treated as 'stand' in cart, same as before
                  addItem('stand', currentComponents, values ?? {})
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
                      // ButtonSelect renders <FormattedMessage id="..." /> from label
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

              {/* Always render colors component (hidden) so effects run immediately */}
              {(() => {
                const colorsComponent = navComponents.find(
                  (c) => c.type === 'colors'
                )
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
            // DESKTOP: stacked layout
            currentComponents.map((component, index) => (
              <div key={index + component.type}>{getComponent(component)}</div>
            ))
          )}
        </div>

        <div>
          {values != null && !isBedside3D && (
            <ProductConfiguratorInfo linkConfigurator={configuratorRoute} />
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
            // If values.galleryColors is provided, this becomes read-only chip
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
