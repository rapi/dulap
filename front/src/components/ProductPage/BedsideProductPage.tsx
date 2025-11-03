import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import { useEffect } from 'react'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductColors'
import {
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductSections'
import {
  ProductColumns,
  ProductColumnsComponent,
} from '~/components/ProductPage/productTypeComponents/ProductColumns'
import {
  ProductIndividualColumns,
  ProductIndividualColumnsComponent,
} from '~/components/ProductPage/productTypeComponents/stand/ProductIndividualColumns'
import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/bedside/ProductFurniture'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/ProductPrice'
import { ProductMetadataComponent } from '~/components/ProductPage/productTypeComponents/ProductMetadata'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
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
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { useRouter } from 'next/router'
import { DEFAULT_BEDSIDE } from './productTypes/bedside'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { productInfoBarContent } from '~/components/InfoBar/ProductInfoBarContent'

export type ProductComponent =
  | ProductImageCarouselComponent
  | ProductGalleryComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSectionsComponent
  | ProductColumnsComponent
  | ProductIndividualColumnsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
  | ProductMetadataComponent
export type PredefinedValue = {
  sections?: number
  columns?: number
  imageCarousel?: string[]
  gallery?: string[]
  dimensions?: Dimension
  colors?: string
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
  const isBedside3D = use3DVersion()

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
      case 'sections':
        return isBedside3D ? null : (
          <ProductSections
            configuration={component}
            predefinedValue={values?.sections ?? undefined}
          />
        )
      case 'columns':
        return isBedside3D ? (
          <ProductColumns
            configuration={component}
            predefinedValue={values?.columns ?? undefined}
            options={component.options}
          />
        ) : null
      case 'individualColumns':
        return isBedside3D ? (
          <ProductIndividualColumns configuration={component} />
        ) : null
      case 'furniture':
        const furnitureConfig = {
          ...component,
          is3DEnabled: isBedside3D,
        }
        return (
          <ProductFurniture
            configuration={furnitureConfig}
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
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const route =
    router.pathname.match(/^\/[^/]+\/product(\/.+?)\/[^/]+$/)?.[1] ?? ''
  const configuratorRoute = '/configurator' + route

  // Extract all 3D props using shared hook
  const furniture3DProps = use3DFurnitureProps(
    currentComponents,
    values,
    DEFAULT_BEDSIDE
  )

  return (
    <>
      <div className={styles.contentContainer}>
        {/* Left Side: Viewer or Image Carousel */}
        <div className={styles.leftContainer}>
          {isBedside3D ? (
            <FurnitureViewer {...furniture3DProps} />
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
          {currentComponents.map((component, index) => {
            return (
              <div key={index + component.type}>{getComponent(component)}</div>
            )
          })}
        </div>
        <div>
          {priceComponent && !isBedside3D && (
            <ProductPrice
              onAddItem={() => {
                addItem('bedside', currentComponents, values ?? {})
              }}
              configuration={priceComponent}
              predefinedValue={values?.price ?? undefined}
            />
          )}
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
