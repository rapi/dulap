import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'

export const preview = {
  name: 'products.wardrobe.3.name',
  link: '/product/wardrobe/4',
  src: '/wardrobe/Grey/maner/Base 60/H2400/right/2000-4.png',
  dimensions: '200x240x50',
  color: '#9c9c9c',
  price: 11700,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name={preview.name}
        values={{
          imageCarousel: [
            '/wardrobe/Grey/maner/Base 60/H2400/right/2000-4.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 200,
            height: 240,
            depth: 50,
            plintheight: 6
          },
          furniture: {
            openingType: 'maner',
            hinges: 'homepage.configurator.fittings.hinges.options.2',
            guides: 'homepage.configurator.fittings.guides.options.2',
          },
          sections: {
            number: 2,
            mirror: 'nu',
            arrangement: [
              {
                src: '/wardrobe/filling/Grey/2400/1.png',
                width: 100,
                height: 240,
              },
              {
                src: '/wardrobe/filling/Grey/2400/1.png',
                width: 100,
                height: 240,
              },
            ],
            opening: [
              {
                src: '/wardrobe/opening-double.png',
                width: 100,
                height: 254,
              },
              {
                src: '/wardrobe/opening-double.png',
                width: 100,
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
