// pages/sitemap.xml.tsx
import fs from 'fs'
import path from 'path'
import type { GetServerSideProps, NextPage } from 'next'

const BASE_URL = 'https://dulap.md'

/**
 * Recursively get all .tsx page files from the pages directory
 */
function getAllPagePaths(dir: string, root = dir): string[] {
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      return getAllPagePaths(fullPath, root)
    }

    // Only include .tsx and ignore dynamic routes and API routes
    if (
      file.endsWith('.tsx') &&
      !file.startsWith('_') &&
      !fullPath.includes('/api/')
    ) {
      const relativePath = path.relative(root, fullPath)
      const urlPath =
        '/' + relativePath.replace(/\.tsx$/, '').replace(/index$/, '')
      return [urlPath]
    }

    return []
  })
}

function generateSiteMap(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
        <url>
          <loc>${BASE_URL}${url.replace('[locale]', 'ro')}</loc>
        </url>
        <url>
          <loc>${BASE_URL}${url.replace('[locale]', 'ru')}</loc>
        </url>
    `
    )
    .join('')}
</urlset>`
}

const SiteMap: NextPage = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const pagesDir = path.join(process.cwd(), 'pages')
  const urls = getAllPagePaths(pagesDir)

  const sitemap = generateSiteMap(urls)

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default SiteMap
