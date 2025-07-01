import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Contacts.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage, useIntl } from 'react-intl'
import axios from 'axios'

export const Contacts: React.FC = () => {
  const intl = useIntl()
  const router = useRouter()

  // form values
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  })

  // modal state
  const [messageSent, setMessageSent] = useState(false)

  const handleSubmit = async () => {
    // reset errors
    const newErrors = { name: '', email: '', message: '' }

    if (!name.trim()) {
      newErrors.name = intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Acest câmp este obligatoriu',
      })
    }
    if (!email.trim()) {
      newErrors.email = intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Acest câmp este obligatoriu',
      })
    }
    if (!message.trim()) {
      newErrors.message = intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Acest câmp este obligatoriu',
      })
    }

    setErrors(newErrors)
    if (Object.values(newErrors).some((msg) => msg)) {
      return
    }

    // send the message
    await axios.post('/api/contact-form', {
      text: `<b>New Contact Request</b>
             <b>Name:</b> ${name}
             <b>Email:</b> ${email}
             <b>Phone:</b> ${phone}
             <b>Message:</b> ${message}`,
    })

    setMessageSent(true)
    // clear fields
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
  }

  const handleCloseModal = () => {
    setMessageSent(false)
    router.push('/')
  }

  return (
    <div>
      {/* Hero Section */}
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

      {/* Main Content */}
      <main className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactColumns}>
            {/* Contact Form */}
            <div className={styles.contactFormWrapper}>
              <form
                onSubmit={(e) => e.preventDefault()}
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
                    onChange={(e) => {
                      setName(e.target.value)
                      setErrors((e) => ({ ...e, name: '' }))
                    }}
                    placeholder={intl.formatMessage({
                      id: 'contacts.nameSurname.placeholder',
                    })}
                  />
                  {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <FormattedMessage id="contacts.email" />
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((e) => ({ ...e, email: '' }))
                    }}
                    placeholder={intl.formatMessage({
                      id: 'contacts.email.placeholder',
                    })}
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefon">
                    <FormattedMessage id="contacts.phoneNumber" />
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    onChange={(e) => {
                      setMessage(e.target.value)
                      setErrors((e) => ({ ...e, message: '' }))
                    }}
                    placeholder={intl.formatMessage({
                      id: 'contacts.message.placeholder',
                    })}
                  />
                  {errors.message && (
                    <p className={styles.error}>{errors.message}</p>
                  )}
                </div>

                <div className={styles.buttonContainer}>
                  <CustomButton onClick={handleSubmit}>
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
                    <a href="tel:+37379398167" className={styles.infoText}>
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

      {/* Thank You Modal */}
      <Modal isOpen={messageSent} onClose={handleCloseModal}>
        <h3>
          <FormattedMessage id="contacts.modal.thankYouMessage" />
        </h3>
      </Modal>
    </div>
  )
}
