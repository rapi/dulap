import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { StandProductConfigurator } from '~/components/ProductPage/productTypes/stand'
import { ProductPage } from '~/components/ProductPage/StandProductPage'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage
        components={StandProductConfigurator}
        name="homepage.configurator.stand.title"
      />
    </ProductPageLayout>
  )
}

export default Product
