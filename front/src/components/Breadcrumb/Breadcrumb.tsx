import React from 'react'
import styles from './Breadcrumb.module.css'

interface BreadcrumbProps {
  items: { label: string; link?: string }[]
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className={styles.breadcrumb}>
      {items.map((item, index) => (
        <span
          key={index}
          className={
            index === items.length - 1 ? styles.active : styles.inactive
          }
        >
          {item.link ? <a href={item.link}>{item.label}</a> : item.label}
          {index < items.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  )
}
