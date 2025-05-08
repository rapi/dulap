import { FC } from 'react'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'
import { ProductPage } from '~/components/ProductPage/OfficeTableProductPage'
import { OfficeTableConfiguration } from '~/components/ProductPage/productTypes/officeTable'
const Product: FC = () => {
  return (
    <ProductPageLayout>
      <ProductPage components={OfficeTableConfiguration} name="Masă de birou" />
    </ProductPageLayout>
  )
}

export default Product
