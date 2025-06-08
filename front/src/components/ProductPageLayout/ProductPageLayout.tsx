import React from 'react'
import styles from './ProductPageLayout.module.css'
import { Breadcrumb } from '~/components/Breadcrumb/Breadcrumb'
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
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb
          items={[
            { label: 'homepage.configurator.breadcrumb.1', link: '/' },
            { label: 'homepage.configurator.breadcrumb.2', link: '/products' },
            ...(productType
              ? [{ label: productType.name, link: 'strippedPath' }]
              : []),
          ]}
        />
      </div>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  )
}
