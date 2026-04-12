# jungwoong@aips — Security Research Notebook

Personal site built with [VitePress](https://vitepress.dev). Terminal-themed portfolio for CVE reproduction notes, security research writeups, and homelab documentation.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output → .vitepress/dist/
npm run preview  # preview built site
```

## Adding a New Post

1. Copy the `_template.md` from the target section (`cve/`, `research/`, or `dev/`)
2. Rename it (e.g., `cve/CVE-2025-XXXXX.md`)
3. Fill in the frontmatter and body
4. Commit and push to `main` — GitHub Actions deploys automatically

## Fonts

This site uses [D2Coding Ligature](https://github.com/naver/d2codingfont) (SIL OFL 1.1). Font files are in `public/fonts/`. License: `public/fonts/D2Coding-OFL.txt`.

## Security Notes

- **CSP**: Enforced via `<meta>` tag (GitHub Pages does not support custom HTTP headers). For stricter CSP with real headers, deploy behind Cloudflare Pages or a Cloudflare Worker.
- **No external requests**: No analytics, no external CDNs, no third-party fonts at runtime.
- **Dependencies**: Pinned to exact versions. `npm audit` runs in CI (non-blocking).
- **Content policy**: No company-internal content. Only public CVEs, public PoCs, and public writeups.

## License

Site content: All rights reserved.
D2Coding font: [SIL Open Font License 1.1](public/fonts/D2Coding-OFL.txt).
