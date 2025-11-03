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
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/ProductSelect'
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
import type { ButtonOptionsType } from '~/components/ButtonSelect/ButtonSelect'
import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/stand/ProductFurniture'
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
import { DEFAULT_STAND } from './productTypes/stand'
import { InfoBar } from '~/components/InfoBar/InfoBar'
import { productInfoBarContent } from '~/components/InfoBar/ProductInfoBarContent'

export type ProductComponent =
  | ProductImageCarouselComponent
  | ProductGalleryComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductSectionsComponent
  | ProductColumnsComponent
  | ProductIndividualColumnsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
  | ProductMetadataComponent

export type PredefinedValue = {
  sections?: number
  columns?: number
  gallery?: string[]
  imageSelect?: string
  imageCarousel?: string[]
  dimensions?: Dimension
  colors?: string
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
        const compWithOpts = component as ProductSectionsComponent & {
          options?: ButtonOptionsType[]
        }
        return isStand3D ? null : (
          <ProductSections
            configuration={compWithOpts}
            predefinedValue={values?.sections ?? undefined}
            options={compWithOpts.options}
          />
        )
      case 'columns':
        return isStand3D ? (
          <ProductColumns
            configuration={component}
            predefinedValue={values?.columns ?? undefined}
            options={component.options}
          />
        ) : null
      case 'individualColumns':
        return isStand3D ? (
          <ProductIndividualColumns configuration={component} />
        ) : null
      case 'select':
        return (
          <ProductSelect
            configuration={component}
            predefinedValue={values?.select ?? undefined}
          />
        )
      case 'furniture':
        // Pass the is3DEnabled flag to furniture component
        const furnitureConfig = {
          ...component,
          is3DEnabled: isStand3D,
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

  const isStand3D = use3DVersion()

  // Extract all 3D props using shared hook
  const furniture3DProps = use3DFurnitureProps(
    currentComponents,
    values,
    DEFAULT_STAND
  )

  return (
    <>
      <div className={styles.contentContainer}>
        {/* Left Side: Viewer or Image Carousel */}
        <div className={styles.leftContainer}>
          {isStand3D ? (
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
            <FormattedMessage id="meta.header.configurator.stand" />
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
          {priceComponent && !isStand3D && (
            <ProductPrice
              onAddItem={() => {
                addItem('stand', currentComponents, values ?? {})
              }}
              configuration={priceComponent}
              predefinedValue={values?.price ?? undefined}
            />
          )}
          {values != null && !isStand3D && (
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
