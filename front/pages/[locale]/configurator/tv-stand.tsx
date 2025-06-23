import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { TVStandProductConfigurator } from '~/components/ProductPage/productTypes/TVstand'
import { ProductPage } from '~/components/ProductPage/TVStandProductPage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={TVStandProductConfigurator}
        name="homepage.products.TVstand"
      />
    </ProductPageLayout>
  )
}

export default Product
