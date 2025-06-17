import { FC } from 'react';
import { useIntl } from 'react-intl';
import styles from './TermsAndConditionsPage.module.css'
import { FormattedMessage } from 'react-intl';

export { TermsAndConditionsPage };

const TermsAndConditionsPage: FC = () => {
  const intl = useIntl();
  const content = intl.formatMessage({ id: 'terms.text' });

  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.container}>
          <h2><FormattedMessage id="terms.title" /></h2>
        </div>
      </section>
      <main style={{ fontSize: 14, lineHeight: 1.3, maxWidth: 900, margin: '0 auto', padding: '2rem', whiteSpace: 'pre-line' }}>
        {content}
      </main>  
    </div>
        
  );
};

