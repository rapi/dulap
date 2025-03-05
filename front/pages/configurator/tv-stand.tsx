import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductTVStand } from '~/components/ProductTVStand/ProductTVStand'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductTVStand />
    </ProductPageLayout>
  )
}

export default Product
