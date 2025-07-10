import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/TVStandProductPage'
import { TVStandProductConfigurator } from '~/components/ProductPage/productTypes/TVstand'

export const preview = {
  name: 'products.stand.1.name',
  link: '/product/stand/1',
  // src: '/tv-stand/Grey/push/Base 20/H300/2000-4.png',
  src: '/ready-products/tv-stand/2000-4 tv-stand_2.png',
  dimensions: '200x35x40',
  color: '#9c9c9c',
  price: 7900,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={TVStandProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/tv-stand/2000-4 tv-stand_2.png'],
          colors: preview.color,
          dimensions: {
            width: 200,
            height: 35,
            depth: 40,
            plintHeight: 2,
          },
          furniture: {
            openingType: 'push',
            hinges: 'homepage.configurator.fittings.hinges.options.1',
            guides: 'homepage.configurator.fittings.guides.options.1',
          },
          sections: 4,
          price: preview.price,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
