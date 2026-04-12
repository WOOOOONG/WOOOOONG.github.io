import { createContentLoader } from 'vitepress'

interface DevPost {
  title: string
  url: string
  date: string
  category: string
}

export default createContentLoader('dev/*.md', {
  excerpt: false,
  transform(raw): DevPost[] {
    return raw
      .filter(({ url }) => !url.endsWith('/'))
      .filter(({ frontmatter }) => frontmatter.date && !isNaN(new Date(frontmatter.date).getTime()))
      .map(({ frontmatter, url }) => ({
        title: frontmatter.title ?? 'Untitled',
        url,
        date: formatDate(frontmatter.date),
        category: frontmatter.category ?? ''
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

function formatDate(raw: string | Date): string {
  const d = new Date(raw)
  return d.toISOString().slice(0, 10)
}

export { type DevPost as Data }

declare const data: DevPost[]
export { data }
