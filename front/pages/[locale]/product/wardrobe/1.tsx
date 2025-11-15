import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfigurator } from '~/components/ProductPage/productTypes/wardrobe'

export const preview = {
  name: 'products.wardrobe.1.name',
  link: '/product/wardrobe/2',
  // src: '/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png',
  src: '/ready-products/wardrobe/1600-3_2.png',
  dimensions: '150x210x50',
  color: 'Biege',
  price: 8530,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfigurator}
        name={preview.name}
        values={{
          imageCarousel: [
            // '/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png',
            '/ready-products/wardrobe/1600-3_2.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 150,
            height: 210,
            depth: 50,
            plintHeight: 5,
          },
          furniture: {
            openingType: 'maner',
            hinges: 'homepage.configurator.fittings.hinges.options.1',
            guides: 'homepage.configurator.fittings.guides.options.1',
          },
          sections: {
            number: 2,
            mirror: 'nu',
            arrangement: [
              {
                src: '/wardrobe/filling/Biege/2100/1.png',
                width: 100,
                height: 210,
              },
              {
                src: '/wardrobe/filling/Biege/2100/1.png',
                width: 50,
                height: 210,
              },
            ],
            opening: [
              {
                src: '/wardrobe/opening-double.png',
                width: 100,
                height: 224,
              },
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
