// import React, { useState } from 'react'
// import axios from 'axios'
// import styles from './ContactBox.module.css'
// import { CustomButton } from '~/components/CustomButton/CustomButton'
// import { FormattedMessage, useIntl } from 'react-intl'
// import { Modal } from '~/components/Modal/Modal'

// export interface ContactBoxProps {
//   title: React.ReactNode
//   subtitle?: React.ReactNode
//   showName?: boolean
//   showEmail?: boolean
//   showTextarea?: boolean
// }

// const ContactBox: React.FC<ContactBoxProps> = ({
//   title,
//   subtitle = false,
//   showName = false,
//   showEmail = false,
//   showTextarea = false,
// }) => {
//   const intl = useIntl()
  
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [submitted, setSubmitted] = useState(false)
//   const [modalOpen, setModalOpen] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const payload = `<b>New Contact</b>\n    ${showName ? `<b>Name:</b> ${name}\n` : ''}${
//       showEmail ? `<b>Email:</b> ${email}\n` : ''
//     }<b>Message:</b> ${message}`

//     try {
//       await axios.post('/api/contact-form', { text: payload })
//       setSubmitted(true)
//     } catch (error) {
//       console.error('ContactBox submission error:', error)
//     }
//   }

//   if (submitted) {
//     setModalOpen(true)
//   }

//   return (
//     <div className={styles.boxContainer}>
//       <h2 className={styles.boxTitle}>{title}</h2>
//       {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
//       <br></br>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {showName && (
//           <div className={styles.contactForm}>
//             <label htmlFor="contact-name"></label>
//             <input
//               id="contact-name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder={intl.formatMessage({ id: 'contactBox.placeholder.name' })}
//             />
//           </div>
//         )}

//         {showEmail && (
//           <div className={styles.contactForm}>
//             <label htmlFor="contact-email"></label>
//             <input
//               id="contact-email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder={intl.formatMessage({ id: 'contactBox.placeholder.email' })}
//               required
//             />
//           </div>
//         )}

//         {showTextarea && (
//           <div className={styles.contactForm}>
//             <label htmlFor="contact-message"></label>
//             <textarea
//               id="contact-message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder={intl.formatMessage({ id: 'contactBox.placeholder.message' })}
//               required
//             />
//           </div>
//         )}

//         <div className={styles.buttonContainer}>
//           <CustomButton onClick={handleSubmit}>
//             <FormattedMessage id="homepage.button.sendMessage" />
//           </CustomButton>
//         </div>
//       </form>
//       <Modal isOpen={modalOpen}>
//         <h3 className={styles.boxTitle}>
//           <FormattedMessage id="contactForm.modal.thankYouMessage" />
//         </h3>
//       </Modal>
//     </div>
//   )
// }

// export default ContactBox

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
  modalThankYouMessage
}) => {
  const intl = useIntl()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // zero-arg handler, just like your Contacts.tsx’s onClick
  const handleSubmit = async () => {
    const payload = `<b>New Contact</b>
${showName ? `<b>Name:</b> ${name}\n` : ''}${
      showEmail ? `<b>Email:</b> ${email}\n` : ''
    }<b>Message:</b> ${message}`

    try {
      await axios.post('/api/contact-form', { text: payload })
      // open the thank-you modal immediately
      setName('')
      setEmail('')
      setMessage('')
      setModalOpen(true)
    } catch (error) {
      console.error('ContactBox submission error:', error)
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
              onChange={(e) => setName(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'contactBox.placeholder.name',
              })}
            />
          </div>
        )}

        {showEmail && (
          <div className={styles.contactForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'contactBox.placeholder.email',
              })}
              required
            />
          </div>
        )}

        {showTextarea && (
          <div className={styles.contactForm}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'contactBox.placeholder.message',
              })}
              required
            />
          </div>
        )}

        <div className={styles.buttonContainer}>
          <CustomButton onClick={handleSubmit}>
            <FormattedMessage id="homepage.button.sendMessage" />
          </CustomButton>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <h3>
          <FormattedMessage id={modalThankYouMessage} defaultMessage="contactForm.modal.thankYouMessage" />
        </h3>
      </Modal>
    </div>
  )
}

export default ContactBox
