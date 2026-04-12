import { createContentLoader } from 'vitepress'

interface ResearchPost {
  title: string
  url: string
  date: string
  status: string
}

export default createContentLoader('research/*.md', {
  excerpt: false,
  transform(raw): ResearchPost[] {
    return raw
      .filter(({ url }) => !url.endsWith('/'))
      .filter(({ frontmatter }) => frontmatter.date && !isNaN(new Date(frontmatter.date).getTime()))
      .map(({ frontmatter, url }) => ({
        title: frontmatter.title ?? 'Untitled',
        url,
        date: formatDate(frontmatter.date),
        status: frontmatter.status ?? 'in-progress'
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

function formatDate(raw: string | Date): string {
  const d = new Date(raw)
  return d.toISOString().slice(0, 10)
}

export { type ResearchPost as Data }

declare const data: ResearchPost[]
export { data }
