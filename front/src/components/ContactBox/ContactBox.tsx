import React, { useState } from 'react'
import axios from 'axios'
import styles from './ContactBox.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'
import { Modal } from '~/components/Modal/Modal'

export interface ContactBoxProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  showName?: boolean
  showEmail?: boolean
}

const ContactBox: React.FC<ContactBoxProps> = ({
  title,
  subtitle = false,
  showName = false,
  showEmail = false,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = `<b>New Contact</b>\n    ${showName ? `<b>Name:</b> ${name}\n` : ''}${
      showEmail ? `<b>Email:</b> ${email}\n` : ''
    }<b>Message:</b> ${message}`

    try {
      await axios.post('/api/contact-form', { text: payload })
      setSubmitted(true)
    } catch (error) {
      console.error('ContactBox submission error:', error)
    }
  }

  if (submitted) {
    setModalOpen(true)
  }

  return (
    <div className={styles.boxContainer}>
      <h2 className={styles.boxTitle}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {showName && (
          <div className={styles.contactForm}>
            <label htmlFor="contact-name">Nume</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        )}

        {showEmail && (
          <div className={styles.contactForm}>
            <label htmlFor="contact-email"></label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
          </div>
        )}

        <div className={styles.contactForm}>
          <label htmlFor="contact-message"></label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
          />
        </div>

        <div className={styles.buttonContainer}>
          <CustomButton onClick={() => handleSubmit}>
            <FormattedMessage id="homepage.button.sendMessage" />
          </CustomButton>
        </div>
      </form>
      <Modal isOpen={modalOpen}>
        <h3 className={styles.boxTitle}>
          <FormattedMessage id="contactForm.modal.thankYouMessage" />
        </h3>
      </Modal>
    </div>
  )
}

export default ContactBox
