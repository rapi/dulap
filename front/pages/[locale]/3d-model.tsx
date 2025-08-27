import { FC } from 'react'
import { ThreeDModel } from '~/components/ThreeDModel/ThreeDModel'
import { ProductPageLayout } from '~/components/ProductPageLayout/ProductPageLayout'

const ThreeDModelPage: FC = () => {
  return (
    <ProductPageLayout>
      <ThreeDModel />
    </ProductPageLayout>
  )
}

export default ThreeDModelPage 