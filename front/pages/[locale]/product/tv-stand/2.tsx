import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/TVStandProductPage'
import { TVStandProductConfigurator } from '~/components/ProductPage/productTypes/TVstand'
import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'

export const preview = {
  name: 'products.stand.2.name',
  link: '/product/stand/2',
  src: '/ready-products/tv-stand/1600-2_2.png',
  dimensions: '150x45x40',
  color: 'Light Grey',
  price: 5100,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={TVStandProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/tv-stand/1600-2_2.png'],
          colors: preview.color,
          dimensions: {
            width: 150,
            height: 45,
            depth: 40,
            plintHeight: 6,
          },
          furniture: {
            openingType: OpeningType.RoundHandle,
            hinges: 'homepage.configurator.fittings.hinges.options.1',
            guides: 'homepage.configurator.fittings.guides.options.1',
          },
          sections: 2,
          price: preview.price,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
