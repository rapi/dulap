import React, { useState } from 'react'
import axios from 'axios'
import styles from './ContactBox.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal } from '~/components/Modal/Modal'

export interface ContactBoxProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  showName?: boolean
  showEmail?: boolean
  showTextarea?: boolean
  modalThankYouMessage?: string
}

const ContactBox: React.FC<ContactBoxProps> = ({
  title,
  subtitle = false,
  showName = false,
  showEmail = false,
  showTextarea = false,
  modalThankYouMessage,
}) => {
  const intl = useIntl()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    message?: string
  }>({})

  const [modalOpen, setModalOpen] = useState(false)

  const handleSubmit = async () => {
    // validate
    const newErrors: { name?: string; email?: string; message?: string } = {}

    if (showName && !name.trim()) {
      newErrors.name = intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Acest câmp este obligatoriu',
      })
    }
    if (showEmail && !email.trim()) {
      newErrors.email = intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Acest câmp este obligatoriu',
      })
    }
    if (showTextarea && !message.trim()) {
      newErrors.message = intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Acest câmp este obligatoriu',
      })
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    // build payload
    const payload = `<b>New Contact</b>
${showName ? `<b>Name:</b> ${name}\n` : ''}${
      showEmail ? `<b>Email:</b> ${email}\n` : ''
    }<b>Message:</b> ${message}`

    try {
      await axios.post('/api/contact-form', { text: payload })

      // clear and show thank-you
      setName('')
      setEmail('')
      setMessage('')
      setModalOpen(true)
    } catch (err) {
      console.error('ContactBox submission error:', err)
      // you could set a common error here if you like
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <div className={styles.boxContainer}>
      <h2 className={styles.boxTitle}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <div className={styles.form}>
        {showName && (
          <div className={styles.contactForm}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((prev) => ({ ...prev, name: '' }))
              }}
              placeholder={intl.formatMessage({
                id: 'contactBox.placeholder.name',
                defaultMessage: 'Your Name',
              })}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>
        )}

        {showEmail && (
          <div className={styles.contactForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: '' }))
              }}
              placeholder={intl.formatMessage({
                id: 'contactBox.placeholder.email',
                defaultMessage: 'Your Email',
              })}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
        )}

        {showTextarea && (
          <div className={styles.contactForm}>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setErrors((prev) => ({ ...prev, message: '' }))
              }}
              placeholder={intl.formatMessage({
                id: 'contactBox.placeholder.message',
                defaultMessage: 'Your Message',
              })}
            />
            {errors.message && <p className={styles.error}>{errors.message}</p>}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <CustomButton onClick={handleSubmit}>
            <FormattedMessage
              id="homepage.button.sendMessage"
              defaultMessage="Send Message"
            />
          </CustomButton>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <h3>
          <FormattedMessage
            id={modalThankYouMessage}
            defaultMessage="contactForm.modal.thankYouMessage"
          />
        </h3>
      </Modal>
    </div>
  )
}

export default ContactBox
