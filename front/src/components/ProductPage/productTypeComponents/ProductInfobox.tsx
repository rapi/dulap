import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import HandymanIcon from '@mui/icons-material/Handyman';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
export const ProductInfobox = () => {
  return (
    <div className={styles.infoboxContainer}>
      <div className={styles.infoboxTitle}>
        <AutoGraphIcon color='action'/>
        <p><FormattedMessage id="configurator.infobox.quality.title" defaultMessage="Цена и Качество"/></p>
      </div>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="configurator.infobox.quality.1" defaultMessage="Acest dulap nu are nevoie de asamblare profesionistă, iar pentru comoditate, oferim și o instrucțiune de asamblare." />
      </p>
      <br></br>
      <div className={styles.infoboxTitle}>
        <HandymanIcon color='action'/>
        <p><FormattedMessage id="configurator.infobox.assembly.title" defaultMessage="Asamblarea"/></p>
      </div>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="configurator.infobox.assembly.1" defaultMessage="Acest dulap nu are nevoie de asamblare profesionistă, iar pentru comoditate, oferim și o instrucțiune de asamblare." />
      </p>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="configurator.infobox.assembly.2" defaultMessage="Asamblarea poate fi procurată ca serviciu aparte în coș, prețul fiind de 350 lei." />
      </p>
      <br></br>
      {/* Delivery section */}
      <div className={styles.infoboxTitle}>
        <LocalShippingIcon color='action'/>
        <p><FormattedMessage id="configurator.infobox.delivery.title" defaultMessage="Livrarea"/></p>
      </div>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="configurator.infobox.delivery.1" defaultMessage="Livrarea se efectuează gratuit, în raza mun. Chișinău." />
      </p>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="configurator.infobox.delivery.2" defaultMessage="Termenul de livrare este de 10-15 zile lucrătare de la plasarea comenzii." />
      </p>
    </div>
  )
}
