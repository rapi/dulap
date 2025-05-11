import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductStorage } from '~/components/ProductStorage/ProductStorage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductStorage />
    </ProductPageLayout>
  )
}

export default Product
