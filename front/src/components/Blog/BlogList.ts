export type BlogListItem = {
  id: string
  title: string
  subtitle?: string
  image: string
  link: string
  readTime: number
}

export const BLOG_LIST: BlogListItem[] = [
  {
    id: 'measurements',
    title: 'blog.measurements.title',
    subtitle: 'blog.measurements.subtitle',
    image: '/blog/measurement/blog-main.png',
    link: '/blog/measurements',
    readTime: 6,
  },
  {
    id: 'colors',
    title: 'blog.colors.title',
    subtitle: 'blog.colors.subtitle',
    image: '/blog/colors/colors-heading.jpg',
    link: '/blog/colors',
    readTime: 7,
  },
]
