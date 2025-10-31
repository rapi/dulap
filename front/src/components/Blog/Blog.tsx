import React, { useMemo } from 'react'
import styles from './Blog.module.css'
import { FormattedMessage, FormattedDate, useIntl } from 'react-intl'

/** ---------- Types ---------- */
export type HeadingTag = 'h1' | 'h2' | 'h3'

export type ImageBlock = {
  type: 'image'
  src: string
  altId: string
  captionId?: string
  fullWidth?: boolean
}

export type LinkSpec = {
  /** URL-ul la care duce linkul */
  href: string
  /** (Opțional) aria-label traductibil */
  ariaLabelId?: string
  /** (Opțional) override pentru clasa CSS a linkului */
  className?: string
}

export type ParagraphBlock = {
  type: 'paragraph'
  contentId: string
  /**
   * Harta token -> LinkSpec pentru rich text.
   * Cheile trebuie să corespundă tagurilor din mesajul i18n (ex. <cfg>...</cfg>)
   */
  links?: Record<string, LinkSpec>
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

export type DividerBlock = { type: 'divider' }

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

/** Link component custom (ex. next/link) */
type LinkRendererProps = {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  'aria-label'?: string
}
type LinkRenderer = React.ComponentType<LinkRendererProps>

export interface BlogProps {
  /** SEO + header */
  titleId: string
  descriptionId?: string
  cover?: Cover

  /** Meta */
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

  /**
   * (Opțional) Componentă custom pentru linkuri.
   * Dacă nu este transmisă, se folosește <a>.
   * Exemplu Next.js: (props) => <Link {...props} />
   */
  linkComponent?: LinkRenderer
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
  const intl = useIntl()

  const {
    titleId,
    descriptionId,
    cover,
    authorNameId,
    datePublishedISO,
    readingTimeMin,
    tagsIds,
    sections,
    headingTag = 'h1',
    breadcrumbs,
    canonicalUrl,
    linkComponent,
  } = props

  const safeSections: BlogBlock[] = Array.isArray(sections) ? sections : []
  const HeadingTag = (headingTag || 'h1') as HeadingTag

  const DefaultLink: LinkRenderer = (p) => <a {...p} />
  const LinkComp: LinkRenderer = linkComponent || DefaultLink

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
                  value={new Date(`${datePublishedISO}T00:00:00Z`)}
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
            case 'paragraph': {
              // Construim funcțiile pentru rich text (token -> <LinkComp/>)
              const values =
                block.links &&
                Object.fromEntries(
                  Object.entries(block.links).map(([token, spec]) => {
                    const aria = spec.ariaLabelId
                      ? intl.formatMessage({ id: spec.ariaLabelId })
                      : undefined
                    const cls = spec.className || styles.link
                    return [
                      token,
                      (chunks: React.ReactNode) => (
                        <LinkComp
                          href={spec.href}
                          className={cls}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={aria}
                        >
                          {chunks}
                        </LinkComp>
                      ),
                    ]
                  })
                )

              return (
                <p key={idx} className={styles.paragraph}>
                  {/* Dacă nu sunt linkuri definite, FormattedMessage va ignora `values` */}
                  <FormattedMessage
                    id={block.contentId}
                    values={values || {}}
                  />
                </p>
              )
            }
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
                    (block as ImageBlock).fullWidth ? styles.figureFull : ''
                  }`}
                >
                  <img className={styles.figureImg} src={block.src} alt="" />
                  {(block as ImageBlock).captionId && (
                    <figcaption className={styles.caption}>
                      <FormattedMessage id={(block as ImageBlock).captionId!} />
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
                  {(block as QuoteBlock).citeId && (
                    <cite className={styles.quoteCite}>
                      <FormattedMessage id={(block as QuoteBlock).citeId!} />
                    </cite>
                  )}
                </blockquote>
              )
            case 'list':
              if ((block as ListBlock).ordered) {
                return (
                  <div key={idx} className={styles.listWrap}>
                    {(block as ListBlock).titleId && (
                      <p className={styles.listTitle}>
                        <FormattedMessage id={(block as ListBlock).titleId!} />
                      </p>
                    )}
                    <ol className={styles.list}>
                      {(block as ListBlock).itemsIds.map((id, i) => (
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
                  {(block as ListBlock).titleId && (
                    <p className={styles.listTitle}>
                      <FormattedMessage id={(block as ListBlock).titleId!} />
                    </p>
                  )}
                  <ul className={styles.list}>
                    {(block as ListBlock).itemsIds.map((id, i) => (
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
                    (block as SpacerBlock).size
                      ? styles[`spacer_${(block as SpacerBlock).size}`]
                      : ''
                  }`}
                />
              )
            default:
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
