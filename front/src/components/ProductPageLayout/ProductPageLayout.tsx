import React from 'react'
import styles from './ProductPageLayout.module.css'
import { Breadcrumb } from '~/components/Breadcrumb/Breadcrumb'
import ProductDescription from '~/components/ProductDescription/ProductDescription'
import { productTypes } from '~/components/ProductTypesList/productTypes'
import { useRouter } from 'next/router'
interface ProductPageLayoutProps {
  children: React.ReactNode
}
export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  children,
}) => {
  const router = useRouter()
  console.log(router.pathname)

  const strippedPath = router.pathname.replace('/[locale]', '')
  const productType = productTypes.find(({ link }) => link === strippedPath)
  console.log('test', productType)

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
          <ProductDescription productType={productType?.name || ''} />
        </div>
      </div>
    </>
  )
}
