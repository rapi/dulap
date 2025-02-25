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
    <>
      <Breadcrumb
        items={[
          { label: 'Home', link: '' },
          { label: 'Lista Produselor', link: '/products' },
          ...(productType ? [{ label: productType.name }] : []),
        ]}
      />
      <div className={styles.container}>{children}</div>
    </>
  )
}
