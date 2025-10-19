import React from 'react'
import Blog from './Blog'

const BlogPostColors: React.FC = () => {
  return (
    <Blog
      headingTag="h1"
      titleId="blog.colors.title"
      descriptionId="blog.colors.subtitle"
      authorNameId="blog.author.vasile"
      datePublishedISO="2025-10-19"
      readingTimeMin={7}
      tagsIds={['tag.guides', 'tag.dulapmd', 'tag.colors']}
      cover={{
        src: '/blog/colors/colors-heading.jpg',
        altId: 'blog.colors.cover.alt',
        captionId: 'blog.colors.cover.caption',
      }}
      breadcrumbs={[
        { id: 'breadcrumb.home', href: '/' },
        { id: 'breadcrumb.journal', href: '/blog' },
        { id: 'blog.colors.title', href: '/blog/colors' },
      ]}
      canonicalUrl="https://dulap.md/blog/colors"
      sections={[
        { type: 'paragraph', contentId: 'blog.colors.p1.warmcool' },
        {
          type: 'image',
          src: '/blog/colors/warm-palette.png',
          altId: 'blog.colors.p1.warm.img.alt',
          captionId: 'blog.colors.p1.warm.img.caption',
          fullWidth: true,
        },
        {
          type: 'image',
          src: '/blog/colors/cold-palette.png',
          altId: 'blog.colors.p1.cool.img.alt',
          captionId: 'blog.colors.p1.cool.img.caption',
          fullWidth: true,
        },
        { type: 'divider' },
        // Paragraful 2 — mostre
        {
          type: 'paragraph',
          contentId: 'blog.colors.p2.samples',
          links: {
            samples: {
              href: '/samples',
              ariaLabelId: 'blog.colors.samples.cta.aria',
            },
          },
        },

        {
          type: 'subheading',
          contentId: 'blog.colors.section.light.title',
          level: 2,
        },
        {
          type: 'image',
          src: '/blog/colors/color-choose.jpg',
          altId: 'blog.colors.section.light.img.alt',
          captionId: 'blog.colors.section.light.img.caption',
          fullWidth: true,
        },
        { type: 'paragraph', contentId: 'blog.colors.section.light.p1' },
        {
          type: 'list',
          ordered: true,
          titleId: 'blog.colors.section.light.list.title',
          itemsIds: [
            'blog.colors.section.light.li.1',
            'blog.colors.section.light.li.2',
            'blog.colors.section.light.li.3',
            'blog.colors.section.light.li.4',
          ],
        },

        { type: 'divider' },

        {
          type: 'subheading',
          contentId: 'blog.colors.section.finish.title',
          level: 2,
        },
        { type: 'paragraph', contentId: 'blog.colors.section.finish.p1' },
        {
          type: 'list',
          ordered: false,
          titleId: 'blog.colors.section.finish.list.title',
          itemsIds: [
            'blog.colors.section.finish.li.1',
            'blog.colors.section.finish.li.2',
            'blog.colors.section.finish.li.3',
          ],
        },

        { type: 'divider' },

        // CTA final (fără secțiunea 6 eliminată)
        {
          type: 'paragraph',
          contentId: 'blog.colors.section.final.cta',
          links: {
            conf: {
              href: '/configurator/wardrobe',
              ariaLabelId: 'blog.colors.section.final.conf.aria',
            },
            samples: {
              href: '/products',
              ariaLabelId: 'blog.colors.samples.cta.aria',
            },
          },
        },
      ]}
    />
  )
}

export default BlogPostColors
