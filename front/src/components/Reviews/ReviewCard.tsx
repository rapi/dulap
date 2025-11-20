import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styles from './ReviewCard.module.css'
import { Review } from './reviewTypes'
import { ReviewStars } from './ReviewStars'

export interface ReviewCardProps {
  review: Review
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const intl = useIntl()

  const {
    rating,
    author,
    color,
    dateLabel,
    title,
    body,
    originalBody,
    originalLanguageLabel,
    originalLanguageCode,
    showOriginalLabel,
    imageUrl,
    imageAlt,
  } = review

  const hasImage = Boolean(imageUrl)

  // Format all message IDs
  const authorText = author ? intl.formatMessage({ id: author }) : ''
  const dateText = dateLabel ? intl.formatMessage({ id: dateLabel }) : ''
  const colorText = color ? intl.formatMessage({ id: color }) : ''
  const titleText = title ? intl.formatMessage({ id: title }) : ''
  const translatedBodyText = body ? intl.formatMessage({ id: body }) : ''
  const originalBodyText =
    originalBody ? intl.formatMessage({ id: originalBody }) : ''
  const originalLanguageText = originalLanguageLabel
    ? intl.formatMessage({ id: originalLanguageLabel })
    : ''
  const showOriginalText = showOriginalLabel
    ? intl.formatMessage({ id: showOriginalLabel })
    : ''
  const colorLabelText = intl.formatMessage({ id: 'reviews.card.colorLabel' })
  const imageAltText = imageAlt
    ? intl.formatMessage({ id: imageAlt })
    : titleText

  // Determine if current page language is the same as original language
  const locale = intl.locale.toLowerCase()
  const baseLocale = locale.split('-')[0] // 'ro-RO' -> 'ro'
  const isSameLanguage =
    originalLanguageCode &&
    originalLanguageCode.toLowerCase() === baseLocale

  // Toggle between translated text and original text
  const [showOriginalBody, setShowOriginalBody] = useState(false)

  const shouldShowToggleButton =
    !!showOriginalLabel && !!originalBody && !isSameLanguage

  const bodyToDisplay =
    showOriginalBody && originalBodyText ? originalBodyText : translatedBodyText

  const handleToggleOriginal = () => {
    // simple toggle; label can stay "show original" for both states or
    // later you can add a second label id for "show translation"
    setShowOriginalBody((prev) => !prev)
  }

  return (
    <article
      className={`${styles.card} ${!hasImage ? styles.cardNoImage : ''}`}
    >
      {hasImage && (
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={imageAltText} className={styles.image} />
        </div>
      )}

      <div className={styles.content}>
        <header className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <ReviewStars rating={rating} size="sm" />
            <span className={styles.author}>{authorText}</span>
          </div>
          <div className={styles.date}>{dateText}</div>
        </header>

        {color && (
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>{colorLabelText}</span>{' '}
            <span className={styles.metaValue}>{colorText}</span>
          </div>
        )}

        <h3 className={styles.title}>{titleText}</h3>

        <p className={styles.body}>{bodyToDisplay}</p>

        {(originalLanguageLabel || shouldShowToggleButton) && (
          <div className={styles.originalRow}>
            {originalLanguageLabel && (
              <span className={styles.originalLabel}>
                {originalLanguageText}
              </span>
            )}

            {shouldShowToggleButton && (
              <button
                type="button"
                className={styles.originalButton}
                onClick={handleToggleOriginal}
              >
                {showOriginalText}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
