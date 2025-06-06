import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name="Dulap pentru haine 150cm"
        values={{
          imageCarousel: ['/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png'],
          colors: 'Biege',
          dimensions: '150x210x50x5',
          furniture: {
            openingType: 'maner',
            hinges: 'homepage.configurator.fittings.hinges.options.2',
            guides: 'homepage.configurator.fittings.guides.options.2',
          },
          sections: {
            number: 2,
            mirror: 'standard',
            arrangement: [
              {
                src: '/wardrobe/filling/Biege/2100/1.png',
                width: 100,
                height: 224,
              },
              {
                src: '/wardrobe/filling/Biege/2100/1.png',
                width: 50,
                height: 224,
              }
            ],
            opening: [
              {
                src: '/wardrobe/opening-left.png',
                width: 50,
                height: 224,
              },
              {
                src: '/wardrobe/opening-right.png',
                width: 50,
                height: 224,
              },
              {
                src: '/wardrobe/opening-right.png',
                width: 50,
                height: 224,
              }
            ]
          },
          price: 1000,
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
