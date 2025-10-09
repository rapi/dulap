import React, { useMemo } from 'react'
import styles from './Blog.module.css'
import { FormattedMessage, FormattedDate } from 'react-intl'

/** ---------- Types ---------- */
export type HeadingTag = 'h1' | 'h2' | 'h3'

export type ImageBlock = {
  type: 'image'
  src: string
  altId: string
  captionId?: string
  fullWidth?: boolean
}

export type ParagraphBlock = {
  type: 'paragraph'
  contentId: string
}

export type SubheadingBlock = {
  type: 'subheading'
  contentId: string
  level?: 2 | 3 | 4
}

export type QuoteBlock = {
  type: 'quote'
  contentId: string
  citeId?: string
}

export type ListBlock = {
  type: 'list'
  itemsIds: string[]
  ordered?: boolean
  titleId?: string
}

export type DividerBlock = {
  type: 'divider'
}

export type SpacerBlock = {
  type: 'spacer'
  size?: 'sm' | 'md' | 'lg'
}

export type BlogBlock =
  | ImageBlock
  | ParagraphBlock
  | SubheadingBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock
  | SpacerBlock

export type Cover = {
  src: string
  altId: string
  captionId?: string
}

export type Crumb = { id: string; href: string }

export interface BlogProps {
  /** SEO + header */
  titleId: string
  descriptionId?: string
  cover?: Cover

  /** Meta (optional but useful for SEO) */
  authorNameId?: string
  datePublishedISO?: string // e.g. "2025-10-09"
  readingTimeMin?: number
  tagsIds?: string[]

  /** Content */
  sections?: BlogBlock[]

  /** Presentation */
  headingTag?: HeadingTag // defaults to 'h1'

  /** Optional breadcrumb */
  breadcrumbs?: Crumb[]

  /** Optional canonical url (used in JSON-LD) */
  canonicalUrl?: string
}

/** ---------- Helpers ---------- */
function Subheading({ level = 2, id }: { level?: 2 | 3 | 4; id: string }) {
  if (level === 4) {
    return (
      <h4 className={styles.subheading}>
        <FormattedMessage id={id} />
      </h4>
    )
  }
  if (level === 3) {
    return (
      <h3 className={styles.subheading}>
        <FormattedMessage id={id} />
      </h3>
    )
  }
  return (
    <h2 className={styles.subheading}>
      <FormattedMessage id={id} />
    </h2>
  )
}

function buildArticleJsonLd(props: BlogProps) {
  const {
    titleId,
    descriptionId,
    authorNameId,
    datePublishedISO,
    canonicalUrl,
    cover,
    tagsIds,
  } = props

  // Minimal Article schema; content is translated on render, but JSON-LD can still carry identifiers
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: { '@id': titleId },
    description: descriptionId ? { '@id': descriptionId } : undefined,
    author: authorNameId
      ? { '@type': 'Person', name: { '@id': authorNameId } }
      : undefined,
    datePublished: datePublishedISO,
    mainEntityOfPage: canonicalUrl,
    image: cover?.src,
    keywords: tagsIds?.map((id) => ({ '@id': id })),
  }
  // Remove undefined keys
  Object.keys(jsonLd).forEach(
    (k) => jsonLd[k] === undefined && delete jsonLd[k]
  )
  return jsonLd
}

function buildBreadcrumbJsonLd(breadcrumbs?: Crumb[]) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: { '@id': c.id },
      item: c.href,
    })),
  }
}

/** ---------- Component ---------- */
const Blog: React.FC<BlogProps> = (props) => {
  const {
    titleId,
    descriptionId,
    cover,
    authorNameId,
    datePublishedISO,
    readingTimeMin,
    tagsIds,
    sections, // might be undefined
    headingTag = 'h1',
    breadcrumbs,
    canonicalUrl,
  } = props

  const safeSections: BlogBlock[] = Array.isArray(sections) ? sections : []
  const HeadingTag = (headingTag || 'h1') as React.ElementType

  const articleJsonLd = useMemo(
    () =>
      buildArticleJsonLd({
        titleId,
        descriptionId,
        authorNameId,
        datePublishedISO,
        canonicalUrl,
        cover,
        tagsIds,
        // sections removed from JSON-LD builder since it wasn’t used there
      }),
    [
      titleId,
      descriptionId,
      authorNameId,
      datePublishedISO,
      canonicalUrl,
      cover,
      tagsIds,
    ]
  )

  const breadcrumbJsonLd = useMemo(
    () => buildBreadcrumbJsonLd(breadcrumbs),
    [breadcrumbs]
  )

  return (
    <article className={styles.article}>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        // It’s okay that values are IDs; your real text is rendered via <FormattedMessage />
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd ? [articleJsonLd, breadcrumbJsonLd] : articleJsonLd
          ),
        }}
      />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((c, i) => (
              <li key={c.href}>
                <a href={c.href} className={styles.breadcrumbLink}>
                  <FormattedMessage id={c.id} />
                </a>
                {i < breadcrumbs.length - 1 && (
                  <span className={styles.breadcrumbSep}>/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <header className={styles.header}>
        <HeadingTag className={styles.title}>
          <FormattedMessage id={titleId} />
        </HeadingTag>
        {descriptionId && (
          <p className={styles.description}>
            <FormattedMessage id={descriptionId} />
          </p>
        )}

        {(authorNameId || datePublishedISO || readingTimeMin) && (
          <div className={styles.meta}>
            {authorNameId && (
              <span className={styles.metaItem}>
                <FormattedMessage id={authorNameId} />
              </span>
            )}
            {datePublishedISO && (
              <time
                className={styles.metaItem}
                dateTime={datePublishedISO}
                aria-label="Published date"
              >
                <FormattedDate
                  value={new Date(`${datePublishedISO}T00:00:00Z`)} // avoid TZ drift
                  year="numeric"
                  month="2-digit"
                  day="2-digit"
                  timeZone="UTC"
                />
              </time>
            )}
            {typeof readingTimeMin === 'number' && (
              <span className={styles.metaItem}>
                <FormattedMessage id="blog.readingTime" /> {readingTimeMin} min
              </span>
            )}
          </div>
        )}

        {cover && (
          <figure className={styles.cover}>
            <img className={styles.coverImg} src={cover.src} alt="" />
            {/* alt text is described in the content; for visual similarity to Tylko, keep alt empty and show caption */}
            {cover.captionId && (
              <figcaption className={styles.caption}>
                <FormattedMessage id={cover.captionId} />
              </figcaption>
            )}
          </figure>
        )}
      </header>

      <section className={styles.content}>
        {safeSections.map((block, idx) => {
          switch (block.type) {
            case 'paragraph':
              return (
                <p key={idx} className={styles.paragraph}>
                  <FormattedMessage id={block.contentId} />
                </p>
              )
            case 'subheading':
              return (
                <Subheading
                  key={idx}
                  level={block.level}
                  id={block.contentId}
                />
              )
            case 'image':
              return (
                <figure
                  key={idx}
                  className={`${styles.figure} ${
                    block.fullWidth ? styles.figureFull : ''
                  }`}
                >
                  <img className={styles.figureImg} src={block.src} alt="" />
                  {block.captionId && (
                    <figcaption className={styles.caption}>
                      <FormattedMessage id={block.captionId} />
                    </figcaption>
                  )}
                </figure>
              )
            case 'quote':
              return (
                <blockquote key={idx} className={styles.quote}>
                  <p className={styles.quoteText}>
                    <FormattedMessage id={block.contentId} />
                  </p>
                  {block.citeId && (
                    <cite className={styles.quoteCite}>
                      <FormattedMessage id={block.citeId} />
                    </cite>
                  )}
                </blockquote>
              )
            case 'list':
              if (block.ordered) {
                return (
                  <div key={idx} className={styles.listWrap}>
                    {block.titleId && (
                      <p className={styles.listTitle}>
                        <FormattedMessage id={block.titleId} />
                      </p>
                    )}
                    <ol className={styles.list}>
                      {block.itemsIds.map((id, i) => (
                        <li key={i} className={styles.listItem}>
                          <FormattedMessage id={id} />
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              }
              return (
                <div key={idx} className={styles.listWrap}>
                  {block.titleId && (
                    <p className={styles.listTitle}>
                      <FormattedMessage id={block.titleId} />
                    </p>
                  )}
                  <ul className={styles.list}>
                    {block.itemsIds.map((id, i) => (
                      <li key={i} className={styles.listItem}>
                        <FormattedMessage id={id} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            case 'divider':
              return <hr key={idx} className={styles.divider} />
            case 'spacer':
              return (
                <div
                  key={idx}
                  className={`${styles.spacer} ${
                    block.size ? styles[`spacer_${block.size}`] : ''
                  }`}
                />
              )
            default:
              // exhaustive check
              return null
          }
        })}
      </section>

      {tagsIds && tagsIds.length > 0 && (
        <footer className={styles.footer}>
          <ul className={styles.tags}>
            {tagsIds.map((id) => (
              <li key={id} className={styles.tag}>
                <FormattedMessage id={id} />
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  )
}

export default Blog
