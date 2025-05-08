import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/GreenWallProductPage'
import { GreenWallConfiguration } from '~/components/ProductPage/productTypes/greenwall'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={GreenWallConfiguration}
        name="Rafturi de depozitare pentru plante"
      />
    </ProductPageLayout>
  )
}

export default Product
