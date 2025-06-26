import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/BedsideProductPage'
import { BedsideProductConfigurator } from '~/components/ProductPage/productTypes/bedside'

export const preview = {
  name: 'products.stand.1.name',
  link: '/product/stand/1',
  src: '/bedside/Biege/push/Base 20/H300/800.png',
  dimensions: '80x30x40',
  color: '#d6d6d6',
  price: 2800,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={BedsideProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: [
            '/bedside/Biege/push/Base 20/H300/800.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 80,
            height: 30,
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
