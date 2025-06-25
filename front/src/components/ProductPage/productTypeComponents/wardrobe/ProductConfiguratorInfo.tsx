import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { CustomButton } from '~/components/CustomButton/CustomButton';

interface ProductConfiguratorInfoProps {
  linkConfigurator: string
}

export const ProductConfiguratorInfo: React.FC<ProductConfiguratorInfoProps> = ({ linkConfigurator }) => {
  return (
    <div className={styles.infoboxContainer}>
      <div className={styles.infoboxTitle}>
        <LightbulbIcon color='action'/>
        <p><FormattedMessage id="configurator.infobox.config.title" defaultMessage="Vrei mărimi personalizate?"/></p>
      </div>
      <CustomButton href={linkConfigurator}><FormattedMessage id="homepage.button.edit"/></CustomButton>
    </div>
  )
}
