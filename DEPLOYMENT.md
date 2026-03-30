# Deployment Guide — wayline.site

## Overview
The site is a static HTML/CSS/JS project with no build step.
It is deployed via **GitHub Pages** to the custom domain **`www.wayline.site`**.

---

## Prerequisites
- A GitHub account with push access to `pecautr/wayline.site`
- DNS access to the `wayline.site` domain (managed through your registrar)

---

## GitHub Pages Setup (one-time)

### 1 — Enable GitHub Pages in the repository

1. Go to **Settings → Pages** in the `pecautr/wayline.site` repository.
2. Under **Source**, select **Deploy from a branch**.
3. Choose the branch you want to publish (e.g. `main`) and the root folder `/`.
4. Click **Save**.

GitHub will publish the site at `https://pecautr.github.io/wayline.site/` initially.

### 2 — Configure the custom domain in GitHub

1. In **Settings → Pages → Custom domain**, enter `www.wayline.site`.
2. Click **Save**. GitHub will create (or verify) a `CNAME` file in the repo root.
   _(The `CNAME` file already exists in this repo and contains `www.wayline.site`.)_
3. Tick **Enforce HTTPS** once the certificate has been provisioned (usually a few minutes).

### 3 — DNS configuration at your registrar

Add the following DNS records to point `www.wayline.site` to GitHub Pages:

#### CNAME record (recommended for `www`)
| Type  | Host  | Value                   | TTL  |
|-------|-------|-------------------------|------|
| CNAME | `www` | `pecautr.github.io`     | 3600 |

#### Apex domain (`wayline.site` → redirect to `www`)
Add **all four** GitHub Pages A records for the apex domain:
| Type | Host | Value             | TTL  |
|------|------|-------------------|------|
| A    | `@`  | `185.199.108.153` | 3600 |
| A    | `@`  | `185.199.109.153` | 3600 |
| A    | `@`  | `185.199.110.153` | 3600 |
| A    | `@`  | `185.199.111.153` | 3600 |

> DNS changes can take up to 48 hours to propagate worldwide, though usually under 1 hour.

---

## Deploying Updates

Because there is no build step, deploying is simply pushing to the configured branch:

```bash
git add .
git commit -m "describe your change"
git push origin main
```

GitHub Actions (or the built-in Pages deployment) will pick up the push and publish within ~1–2 minutes.

### Verifying the deployment
- Go to **Actions** tab in the repository to see the Pages deployment workflow.
- Visit `https://www.wayline.site` once deployment is complete.

---

## Local Preview

No build tools are required. Any static file server works:

```bash
# Python (built-in, no install needed)
python3 -m http.server 8080 --directory .
# then open http://localhost:8080

# Node.js (npx, no global install needed)
npx serve .
# then open the printed URL
```

---

## File Reference

| File | Purpose |
|---|---|
| `index.html` | Main page — edit content here |
| `style.css` | All styles — brand colours, layout, animations |
| `CNAME` | Tells GitHub Pages which custom domain to serve |
| `patterns/*.svg` | Tileable SVG textures for each brand section |
| `.github/copilot-instructions.md` | AI coding assistant context |

---

## Updating Instagram Embeds

Each brand section contains an Instagram `<blockquote>` embed. To swap in a different post:

1. Open the post on Instagram → **⋯ → Embed**.
2. Copy the `data-instgrm-permalink` URL from the embed code.
3. In `index.html`, find the relevant `<blockquote>` and update:
   - The `data-instgrm-permalink` attribute
   - The fallback `<a href="...">` link inside `<div style="padding:16px;">`
4. Push to deploy — the embed script (`embed.js`) will re-render automatically.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Site shows 404 | Confirm Pages is enabled and branch/folder settings are correct |
| Custom domain shows GitHub 404 | Check `CNAME` file content matches DNS record exactly |
| HTTPS not working | Wait for certificate provisioning; check "Enforce HTTPS" is ticked |
| DNS not resolving | Verify A and CNAME records with `dig www.wayline.site` or `nslookup www.wayline.site` |
| Embeds not loading | Instagram embeds require a live public URL; they will not render on `localhost` without a proxy |
| Fonts not loading | Google Fonts requires internet access; system-font fallbacks are defined in `style.css` |
