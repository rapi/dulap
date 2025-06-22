import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { TVStandProductConfigurator } from '~/components/ProductPage/productTypes/TVstand'
import { ProductPage } from '~/components/ProductPage/TVStandProductPage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={TVStandProductConfigurator}
        name="homepage.configurator.stand.title"
      />
    </ProductPageLayout>
  )
}

export default Product
