import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/ProductPage'
import { storageProductConfiguration } from '~/components/ProductPage/productTypes/storage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        images={[
          '/storage/1x1.svg',
          '/storage/2x1.svg',
          '/storage/3x1.svg',
          '/storage/1x2.svg',
          '/storage/2x2.svg',
          '/storage/3x2.svg',
        ]}
        components={storageProductConfiguration}
        name="Comodă"
      />
    </ProductPageLayout>
  )
}

export default Product
