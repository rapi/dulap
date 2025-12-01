import React, { useState, useMemo } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'
import type { BaseConfig, Constraints } from '~/utils/configTypes'
import type { ProductKey } from '~/utils/configUrl'
import { configToQuery } from '~/utils/configUrl'
import { getConstraints } from '~/config/furnitureConstraints'
import styles from './ShareConfigModal.module.css'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface ShareConfigModalProps {
  isOpen: boolean
  onClose: () => void
  config: BaseConfig
  product: ProductKey
  locale: string
}

export const ShareConfigModal: React.FC<ShareConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  product,
  locale,
}) => {
  const [copied, setCopied] = useState(false)

  // Generate the shareable URL
  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    
    const constraints = getConstraints(product) as Constraints
    const queryParams = configToQuery(config, product, constraints)
    const searchParams = new URLSearchParams()
    
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.set(key, String(value))
    })
    
    const queryString = searchParams.toString()
    const baseUrl = `${window.location.origin}/${locale}/configurator/${product}`
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }, [config, product, locale])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <ShareIcon className={styles.icon} />
        </div>
        <h3 className={styles.title}>
          <FormattedMessage id="modal.shareConfig.title" />
        </h3>
        <p className={styles.description}>
          <FormattedMessage id="modal.shareConfig.description" />
        </p>
        
        <div className={styles.urlContainer}>
          <input
            type="text"
            value={shareableUrl}
            readOnly
            className={styles.urlInput}
            onClick={(e) => e.currentTarget.select()}
          />
        </div>

        <div className={styles.buttonContainer}>
          <CustomButton
            icon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopy}
            variant="primary"
            size="medium"
          >
            {copied ? (
              <FormattedMessage id="modal.shareConfig.copied" />
            ) : (
              <FormattedMessage id="modal.shareConfig.copyLink" />
            )}
          </CustomButton>
        </div>
      </div>
    </Modal>
  )
}

