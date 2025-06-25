import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/StandProductPage'
import { StandProductConfigurator } from '~/components/ProductPage/productTypes/stand'

export const preview = {
  name: 'products.stand.1.name',
  link: '/product/stand/1',
  src: '/stand/Biege/push/Base 20/H700/S4/800.png',
  dimensions: '90x70x40',
  color: '#ded9d3',
  price: 5640,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={StandProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: [
            '/stand/Biege/push/Base 20/H700/S4/800.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 150,
            height: 210,
            depth: 50,
            plintHeight: 5
          },
          furniture: {
            openingType: 'maner',
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
