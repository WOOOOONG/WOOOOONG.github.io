import { defineConfig } from 'vitepress'
import monokaiPro from './monokai-pro.json'
import monokaiProLight from './monokai-pro-light.json'

export default defineConfig({
  title: 'jeongwoong.yoon@blog',
  description: '윤정웅 포트폴리오 — 취약점 분석 · 탐지 규칙 개발 · 보안 자동화',
  cleanUrls: true,
  appearance: 'dark',
  vite: {
    server: {
      host: '0.0.0.0'
    }
  },

  head: [
    [
      'meta',
      {
        'http-equiv': 'Content-Security-Policy',
        content: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'none'"
        ].join('; ')
      }
    ],
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    [
      'link',
      {
        rel: 'preload',
        href: '/fonts/D2CodingLigature-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: ''
      }
    ],
    [
      'link',
      {
        rel: 'preload',
        href: '/fonts/D2CodingLigature-Bold.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: ''
      }
    ]
  ],

  markdown: {
    theme: {
      dark: monokaiPro as any,
      light: monokaiProLight as any
    },
    config(md) {
      // code copy button is enabled by default in VitePress
    }
  },

  srcExclude: ['**/_template.md', 'PROMPT.md', 'README.md', 'Monokai_Pro.json', 'Monokai_Pro_Light.json'],

  themeConfig: {
    nav: [
      { text: '~', link: '/' },
      { text: '~/cve', link: '/cve/' },
      { text: '~/research', link: '/research/' },
      { text: '~/dev', link: '/dev/' },
      { text: '~/about', link: '/about/' }
    ],

    sidebar: {},

    search: undefined,
    outline: { level: [2, 3] }
  }
})
