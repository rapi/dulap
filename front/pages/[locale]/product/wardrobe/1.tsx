import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name="Dulap pentru haine"
        values={{
          imageCarousel: ['/wardrobe/filling/Biege/2100/1.png'],
          colors: 'black',
          dimensions: '160x210x50x5',
          furniture: {
            openingType: 'maner',
            hinges: 'homepage.configurator.fittings.hinges.options.2',
            guides: 'homepage.configurator.fittings.guides.options.2',
          },
          sections: {
            number: 3,
            mirror: 'standard',
            arrangement: [
              '/wardrobe/filling/Biege/2100/1.png',
              '/wardrobe/filling/Biege/2100/1.png',
              '/wardrobe/filling/Biege/2100/1.png',
            ],
          },
        }}
      />
    </ProductPageLayout>
  )
}

export default Product
