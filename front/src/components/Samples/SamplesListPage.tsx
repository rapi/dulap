import { FormattedMessage } from 'react-intl'
import { SampleCatalog } from '~/components/Samples/SampleCatalog'
import { samples } from '~/components/Samples/samples'
import classes from './SamplesListPage.module.css'

export const SamplesListPage: React.FC = () => {
  return (
    <>
      <div className={classes.productListContainer}>
        <h2 className={classes.title}>
          <FormattedMessage id="samples.title" />
          <br></br>
          <br></br>
          <FormattedMessage id="samples.subtitle" />
        </h2>

        <div className={classes.readyProducts}>
          <SampleCatalog samples={samples}></SampleCatalog>
        </div>
      </div>
    </>
  )
}
