import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductStand } from '~/components/ProductStand/ProductStand'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductStand />
    </ProductPageLayout>
  )
}

export default Product
