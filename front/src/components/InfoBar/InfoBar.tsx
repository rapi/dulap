import React from 'react'
import styles from './InfoBar.module.css'

type IconLike = React.ReactNode | { src: string; alt?: string } | null

type LinkLike =
  | string
  | { href: string; label?: React.ReactNode; target?: string; rel?: string }
  | { onClick: () => void; label?: React.ReactNode }

export interface InfoItem {
  icon?: IconLike
  title: React.ReactNode
  subtitle?: React.ReactNode
  link?: LinkLike
  className?: string
}

export interface InfoBarProps {
  items: InfoItem[]
  /** Optional aria-label for the whole group */
  ariaLabel?: string
}

const renderIcon = (icon?: IconLike) => {
  if (!icon) return null
  if (React.isValidElement(icon)) {
    return <div className={styles.icon}>{icon}</div>
  }
  if (typeof icon === 'object' && 'src' in icon && icon.src) {
    return (
      <div className={styles.icon}>
        {}
        <img src={icon.src} alt={icon.alt ?? ''} />
      </div>
    )
  }
  return null
}

const renderLink = (link?: LinkLike) => {
  if (!link) return null

  // plain string -> href with default label
  if (typeof link === 'string') {
    return (
      <a className={styles.link} href={link}>
        Read more
      </a>
    )
  }

  // href object
  if ('href' in link) {
    const { href, label, target, rel } = link
    return (
      <a
        className={styles.link}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      >
        {label ?? 'Read more'}
      </a>
    )
  }

  // onClick object
  if ('onClick' in link) {
    const { onClick, label } = link
    return (
      <button type="button" className={styles.linkButton} onClick={onClick}>
        {label ?? 'Read more'}
      </button>
    )
  }

  return null
}

export const InfoBar: React.FC<InfoBarProps> = ({
  items,
  ariaLabel = 'Product information',
}) => {
  return (
    <section className={styles.infoBar} aria-label={ariaLabel}>
      {items.map((item, i) => (
        <div key={i} className={`${styles.item} ${item.className ?? ''}`}>
          {renderIcon(item.icon)}
          <div className={styles.text}>
            <h3 className={styles.title}>{item.title}</h3>
            {item.subtitle ? (
              <p className={styles.subtitle}>{item.subtitle}</p>
            ) : null}
            {renderLink(item.link)}
          </div>
        </div>
      ))}
    </section>
  )
}
