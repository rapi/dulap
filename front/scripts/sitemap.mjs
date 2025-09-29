// scripts/generateSitemap.mjs
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://dulap.md'

/**
 * Recursively get all .tsx page files from the pages directory
 */
function getAllPagePaths(dir, root = dir) {
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
      !fullPath.includes(`${path.sep}api${path.sep}`)
    ) {
      const relativePath = path.relative(root, fullPath)
      const urlPath =
        '/' + relativePath.replace(/\.tsx$/, '').replace(/index$/, '')
      return [urlPath]
    }

    return []
  })
}

function generateSitemap(urls) {
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

const pagesDir = path.join(process.cwd(), 'pages')
const publicDir = path.join(process.cwd(), 'public')
const urls = getAllPagePaths(pagesDir)

const sitemap = generateSitemap(urls)
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)

console.log('✅ sitemap.xml generated successfully')
