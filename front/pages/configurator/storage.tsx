import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/ProductPage'
import { StorageProductConfiguration } from '~/components/ProductPage/productTypes/storage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage components={StorageProductConfiguration} name="Comodă" />
    </ProductPageLayout>
  )
}

export default Product
