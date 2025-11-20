import React from 'react'
import styles from './ReviewListPage.module.css'
import { FormattedMessage } from 'react-intl'

export interface ReviewListPageProps {
  title?: string
  subtitle?: string
  children: React.ReactNode // pass <ReviewsSection /> here
}

export const ReviewListPage: React.FC<ReviewListPageProps> = ({
  title = 'reviews.title',
  subtitle = 'reviews.subtitle',
  children,
}) => {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}><FormattedMessage id={title}/></h1>
        {subtitle && <p className={styles.subtitle}><FormattedMessage id={subtitle}/></p>}
      </header>

      {children}
    </main>
  )
}
