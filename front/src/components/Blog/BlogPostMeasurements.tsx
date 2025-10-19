import React from 'react'
import Blog from './Blog'

const BlogPostMeasurements: React.FC = () => {
  return (
    <Blog
      headingTag="h1"
      titleId="blog.measurements.title"
      descriptionId="blog.measurements.subtitle"
      authorNameId="blog.author.vasile"
      datePublishedISO="2025-10-09"
      readingTimeMin={6}
      tagsIds={['tag.guides', 'tag.measurements', 'tag.dulapmd']}
      cover={{
        src: '/blog/measurement/blog-main.png',
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
          src: '/blog/measurement/3points.png',
          altId: 'blog.measurements.section.1.img.alt',
          captionId: 'blog.measurements.section.1.img.caption',
        },
        {
          type: 'paragraph',
          contentId: 'blog.measurements.section.1.p1',
          links: {
            prod: {
              href: '/products/',
              ariaLabelId: 'blog.measurements.section.1.prod.label',
            },
          },
        },
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
        { type: 'paragraph', contentId: 'blog.measurements.section.2.p1' },
        { type: 'paragraph', contentId: 'blog.measurements.section.2.p2' },
        {
          type: 'image',
          src: '/blog/measurement/plint.png',
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
          type: 'image',
          src: '/blog/measurement/ceiling.png',
          altId: 'blog.measurements.section.3.img.alt',
          captionId: 'blog.measurements.section.3.img.caption',
          fullWidth: true,
        },

        { type: 'divider' },

        {
          type: 'subheading',
          contentId: 'blog.measurements.section.4.title',
          level: 3,
        },
        {
          type: 'list',
          ordered: false,
          titleId: 'blog.measurements.section.4.list.title',
          itemsIds: [
            'blog.measurements.section.4.li.1',
            'blog.measurements.section.4.li.2',
            'blog.measurements.section.4.li.3',
          ],
        },
        { type: 'divider' },
        {
          type: 'paragraph',
          contentId: 'blog.measurements.section.5.p1',
          links: {
            conf: {
              href: '/configurator/wardrobe',
              ariaLabelId: 'blog.measurements.section.5.conf.label',
            },
          },
        },
      ]}
    />
  )
}

export default BlogPostMeasurements
