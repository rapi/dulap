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
          dimensions: '10x10x10x10',
          furniture: {
            openingType: 'maner',
            hinges: 'standard',
            guides: 'standard',
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
