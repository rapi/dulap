import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import { useEffect } from 'react'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/bedside/ProductDimensions'
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
import { ProductInfobox } from '~/components/ProductPage/productTypeComponents/ProductInfobox'
import { ProductHelpBox } from '~/components/ProductPage/productTypeComponents/ProductHelpBox'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/bedside/ProductImageCarousel'
import { FurnitureViewer } from '~/components/ThreeDModel/FurnitureViewer'
import { use3DVersion } from '~/hooks/use3DVersion'
import { use3DFurnitureProps } from '~/hooks/use3DFurnitureProps'
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { useRouter } from 'next/router'
import { DEFAULT_BEDSIDE } from './productTypes/bedside'

export type ProductComponent =
  | ProductImageCarouselComponent
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
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'colors':
        return (
          <ProductColors
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'columns':
        return isBedside3D ? (
          <ProductColumns
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
            options={component.options}
          />
        ) : null
      case 'individualColumns':
        return isBedside3D ? (
          <ProductIndividualColumns
            configuration={component}
          />
        ) : null
      case 'furniture':
        const furnitureConfig = {
          ...component,
          is3DEnabled: isBedside3D
        }
        return (
          <ProductFurniture
            configuration={furnitureConfig}
            predefinedValue={values?.[component.type] ?? undefined}
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
        <h3 className={styles.title}>
          <FormattedMessage id={name} />
        </h3>
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
        {values != null && (
          <ProductConfiguratorInfo linkConfigurator={configuratorRoute} />
        )}
        {/* Hiding it for now, have to fix the styles */}
        {!isBedside3D && 
          <><ProductHelpBox /><ProductInfobox /></>
        }
      </div>
    </>
  )
}
