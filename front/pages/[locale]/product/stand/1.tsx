import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/StandProductPage'
import { StandProductConfigurator } from '~/components/ProductPage/productTypes/stand'

export const preview = {
  name: 'products.stand.1.name',
  link: '/product/stand/1',
  src: '/ready-products/stand/800 stand_2.png',
  dimensions: '90x70x40',
  color: 'Biege',
  price: 5640,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={StandProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/stand/800 stand_2.png'],
          colors: preview.color,
          dimensions: {
            width: 90,
            height: 70,
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
