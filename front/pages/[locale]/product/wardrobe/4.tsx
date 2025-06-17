import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'

export const preview = {
  name: 'products.wardrobe.4.name',
  link: '/product/wardrobe/4',
  src: '/wardrobe/Light Grey/push/Base 20/H2400/right/2500-5.png',
  dimensions: '240x260x50',
  color: '#d6d6d6',
  price: 13600,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name={preview.name}
        values={{
          imageCarousel: [
            '/wardrobe/Light Grey/push/Base 20/H2400/right/2500-5.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 240,
            height: 260,
            depth: 50,
            plintHeight: 5
          },
          furniture: {
            openingType: 'push',
            hinges: 'homepage.configurator.fittings.hinges.options.2',
            guides: 'homepage.configurator.fittings.guides.options.2',
          },
          sections: {
            number: 3,
            mirror: 'nu',
            arrangement: [
              {
                src: '/wardrobe/filling/Light Grey/2100/1.png',
                width: 96,
                height: 224,
              },
              {
                src: '/wardrobe/filling/Light Grey/2100/1.png',
                width: 96,
                height: 224,
              },
              {
                src: '/wardrobe/filling/Light Grey/2100/1.png',
                width: 48,
                height: 224,
              },
            ],
            opening: [
              {
                src: '/wardrobe/opening-double.png',
                width: 96,
                height: 254,
              },
              {
                src: '/wardrobe/opening-double.png',
                width: 96,
                height: 254,
              },
              {
                src: '/wardrobe/opening-right.png',
                width: 48,
                height: 254,
              },
            ],
          },
          price: preview.price,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
