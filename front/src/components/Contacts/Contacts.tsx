import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Contacts.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'
import axios from 'axios'

export { Contacts }

const Contacts: React.FC = () => {
  const intl = useIntl()
  const router = useRouter()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const onClick = async () => {
    await axios.post('/api/contact-form', {
      text: `<b>New Contact Request</b>
            <b>Name: </b>${name}
            <b>Email:</b> 
            <b>Message:</b>
            ${message}`,
    })
    setMessageSent(true)
  }
  const handleCloseModal = () => {
    setMessageSent(false)
    router.push('/')
  }
  return (
    <div>
      <section className={styles.pageHero}>
        <div className={styles.container}>
          <h1>
            <FormattedMessage id="contacts.title" />
          </h1>
          <p>
            <FormattedMessage id="contacts.subtitle" />
          </p>
        </div>
      </section>

      <main className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactColumns}>
            {/* Contact Form */}
            <div className={styles.contactFormWrapper}>
              <form
                action="/send-message"
                method="POST"
                className={styles.contactForm}
              >
                <div className={styles.formGroup}>
                  <label htmlFor="nume">
                    <FormattedMessage id="contacts.nameSurname" />
                  </label>
                  <input
                    type="text"
                    id="nume"
                    name="nume"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: 'contacts.nameSurname.placeholder',
                    })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <FormattedMessage id="contacts.email" />
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={intl.formatMessage({
                      id: 'contacts.email.placeholder',
                    })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="telefon">
                    <FormattedMessage id="contacts.phoneNumber" />
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    placeholder={intl.formatMessage({
                      id: 'contacts.phoneNumber.placeholder',
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="mesaj">
                    <FormattedMessage id="contacts.message" />
                  </label>
                  <textarea
                    id="mesaj"
                    name="mesaj"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: 'contacts.message.placeholder',
                    })}
                    required
                  ></textarea>
                </div>
                <div className={styles.buttonContainer}>
                  <CustomButton onClick={() => onClick()}>
                    <FormattedMessage id="homepage.button.sendMessage" />
                  </CustomButton>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <aside className={styles.contactInfo}>
              <h2>
                <FormattedMessage id="contacts.contactDetails.title" />
              </h2>
              <div className={styles.contactDetailsContainer}>
                <ul className={styles.infoList}>
                  <li>
                    <span className={styles.infoLabel}>
                      <FormattedMessage id="contacts.ourAddress.title" />
                    </span>
                    <span className={styles.infoText}>
                      <FormattedMessage id="contacts.ourAddress" />
                    </span>
                  </li>
                  <li>
                    <span className={styles.infoLabel}>
                      <FormattedMessage id="contacts.ourPhone.title" />
                    </span>
                    <a href="tel:+37360000000" className={styles.infoText}>
                      <FormattedMessage id="contacts.ourPhone" />
                    </a>
                  </li>
                  <li>
                    <span className={styles.infoLabel}>
                      <FormattedMessage id="contacts.ourEmail.title" />
                    </span>
                    <a
                      href="mailto:office@dulap.md"
                      className={styles.infoText}
                    >
                      <FormattedMessage id="contacts.ourEmail" />
                    </a>
                  </li>
                </ul>
                <div className={styles.socialContainer}>
                  <p>
                    <FormattedMessage id="contacts.followUs" />
                  </p>
                  <div className={styles.socialIcons}>
                    <a
                      href="https://www.instagram.com/dulap.md_?igsh=MTEzNWR4cXBpbXdwbQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/soclial/instagram.png" alt="Instagram" />
                    </a>
                    <a
                      href="https://www.facebook.com/share/15j84TravW/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/soclial/facebook.png" alt="Facebook" />
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.mapWrapper}>
                <iframe
                  src="https://maps.google.com/maps?q=Strada+Decebal+6,Chisinau,Moldova&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="dulap.md Location"
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Modal isOpen={messageSent} onClose={handleCloseModal}>
        <h3>
          <FormattedMessage
            id="checkout.modal.title"
            defaultMessage="Comanda plasată"
          />
        </h3>
        <p>
          <FormattedMessage
            id="checkout.modal.message"
            defaultMessage="Comanda ta a fost plasată, în scurt timp revenim cu un apel!"
          />
        </p>
        <div className={styles.buttonRow}>
          <CustomButton onClick={handleCloseModal}>
            <FormattedMessage id="homepage.button.ok" defaultMessage="OK" />
          </CustomButton>
        </div>
      </Modal>
    </div>
  )
}
