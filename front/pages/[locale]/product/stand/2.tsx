import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/StandProductPage'
import { StandProductConfigurator } from '~/components/ProductPage/productTypes/stand'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'

export const preview = {
  name: 'products.stand.2.name',
  link: '/product/stand/2',
  src: '/ready-products/stand/600 stand_2.png',
  dimensions: '50x110x40',
  color: 'White',
  price: 4050,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={StandProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/stand/600 stand_2.png'],
          colors: preview.color,
          dimensions: {
            width: 50,
            height: 110,
            depth: 40,
            plintHeight: 2,
          },
          furniture: {
            openingType: OpeningType.RoundHandle,
            hinges: 'homepage.configurator.fittings.hinges.options.1',
            guides: 'homepage.configurator.fittings.guides.options.1',
          },
          sections: 3,
          price: preview.price,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
