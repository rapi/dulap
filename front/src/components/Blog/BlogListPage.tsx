import React from 'react'
import styles from './BlogsList.module.css'
import { FormattedMessage } from 'react-intl'
import BlogsList from '~/components/Blog/BlogsList'

export { BlogListPage }

const BlogListPage: React.FC = () => {
  return (
    <div className={styles.blogListPage}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FormattedMessage id="blogListPage.title" />
        </h2>
        <h3 className={styles.intro}>
          <FormattedMessage id="blogListPage.subtitle" />
        </h3>
      </div>
      <BlogsList />
    </div>
  )
}
