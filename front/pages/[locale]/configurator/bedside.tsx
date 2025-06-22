import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { BedsideProductConfigurator } from '~/components/ProductPage/productTypes/bedside'
import { ProductPage } from '~/components/ProductPage/BedsideProductPage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={BedsideProductConfigurator}
        name="homepage.configurator.bedside.title"
      />
    </ProductPageLayout>
  )
}

export default Product
