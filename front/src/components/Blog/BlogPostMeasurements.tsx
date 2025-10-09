import React from 'react'
import Blog from './Blog'

const BlogPostMeasurements: React.FC = () => {
  return (
    <Blog
      headingTag="h1"
      titleId="blog.measurements.title"
      descriptionId="blog.measurements.subtitle"
      authorNameId="blog.author.elizabet"
      datePublishedISO="2025-10-09"
      readingTimeMin={6}
      tagsIds={['tag.guides', 'tag.measurements', 'tag.dulapmd']}
      cover={{
        src: '/products/wardrobe-visualization/1.png',
        altId: 'blog.measurements.cover.alt',
        captionId: 'blog.measurements.cover.caption',
      }}
      breadcrumbs={[
        { id: 'breadcrumb.home', href: '/' },
        { id: 'breadcrumb.journal', href: '/blog' },
        { id: 'blog.measurements.title', href: '/blog/measurements' },
      ]}
      canonicalUrl="https://dulap.md/blog/measurements"
      sections={[
        { type: 'paragraph', contentId: 'blog.measurements.intro.1' },
        { type: 'paragraph', contentId: 'blog.measurements.intro.2' },

        {
          type: 'subheading',
          contentId: 'blog.measurements.section.1.title',
          level: 2,
        },
        {
          type: 'image',
          src: '/blog/how-to-measurements.png',
          altId: 'blog.measurements.section.1.img.alt',
          captionId: 'blog.measurements.section.1.img.caption',
        },
        { type: 'paragraph', contentId: 'blog.measurements.section.1.p1' },
        {
          type: 'list',
          ordered: true,
          titleId: 'blog.measurements.section.1.list.title',
          itemsIds: [
            'blog.measurements.section.1.li.1',
            'blog.measurements.section.1.li.2',
            'blog.measurements.section.1.li.3',
          ],
        },

        { type: 'divider' },

        {
          type: 'subheading',
          contentId: 'blog.measurements.section.2.title',
          level: 2,
        },
        {
          type: 'quote',
          contentId: 'blog.measurements.quote.text',
          citeId: 'blog.measurements.quote.cite',
        },
        { type: 'paragraph', contentId: 'blog.measurements.section.2.p1' },
        {
          type: 'image',
          src: '/images/posts/measurements/doors-gap.jpg',
          altId: 'blog.measurements.section.2.img.alt',
          captionId: 'blog.measurements.section.2.img.caption',
          fullWidth: true,
        },

        { type: 'spacer', size: 'lg' },

        {
          type: 'subheading',
          contentId: 'blog.measurements.section.3.title',
          level: 2,
        },
        { type: 'paragraph', contentId: 'blog.measurements.section.3.p1' },
        {
          type: 'list',
          ordered: false,
          titleId: 'blog.measurements.section.3.list.title',
          itemsIds: [
            'blog.measurements.section.3.li.1',
            'blog.measurements.section.3.li.2',
            'blog.measurements.section.3.li.3',
          ],
        },

        { type: 'divider' },

        {
          type: 'subheading',
          contentId: 'blog.measurements.section.4.title',
          level: 2,
        },
        { type: 'paragraph', contentId: 'blog.measurements.section.4.p1' },

        {
          type: 'subheading',
          contentId: 'blog.measurements.section.5.title',
          level: 2,
        },
        {
          type: 'list',
          ordered: false,
          titleId: 'blog.measurements.section.5.list.title',
          itemsIds: [
            'blog.measurements.section.4.li.1',
            'blog.measurements.section.4.li.2',
            'blog.measurements.section.4.li.3',
            'blog.measurements.section.4.li.4',
          ],
        },
      ]}
    />
  )
}

export default BlogPostMeasurements
