import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/TVStandProductPage'
import { TVStandProductConfigurator } from '~/components/ProductPage/productTypes/TVstand'

export const preview = {
  name: 'products.stand.2.name',
  link: '/product/stand/2',
  src: '/tv-stand/Light Grey/maner/Base 60/H400/1600-2.png',
  dimensions: '150x45x40',
  color: '#d6d6d6',
  price: 5100,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={TVStandProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: [
            '/stand/Biege/push/Base 20/H700/S4/800.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 150,
            height: 45,
            depth: 40,
            plintHeight: 6
          },
          furniture: {
            openingType: 'maner',
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
