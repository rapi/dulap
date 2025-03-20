import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/ProductPage'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={WardrobeProductConfiguration}
        name="Dulap pentru haine"
        images={[
          '/products/wardrobe-visualization/1.png',
          '/products/wardrobe-visualization/2.jpg',
          '/products/wardrobe-visualization/1.png',
        ]}
      />
    </ProductPageLayout>
  )
}

export default Product
