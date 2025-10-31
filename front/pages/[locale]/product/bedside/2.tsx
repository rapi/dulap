import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/BedsideProductPage'
import { BedsideProductConfigurator } from '~/components/ProductPage/productTypes/bedside'

export const preview = {
  name: 'products.bedside.1.name',
  link: '/product/bedside/1',
  src: '/ready-products/bedside/600 bedside_2.png',
  dimensions: '60x50x40',
  color: 'White',
  price: 3180,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={BedsideProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/bedside/600 bedside_2.png'],
          gallery: ['/ready-products/bedside/600 bedside_2.png'],
          colors: preview.color,
          dimensions: {
            width: 60,
            height: 50,
            depth: 40,
            plintHeight: 2,
          },
          furniture: {
            openingType: 'push',
            guides: 'homepage.configurator.fittings.guides.options.1',
          },
          price: preview.price,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
