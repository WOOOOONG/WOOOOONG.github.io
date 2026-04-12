# VitePress Terminal-Themed Portfolio — Build Spec

## Context

You are building a personal site for a network vulnerability analyst / security researcher. The site is a blog + portfolio hybrid hosted on GitHub Pages. The owner is already deep in the Vue 3 + Vite ecosystem, so the stack choice is **VitePress**. The aesthetic target is a Linux terminal with oh-my-zsh + Powerlevel10k vibes: monospace everywhere, prompt-style headers, ASCII art, `neofetch`-style landing, command-driven navigation feel.

This is **not** a generic developer portfolio. It is a public research notebook for a security analyst. Content depth and credibility matter more than flashy animations.

## Goals (in priority order)

1. **Credibility as a security researcher** — CVE reproduction notes and research writeups are the centerpiece.
2. **Distinctive terminal aesthetic** — the site should feel like SSHing into someone's box, not like a Tailwind template.
3. **Performance** — static, fast, minimal JS, lighthouse 95+ across the board.
4. **Security hygiene** — proper headers, no leaked secrets, no third-party trackers, locked-down dependencies.
5. **Maintainability** — adding a new CVE note should be: create one `.md` file, commit, push. No friction.

## Stack

- **VitePress** (latest stable) — Vue 3 + Vite native, markdown-first, GitHub Pages friendly.
- **Shiki** (built into VitePress) for code highlighting. Register a custom Suricata grammar if feasible; otherwise fall back to `plaintext` with a comment explaining why.
- **No Tailwind, no UI library.** Hand-written CSS using CSS custom properties. Terminal themes live or die by typography and spacing — a utility framework gets in the way.
- **No analytics, no fonts from Google, no external CDNs at runtime.** Self-host the monospace font (see Design section).
- **GitHub Actions** for build + deploy to `gh-pages` branch (or Pages native Actions deployment — prefer the latter, it's simpler).

## Site Structure

Use VitePress's file-based routing. Create exactly these sections:

```
/                 → Home (neofetch-style landing)
/cve/             → CVE reproduction index
/cve/<slug>.md    → Individual CVE notes
/research/        → Research writeups index
/research/<slug>  → Individual research posts
/dev/             → Dev/homelab index (infrastructure, tooling, side projects)
/dev/<slug>       → Individual dev posts
/about/           → About page (extended whoami)
```

**Do NOT create a `/rules/` section.** Suricata rules are intentionally excluded from this site.

Each index page (`/cve/`, `/research/`, `/dev/`) should auto-list its posts from frontmatter. Use VitePress's `createContentLoader` for this — do not hand-maintain the index.

## Design — Terminal Aesthetic

### Color palette

Use a single dark theme (no light mode toggle — terminals are dark). Define as CSS custom properties in a theme override file. The palette is **Monokai Pro** (the "default" / classic filter, not Machine/Ristretto/Spectrum). Be consistent — do not mix in colors from other palettes.

Required CSS variables (Monokai Pro — classic filter):

```css
--term-bg:        #2d2a2e;
--term-bg-alt:    #221f22;
--term-bg-hl:     #403e41;
--term-fg:        #fcfcfa;
--term-fg-dim:    #c1c0c0;
--term-comment:   #727072;
--term-red:       #ff6188;
--term-orange:    #fc9867;
--term-yellow:    #ffd866;
--term-green:     #a9dc76;
--term-blue:      #78dce8;   /* Monokai Pro uses cyan-ish blue */
--term-magenta:   #ab9df2;
--term-cyan:      #78dce8;
--term-selection: #5b595c;
```

Note: Monokai Pro intentionally does not have a traditional "blue" — `--term-blue` and `--term-cyan` both map to `#78dce8`. Do not invent a separate blue. For Shiki code highlighting, use the `monokai` built-in theme as the closest match (VitePress/Shiki does not ship Monokai Pro by default); if precise Monokai Pro highlighting is wanted, load the `monokai-pro` TextMate theme JSON from a reputable source and register it with Shiki at build time.

Override VitePress's default `--vp-c-*` variables to map to these. Do not fight the default theme — extend it via `.vitepress/theme/index.ts` and a custom CSS file.

### Typography

- **Monospace everything.** Body, headings, code — all the same font family.
- Self-host **D2Coding** (Naver's open-source Korean-friendly monospace font). Download the `.ttf` / `.woff2` files from the official release (https://github.com/naver/d2codingfont), convert to `woff2` if only `ttf` is provided, place in `public/fonts/`, reference with `@font-face` and `font-display: swap`. Do not use Google Fonts or any external CDN. D2Coding is released under SIL Open Font License 1.1 — include the license file in `public/fonts/D2Coding-OFL.txt` and credit in the README.
- D2Coding ships in two variants: regular and **D2Coding ligature** (with programming ligatures). Use the ligature variant — this is a terminal-themed site and ligatures reinforce that. Two weights are enough: regular (400) and bold (700).
- D2Coding has excellent Hangul coverage, so Korean posts render at the same cell width as ASCII — no fallback font needed. Still, define a fallback stack for safety: `"D2Coding", "D2Coding ligature", ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
- Base font size 15–16px, generous line-height (1.7ish) for readability. D2Coding reads slightly smaller than JetBrains Mono at the same px — consider 16px as the baseline.

### Powerlevel10k-style prompt headers

Every page heading should feel like a shell prompt. Implement a reusable Vue component `<Prompt>` that renders something like:

```
╭─ jungwoong@aips ~/cve/CVE-2025-21756
╰─$ cat notes.md
```

Use the terminal palette colors for each segment (user in green, host in cyan, path in blue, `$` in magenta). The box-drawing characters (`╭─`, `╰─$`) are the Powerlevel10k signature — keep them.

Accept props: `user`, `host`, `path`, `command`. Default `user=jungwoong`, `host=aips`. The `command` prop lets each page pick its own (`cat notes.md`, `ls -la`, `./exploit.sh`, etc.).

### Neofetch landing page

The home page (`index.md`) must render a `<Neofetch>` component that looks like real neofetch output: **ASCII art on the left, key-value info on the right.** Use a custom ASCII logo — a stylized "JW" or a security-themed glyph (skull, lock, packet). Generate or hand-craft something distinctive; do not copy a distro logo.

Right-side fields (pick ~10):

```
jungwoong@aips
--------------
OS:        Security Researcher (rolling release)
Host:      AIPS / Threat Detection Team
Kernel:    CVE Research · Suricata · eBPF
Uptime:    <computed from a start date>
Packages:  Vue3, Python, LLaMA, QEMU, GDB
Shell:     zsh (obviously)
Terminal:  Ghostty / iTerm2
CPU:       Curiosity @ 4.8GHz
GPU:       RTX 4080 SUPER (fine-tuning)
Memory:    Coffee-limited
Locale:    ko_KR.UTF-8
```

Feel free to adjust — the point is flavor, not literal truth. Make uptime dynamic (compute from a `startDate` constant, e.g., when the site launched or career start).

Below neofetch, render a `$ whoami` block that expands into a 2–3 sentence real introduction. Then a `$ ls ~/` block showing the main sections as if they were directories, each one a clickable link.

### ASCII art — use it liberally but tastefully

- **Home:** neofetch logo (big ASCII block on the left).
- **Section index pages:** small ASCII banner at the top naming the section. Use `figlet`-style fonts — "Standard" or "Slant" both work. Keep them under 6 lines tall.
- **404 page:** an ASCII "segfault" or broken pipe joke. Something like a cracked skull or `core dumped` text.
- **Dividers:** between major sections on long posts, use a box-drawing line (`──────────────────`) instead of `<hr>`.

Do not overdo it. ASCII art in the middle of body copy is noise. Reserve it for page entry points and section breaks.

### Code blocks

- Shiki with a theme matching the chosen palette (Tokyo Night or Catppuccin Mocha — both ship with Shiki).
- Show language label in the top-right corner of each block.
- Show a copy button (VitePress has this built-in — just enable it).
- For long outputs, add a `$` or `#` prompt prefix to lines that are commands, leave output lines bare. This is a terminal site — the distinction matters.

### Cursor and small touches

- Add a blinking block cursor (`▊`) after the last line of the neofetch `whoami` block. CSS animation only, no JS.
- Hover states on links: underline + color shift to `--term-cyan`. Nothing fancier.
- Do not add page transitions, parallax, scroll-triggered animations, or any motion beyond the cursor blink. Terminals don't do that.

## Content Templates

Create these template files so adding new posts is one-file-one-commit.

### CVE note template (`cve/_template.md`, excluded from build)

Frontmatter:
```yaml
---
title: "CVE-YYYY-NNNNN — <short description>"
cve: "CVE-YYYY-NNNNN"
cvss: 0.0
cwe: "CWE-NNN"
vendor: ""
product: ""
status: "draft | reproducing | reproduced | writeup-complete"
date: YYYY-MM-DD
tags: []
---
```

Body sections (as H2):
1. Summary
2. Affected versions
3. Root cause
4. Lab environment
5. Reproduction steps
6. Detection considerations (high-level — no rule text, this site has no `/rules/`)
7. References

### Research post template (`research/_template.md`)

Frontmatter:
```yaml
---
title: ""
date: YYYY-MM-DD
status: "in-progress | complete"
tags: []
---
```

### Dev post template (`dev/_template.md`)

Frontmatter:
```yaml
---
title: ""
date: YYYY-MM-DD
category: "homelab | tooling | infra | notes"
tags: []
---
```

## Performance Requirements

- **Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95.**
- Total JS on the home page (excluding VitePress runtime): near zero. The home page is a markdown file + a couple of Vue components — no client-side fetching, no hydration surprises.
- Font loading: `font-display: swap`, preload the two most critical weights (regular 400, bold 700) in `<head>`.
- Images: none on the home page. If any are added later, use VitePress's image optimization or pre-optimized WebP/AVIF.
- No external network requests at runtime. Verify with devtools Network tab — should be zero third-party requests.
- Build output should be inspected: run `npm run build` and confirm the generated `.vitepress/dist/` is clean, no source maps in production, no `.map` files shipped.

## Security Requirements

### Content Security Policy

Add a strict CSP via a `<meta http-equiv="Content-Security-Policy">` tag injected in `.vitepress/config.ts` `head` option. Baseline:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'none';
```

`'unsafe-inline'` on styles is acceptable because VitePress injects inline critical CSS; `'unsafe-inline'` on scripts is **not** acceptable — if the build breaks without it, investigate and fix the root cause (usually an inline event handler somewhere), don't just allow it.

GitHub Pages does not let you set real HTTP headers, so the meta-tag CSP is the primary defense. Document this limitation in the repo README and note that if stricter headers are needed later, Cloudflare Pages or a Cloudflare Worker in front of Pages can add real headers.

### Other head tags

```
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="robots" content="index, follow">
```

Also add `X-Content-Type-Options: nosniff` equivalent — GitHub Pages already sends this, but document it.

### Dependency hygiene

- Pin exact versions in `package.json` (no `^`, no `~`). Security site, exact pins.
- Add `npm audit` to the GitHub Actions workflow as a non-blocking step that prints the result. Do not auto-fix in CI.
- Add a `.github/dependabot.yml` for weekly npm updates, grouped.
- Do not add any dependency not strictly needed. VitePress + its peer deps should be ~the entire tree.

### Secret hygiene

- No API keys, tokens, or internal URLs anywhere in the repo. This is a public GitHub Pages site.
- Add a `.gitignore` covering `.env*`, `node_modules`, `.vitepress/cache`, `.vitepress/dist`, `.DS_Store`, `*.log`.
- Explicitly call out in the README: **no company-internal content** (no AIPS, no TG rules, no client ticket references, no internal RAG frontend details). Only public CVEs, public PoCs, public writeups.

### Build reproducibility

- Commit `package-lock.json`.
- CI uses `npm ci`, not `npm install`.
- Node version pinned via `.nvmrc` and referenced in the Actions workflow.

## GitHub Actions Workflow

Create `.github/workflows/deploy.yml` using GitHub's official Pages deployment actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`). Trigger on push to `main`. Steps:

1. Checkout
2. Setup Node from `.nvmrc`
3. `npm ci`
4. `npm audit --audit-level=high` (non-blocking, `continue-on-error: true`, but visible in logs)
5. `npm run build`
6. Upload artifact from `.vitepress/dist`
7. Deploy to Pages

Use `permissions:` block with least privilege (`contents: read`, `pages: write`, `id-token: write`).

## Deliverables

Generate the full project in the current working directory. Specifically:

1. `package.json` with pinned versions
2. `.nvmrc`
3. `.gitignore`
4. `.github/workflows/deploy.yml`
5. `.github/dependabot.yml`
6. `.vitepress/config.ts` — site config, nav, head tags (CSP, etc.), sidebar auto-generation where possible
7. `.vitepress/theme/index.ts` — theme extension registering custom components
8. `.vitepress/theme/style.css` — terminal color palette, typography, prompt styling
9. `.vitepress/theme/components/Neofetch.vue`
10. `.vitepress/theme/components/Prompt.vue`
11. `.vitepress/theme/components/AsciiBanner.vue` (takes a `text` prop, renders a figlet-style banner — pre-generate the ASCII at build time or hardcode per section)
12. `public/fonts/` — placeholder README explaining which font files to drop in (do not commit font binaries you can't redistribute; link to the official source)
13. `index.md` — home page using `<Neofetch>` + whoami + `ls ~/` sections
14. `cve/index.md` — CVE index with `createContentLoader`
15. `cve/_template.md` — excluded from build via frontmatter (`layout: false` or similar) or a `.md` extension in an ignore list
16. `research/index.md`, `research/_template.md`
17. `dev/index.md`, `dev/_template.md`
18. `about/index.md` — extended whoami
19. `404.md` — ASCII segfault page
20. `README.md` — how to develop locally, how to add a new post, security notes (CSP limitation on GH Pages, no internal content rule), license

Include **one example post in each section** so the indexes aren't empty on first build:
- `cve/CVE-2025-21756.md` — Linux kernel example (generic public info only)
- `research/hybrid-bert-llama-detection.md` — high-level description, no internal details
- `dev/homelab-tailscale-cloudflare.md` — home infrastructure writeup

Keep example post content generic and publishable — no company references.

## Non-Goals (do not do these)

- No Tailwind, no component library, no CSS-in-JS.
- No light mode.
- No comments system, no analytics, no newsletter signup, no contact form.
- No scroll animations, no parallax, no motion beyond the cursor blink.
- No blog pagination (content loader + sort by date is enough for years).
- No i18n for now — single language (can be Korean or English, pick whichever the owner writes in most; mixed is fine inside posts).
- No search for v1 — VitePress local search can be added later if the corpus grows.

## Definition of Done

- `npm run dev` starts cleanly, home page renders neofetch + whoami + ls.
- `npm run build` produces `.vitepress/dist/` with no warnings.
- All three section indexes show at least one example post.
- Lighthouse run against the built output hits the targets above.
- GitHub Actions workflow is valid (can be verified with `act` or just by inspection).
- README documents the full add-a-post workflow in under 10 lines.
