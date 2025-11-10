import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC, useState, useCallback } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
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
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductFurniture'
import {
  ProductSectionPredefinedValue,
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/wardrobe/ProductSections'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/ProductImageCarousel'
import {
  ProductGallery,
  ProductGalleryComponent,
} from '~/components/ProductPage/productTypeComponents/ProductGallery'
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { use3DFurnitureProps } from '~/hooks/use3DFurnitureProps'
import { use3DVersion } from '~/hooks/use3DVersion'
import { DEFAULT_WARDROBE } from './productTypes/wardrobe'
import { FurnitureViewer } from '../ThreeDModel/FurnitureViewer'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { productInfoBarContent } from '~/components/InfoBar/ProductInfoBarContent'
import {
  ProductGalleryColors,
  ProductGalleryColorsConfig,
} from '~/components/ProductPage/productTypeComponents/ProductGalleryColors'

export type ProductComponent =
  | ProductImageSelectComponent
  | ProductImageCarouselComponent
  | ProductGalleryComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductSectionsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
  | ProductGalleryColorsConfig
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
}
interface ProductPageProps {
  components: () => ProductComponent[]
  name: string
  values?: PredefinedValue
}

export const ProductPage: FC<ProductPageProps> = ({
  components,
  name,
  values,
}) => {
  const { addItem } = useCart()
  const [activeColumnTab, setActiveColumnTab] = useState(0)
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null)

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
      case 'sections':
        return !isWardrobe3D ? (
          <ProductSections
            configuration={component}
            predefinedValue={values?.sections ?? undefined}
          />
        ) : null
      case 'furniture':
        return (
          <ProductFurniture
            configuration={component}
            predefinedValue={values?.furniture ?? undefined}
          />
        )
    }
  }

  const currentComponents = components()
  const priceComponent = currentComponents.find(
    (component) => component.type === 'price'
  )
  const imageCarouselComponent = currentComponents.find(
    (component) => component.type === 'imageCarousel'
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

  const router = useRouter()
  const route =
    router.pathname.match(/^\/[^/]+\/product(\/.+?)\/[^/]+$/)?.[1] ?? ''
  const configuratorRoute = '/configurator' + route

  const isWardrobe3D = use3DVersion()

  // Extract all 3D props using shared hook (wardrobe uses automatic column layout)
  const furniture3DProps = use3DFurnitureProps(
    currentComponents,
    values,
    DEFAULT_WARDROBE,
    true, // isWardrobe = true (enables automatic column layout)
    'wardrobe' // furnitureType
  )

  // Handle column click from 3D viewer to update active tab
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

  return (
    <>
      <div className={styles.contentContainer}>
        {/* Left Side: Viewer or Image Carousel */}
        <div className={styles.leftContainer}>
          {isWardrobe3D ? (
            <FurnitureViewer
              {...furniture3DProps}
              selectedColumnIndex={selectedColumnIndex}
              onColumnClick={handleColumnClick}
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
            <FormattedMessage id="meta.header.configurator.wardrobe" />
          </h1>
          <h2 className={styles.title}>
            <FormattedMessage id={name} />
          </h2>
          {priceComponent && (
            <ProductPrice
              onAddItem={() => {
                addItem('wardrobe', currentComponents, values ?? {})
              }}
              configuration={priceComponent}
              predefinedValue={values?.price ?? undefined}
            />
          )}
          {currentComponents.map((component, index) => {
            return (
              <div key={index + component.type}>{getComponent(component)}</div>
            )
          })}
        </div>
        <div>
          {values != null && !isWardrobe3D && (
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
