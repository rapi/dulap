import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'

export const preview = {
  name: 'products.wardrobe.2.name',
  link: '/product/wardrobe/2',
  // src: '/wardrobe/White/maner/Base 20/H2100/right/500-1.png',
  src: '/ready-products/wardrobe/500-1_2.png',
  dimensions: '50x210x50',
  color: '#fcfbf5',
  price: 3220,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name={preview.name}
        values={{
          imageCarousel: ['/ready-products/wardrobe/500-1_2.png'],
          colors: preview.color,
          dimensions: {
            width: 50,
            height: 210,
            depth: 50,
            plintHeight: 2,
          },
          furniture: {
            openingType: 'maner',
            hinges: 'homepage.configurator.fittings.hinges.options.2',
            guides: 'homepage.configurator.fittings.guides.options.2',
          },
          sections: {
            number: 1,
            mirror: 'nu',
            arrangement: [
              {
                src: '/wardrobe/filling/White/2100/1.png',
                width: 50,
                height: 210,
              },
            ],
            opening: [
              {
                src: '/wardrobe/opening-right.png',
                width: 50,
                height: 224,
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
