// src/components/Blog/BlogList.tsx
import * as React from 'react'
import BlogItem from './BlogItem'
import styles from './BlogsList.module.css'
import { BLOG_LIST, type BlogListItem } from './BlogList'

export type BlogListProps = {
  ids?: string[]
  items?: BlogListItem[]
  className?: string
}

export default function BlogsList({ ids, items, className }: BlogListProps) {
  const source = items ?? BLOG_LIST

  const filtered: BlogListItem[] = React.useMemo(() => {
    if (!ids || ids.length === 0) return source
    const map = new Map(source.map((b) => [b.id, b]))
    return ids.map((id) => map.get(id)).filter(Boolean) as BlogListItem[]
  }, [ids, source])

  return (
    <section className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <div className={styles.grid}>
        {filtered.map((item) => (
          <BlogItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
