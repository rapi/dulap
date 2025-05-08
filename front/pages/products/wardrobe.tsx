import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductWardrobe } from '~/components/ProductWardrobe/ProductWardrobe'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductWardrobe />
    </ProductPageLayout>
  )
}

export default Product
