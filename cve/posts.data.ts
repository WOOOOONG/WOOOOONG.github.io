import { createContentLoader } from 'vitepress'

interface CvePost {
  title: string
  url: string
  date: string
  cvss: number | null
  cve: string
  status: string
}

export default createContentLoader('cve/*.md', {
  excerpt: false,
  transform(raw): CvePost[] {
    return raw
      .filter(({ url }) => !url.endsWith('/'))
      .filter(({ frontmatter }) => frontmatter.date && !isNaN(new Date(frontmatter.date).getTime()))
      .map(({ frontmatter, url }) => ({
        title: frontmatter.title ?? 'Untitled',
        url,
        date: formatDate(frontmatter.date),
        cvss: frontmatter.cvss ?? null,
        cve: frontmatter.cve ?? '',
        status: frontmatter.status ?? 'draft'
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

function formatDate(raw: string | Date): string {
  const d = new Date(raw)
  return d.toISOString().slice(0, 10)
}

export { type CvePost as Data }

declare const data: CvePost[]
export { data }
