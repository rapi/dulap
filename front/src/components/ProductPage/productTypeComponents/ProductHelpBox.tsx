import React, { useState } from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { FormattedMessage } from 'react-intl'
import { CustomButton } from '~/components/CustomButton/CustomButton';
import { Modal } from '~/components/Modal/Modal';
import ContactBox from '~/components/ContactBox/ContactBox'
export const ProductHelpBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className={styles.infoboxContainer}>
      <div className={styles.helpBoxTitle}>
        <p><FormattedMessage id="configurator.infobox.help.title" defaultMessage="Vrei altceva?"/></p>
      </div>
      <p className={styles.assemblyNote}>
        <FormattedMessage id="configurator.infobox.help.color" defaultMessage="Nu ai găsit culoarea potrivită?" />
        <FormattedMessage id="configurator.infobox.help.dimensions" defaultMessage="Vrei alte dimensiuni?" />
        <FormattedMessage id="configurator.infobox.help.personalized" defaultMessage="Vrei mai personalizat?" />
        <FormattedMessage id="configurator.infobox.help.message" defaultMessage="Lasă-ne un mesaj și revenim cu un apel în scurt timp." />
      </p>
      <CustomButton onClick={() => setIsModalOpen(true)}>
        <FormattedMessage id="homepage.button.sendMessage" />
      </CustomButton>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
      >
        {/* <h3>
          <FormattedMessage id="modal.addedToCart.title" />
        </h3>
        <div className={styles.buttonRow}>
          <CustomButton onClick={() => {}}>
            <FormattedMessage id="homepage.button.send" />
          </CustomButton>
          <CustomButton variant="grey" onClick={() => {}}>
            <FormattedMessage id="homepage.button.backToPurchase" />
          </CustomButton>
        </div> */}
        <ContactBox
          title={"Lasă-ne un mesaj!"}
          showEmail={true}
          showTextarea={true}
          modalThankYouMessage='contactForm.modal.thankYouMessage'
        ></ContactBox>
      </Modal>
    </div>
  )
}
