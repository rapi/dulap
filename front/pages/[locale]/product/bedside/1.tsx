import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/BedsideProductPage'
import { BedsideProductConfigurator } from '~/components/ProductPage/productTypes/bedside'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'

export const preview = {
  name: 'products.stand.1.name',
  link: '/product/stand/1',
  src: '/ready-products/bedside/800 bedside_2.png',
  dimensions: '80x30x40',
  color: 'White',
  price: 2800,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={BedsideProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/bedside/800 bedside_2.png'],
          gallery: ['/ready-products/bedside/800 bedside_2.png'],
          colors: preview.color,
          dimensions: {
            width: 80,
            height: 30,
            depth: 40,
            plintHeight: 2,
          },
          furniture: {
            openingType: OpeningType.Push,
            guides: 'homepage.configurator.fittings.guides.options.1',
          },
          price: preview.price,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
