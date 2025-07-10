import styles from '../ProductPageLayout/ProductPageLayout.module.css'
import React, { FC } from 'react'
import { useEffect } from 'react'
import {
  ProductDimensions,
  ProductDimensionsComponent,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductDimensions'
import {
  ProductColors,
  ProductColorsComponent,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductColors'
import {
  ProductSelect,
  ProductSelectComponent,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductSelect'
import {
  ProductSections,
  ProductSectionsComponent,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductSections'
import {
  ProductFurniture,
  ProductFurnitureComponent,
  ProductFurniturePredefinedValue,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductFurniture'
import {
  ProductPrice,
  ProductPriceComponent,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductPrice'
import { ProductConfiguratorInfo } from '~/components/ProductPage/productTypeComponents/ProductConfiguratorInfo'
import { ProductInfobox } from '~/components/ProductPage/productTypeComponents/ProductInfobox'
import {
  ProductImageCarousel,
  ProductImageCarouselComponent,
} from '~/components/ProductPage/productTypeComponents/TVstand/ProductImageCarousel'
import { FormattedMessage } from 'react-intl'
import { useCart } from '~/context/cartContext'
import { Dimension } from '../ProductListPage/products'
import { useRouter } from 'next/router'

export type ProductComponent =
  | ProductImageCarouselComponent
  | ProductDimensionsComponent
  | ProductColorsComponent
  | ProductSelectComponent
  | ProductSectionsComponent
  | ProductFurnitureComponent
  | ProductPriceComponent
export type PredefinedValue = {
  sections?: number
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
      case 'sections':
        return (
          <ProductSections
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'select':
        return (
          <ProductSelect
            configuration={component}
            predefinedValue={values?.[component.type] ?? undefined}
          />
        )
      case 'furniture':
        return (
          <ProductFurniture
            configuration={component}
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

  return (
    <>
      {/* Left Side: Image */}
      <div className={styles.leftContainer}>
        {imageCarouselComponent && (
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
        )}
      </div>
      {/* Right Side: Product Details */}
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>
          <FormattedMessage id={name} />
        </h1>
        {currentComponents.map((component, index) => {
          return (
            <div key={index + component.type}>{getComponent(component)}</div>
          )
        })}
      </div>
      <div>
        {priceComponent && (
          <ProductPrice
            onAddItem={() => {
              addItem('tv-stand', currentComponents, values ?? {})
            }}
            configuration={priceComponent}
            predefinedValue={values?.price ?? undefined}
          />
        )}
        {values != null && (
          <ProductConfiguratorInfo linkConfigurator={configuratorRoute} />
        )}
        <ProductInfobox />
      </div>
    </>
  )
}
