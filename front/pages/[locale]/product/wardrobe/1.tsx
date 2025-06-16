import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/WardrobeProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'

export const preview = {
  name: 'products.wardrobe.1.name',
  link: '/product/wardrobe/2',
  src: '/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png',
  dimensions: '150x210x50',
  color: '#ded9d3',
  price: 5950,
}

const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name={preview.name}
        values={{
          imageCarousel: [
            '/wardrobe/Biege/maner/Base 60/H2100/right/1600-3.png',
          ],
          colors: preview.color,
          dimensions: {
            width: 150,
            height: 210,
            depth: 50,
            plintheight: 5
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
