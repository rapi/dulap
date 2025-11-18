import React from 'react'
import styles from './ProductPageLayout.module.css'
import { Breadcrumb } from '~/components/Breadcrumb/Breadcrumb'
import { DevStand3DToggle } from '~/components/DevStand3DToggle/DevStand3DToggle'
import ProductDescription from '~/components/ProductDescription/ProductDescription'
import { productTypes } from '~/components/ProductTypesList/productTypes'
import { useRouter } from 'next/router'
import { ProductDescriptionDetails } from '~/components/ProductDescription/ProductDescriptionDetails'
interface ProductPageLayoutProps {
  children: React.ReactNode
  showBreadcrumbs?: boolean
}
export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  children,
}) => {
  const router = useRouter()

  const strippedPath = router.pathname.replace('/[locale]', '')
  const productType = productTypes.find(({ link }) => link === strippedPath)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb
            items={[
              { label: 'homepage.configurator.breadcrumb.1', link: '/' },
              {
                label: 'homepage.configurator.breadcrumb.2',
                link: '/products',
              },
              ...(productType
                ? [{ label: productType.name, link: strippedPath }]
                : []),
            ]}
          />
        </div>
        <div>{children}</div>
      </div>
      <br />
      <br />
      <br />
      <div className={styles.productDescriptionContainer}>
        <div className={styles.productDescriptionContent}>
          <ProductDescription
            sections={ProductDescriptionDetails}
            heading={'productPage.details.title'}
          />
        </div>
      </div>
      <DevStand3DToggle />
    </>
  )
}
