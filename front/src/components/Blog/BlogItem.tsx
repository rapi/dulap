// src/components/Blog/BlogItem.tsx
import * as React from 'react'
import styles from './BlogItem.module.css'
import type { BlogListItem } from './BlogList'
import { FormattedMessage } from 'react-intl'

export type BlogItemProps = {
  item: BlogListItem
}

export default function BlogItem({ item }: BlogItemProps) {
  const { title, subtitle, image, link, readTime } = item // ⬅️ no `date`

  return (
    <article className={styles.card}>
      <a
        href={link}
        rel="noopener noreferrer"
        aria-label={`${title} — opens in a new tab`}
        className={styles.anchor}
      >
        <header className={styles.header}>
          <p className={styles.articleType}>
            #<FormattedMessage id="blogItem.articleType.helpfulArticle" />
          </p>

          <h3 className={styles.title}>
            <FormattedMessage id={title} />
          </h3>
          {subtitle ? (
            <p className={styles.subtitle}>
              <FormattedMessage id={subtitle} />
            </p>
          ) : null}
          <p className={styles.readTime}>
            {readTime} min<span aria-hidden> · </span>
            <FormattedMessage id="read" />
          </p>
        </header>
        <div className={styles.imageWrap}>
          <img className={styles.image} src={image} alt="" loading="lazy" />
        </div>
      </a>
    </article>
  )
}
