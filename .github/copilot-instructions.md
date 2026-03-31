# Copilot Instructions — wayline.site

## Project Overview
Static website for **Wayline** (`www.wayline.site`), hosted on GitHub Pages.
Wayline is a social-media brand family focused on building a better society through better cities, transit, wilderness, and good news. The site acts as a landing hub that links out to the four Instagram channels.

## Brand Colours
| Brand | Handle | Hex |
|---|---|---|
| Wayline (main) | @by_wayline | `#CB7F00` |
| Transit | @transit_by_wayline | `#12A19A` |
| Cities | @cities_by_wayline | `#007A1F` |
| Wilderness | @wilderness_by_wayline | `#A19F12` |

All colour tokens are defined as CSS custom properties in `style.css` under `:root`.

## File Structure
```
index.html               Main page (single-page layout)
style.css                All styles — fonts, layout, animations, brand sections
main.js                  Scroll-reveal IntersectionObserver
CNAME                    GitHub Pages custom domain (www.wayline.site)
patterns/
  hero.svg               Dot-network pattern — hero section background
  transit.svg            Subway-map lines & station dots — transit section
  cities.svg             Street-grid with blocks & diagonal — cities section
  wilderness.svg         Contour lines (topographic) — wilderness section
static/
  img/
    WaylineFavicon.png   Site favicon
blog/
  index.html             Blog listing page (manually maintained)
  post.html              Blog post reader (fetches + renders markdown)
  blog.js                Markdown parser, frontmatter parser, post loader
  blog.css               Blog-specific typography and layout styles
  posts/
    *.md                 Blog posts — YAML frontmatter + Markdown body
.github/
  copilot-instructions.md  This file
DEPLOYMENT.md            Deployment guide
```

## Design Principles
- **Dark section per brand** — each brand section uses a near-black tinted with its brand colour.
- **Pattern textures** — SVG tile patterns reinforce each brand's identity (map grid, subway lines, contour lines, dot network).
- **Decorative silhouettes** — inline SVG skyline (cities) and mountain range (wilderness) at low opacity.
- **Wave transitions** — custom multi-path SVG waves between every section, using the next section's background colour.
- **Scroll reveal** — `.reveal` class + `IntersectionObserver` in a small inline script; elements animate in via opacity + translateY.
- **Staggered delays** — `.reveal-delay-1` through `.reveal-delay-4` add progressive entrance timing.
- **No build tools** — pure HTML/CSS/vanilla JS, deploys directly from the repo root.

## Fonts
- **Space Grotesk** — headings, nav, labels (geometric, modern)
- **DM Sans** — body copy (clean, readable)
Both loaded from Google Fonts CDN with system-font fallbacks.

## Adding / Editing Content
- To update **Instagram embed posts**: change the `data-instgrm-permalink` attribute and the fallback `<a>` inside each `<blockquote>`.
- To add a **new brand section**: copy an existing brand section block in `index.html`, give it a unique `id`, create a matching CSS class in `style.css` with `background-color`, `background-image: url('patterns/...')`, and add a new pattern SVG to `patterns/`.
- To update **colours**: edit the CSS custom property in `:root` — changes propagate everywhere.

## Instagram Embeds
The page loads `//www.instagram.com/embed.js` asynchronously at the end of `<body>`. Embeds render client-side; they appear as plain links in feed-readers and no-JS environments.

## Accessibility
- All decorative SVGs carry `aria-hidden="true"`.
- Pattern backgrounds are purely decorative and do not carry semantic meaning.
- Brand colour + white text combinations should be checked against WCAG AA (contrast ≥ 4.5:1 for normal text).

## Security
- CSP meta tag in `index.html` and `404.html`: `script-src 'self' https://www.instagram.com`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' https: data:`, `frame-src https://www.instagram.com`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`.
- `'unsafe-inline'` for styles is required because Instagram embeds inject inline styles; this is documented and accepted.
- All `target="_blank"` links must use `rel="noopener noreferrer"` — enforce this when adding new links.
- No inline `<script>` blocks — JavaScript lives in `main.js` only.
- Instagram embed script loaded via explicit `https://` URL (never protocol-relative `//`).
- GitHub Pages automatically provides `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection` headers.
- HTTPS is enforced via the GitHub Pages "Enforce HTTPS" setting (see `DEPLOYMENT.md`).

## Deployment
See `DEPLOYMENT.md` for full instructions.
