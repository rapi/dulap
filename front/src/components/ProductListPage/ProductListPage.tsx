import styles from './ProductListPage.module.css'
import { FormattedMessage } from 'react-intl'
import { ProductTypesList } from '~/components/ProductTypesList/ProductTypesList'

import { ProductCatalog } from '~/components/ProductCatalog/ProductCatalog'

export const ProductListPage: React.FC = () => {
  return (
    <>
      <div className={styles.productListContainer}>
        <h3 className={styles.title}>
          <FormattedMessage id="homepage.productListPage.title.1" />
        </h3>

        <ProductTypesList></ProductTypesList>

        <p className={styles.title}>
          <FormattedMessage id="homepage.productListPage.title.2" />
          <br></br>
          <br></br>
          <FormattedMessage id="homepage.productListPage.title.3" />
        </p>

        <div className={styles.readyProducts}>
          <ProductCatalog></ProductCatalog>
        </div>
      </div>
    </>
  )
}
