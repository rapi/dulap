import styles from './ProductListPage.module.css'
import { FormattedMessage } from 'react-intl'
import { ProductTypesList } from '~/components/ProductTypesList/ProductTypesList'

import { ProductCatalog } from '~/components/ProductCatalog/ProductCatalog'

export const ProductListPage: React.FC = () => {
  return (
    <>
      <div className={styles.productListContainer}>
        <h1 className={styles.visuallyHiddenTitle}>
          <FormattedMessage id="meta.header.products" />
        </h1>
        <h2 className={styles.title}>
          <FormattedMessage id="homepage.productListPage.title.1" />
        </h2>

        <ProductTypesList></ProductTypesList>

        <h2 className={styles.title}>
          <FormattedMessage id="homepage.productListPage.title.2" />
          <br></br>
          <br></br>
          <FormattedMessage id="homepage.productListPage.title.3" />
        </h2>

        <div className={styles.readyProducts}>
          <ProductCatalog></ProductCatalog>
        </div>
      </div>
    </>
  )
}
