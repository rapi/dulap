import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/BedsideProductPage'
import { BedsideProductConfigurator } from '~/components/ProductPage/productTypes/bedside'

export const preview = {
  name: 'products.stand.1.name',
  link: '/product/stand/1',
  src: '/bedside/White/maner/Base 20/H400/600.png',
  dimensions: '60x50x40',
  color: '#d6d6d6',
  price: 3180,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={BedsideProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: [
            '/bedside/White/maner/Base 20/H400/600.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 60,
            height: 50,
            depth: 40,
            plintHeight: 2
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
