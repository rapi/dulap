import React from 'react'
import styles from './ProductPageLayout.module.css'
import { Breadcrumb } from '~/components/Breadcrumb/Breadcrumb'
import { productTypes } from '~/components/ProductListPage/productTypes'
import { useRouter } from 'next/router'
interface ProductPageLayoutProps {
  children: React.ReactNode
}
export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  children,
}) => {
  const router = useRouter()
  console.log(router.pathname) // Path without query params (e.g., "/about")

  const productType = productTypes.find(({ link }) => link === router.pathname)
  return (
    <div className={styles.container}>
      <Breadcrumb
        items={[
          { label: 'Category', link: '' },
          { label: 'subcategory', link: '/products' },
          ...(productType?.name ? [{ label: productType.name }] : []),
        ]}
      />
      <div className={styles.contentContainer}>{children}</div>
    </div>
  )
}
