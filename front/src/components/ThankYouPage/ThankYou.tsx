import * as React from 'react'
import styles from './ThankYou.module.css'
import { FormattedMessage } from 'react-intl'

type ThankYouProps = {
  title: string
  subtitle?: string
  /** Pass any React node: an SVG, emoji, or icon component */
  icon?: React.ReactNode
  /** Extra content under the subtitle (optional) */
  children?: React.ReactNode
  /** Buttons/links area (optional) */
  actions?: React.ReactNode
  /** Extra class if you want to tweak layout from outside */
  className?: string
}

const DefaultIcon = () => (
  <svg
    aria-hidden="true"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    role="img"
    focusable="false"
  >
    <path
      d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.707 7.293-5.657 5.657a1 1 0 0 1-1.414 0L7.293 12.607a1 1 0 1 1 1.414-1.414l1.636 1.636 4.95-4.95a1 1 0 0 1 1.414 1.414Z"
      fill="currentColor"
    />
  </svg>
)

export default function ThankYou({
  title,
  subtitle,
  icon,
  children,
  actions,
  className,
}: ThankYouProps) {
  return (
    <section
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
      data-testid="thank-you"
    >
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden={icon ? 'true' : 'true'}>
          {icon ?? <DefaultIcon />}
        </div>

        <h1 className={styles.title}>
          <FormattedMessage id={title} />
        </h1>

        {subtitle && (
          <p className={styles.subtitle}>
            <FormattedMessage id={subtitle} />
          </p>
        )}

        {children && <div className={styles.body}>{children}</div>}

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  )
}
