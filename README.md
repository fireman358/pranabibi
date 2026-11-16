# PranaBibi — Institut de Beauté & Massages

Site vitrine statique de PranaBibi (pranabibi.com), déployé sur **Cloudflare Worker** (assets statiques servis depuis `public/`, pas Cloudflare Pages).

## Structure

- `public/` : site statique (HTML/CSS/JS vanilla)
  - `index.html` : accueil, savoir-faire, soins, offre de lancement, contact
  - `tarifs.html` : carte des tarifs complète
  - `mentions-legales.html` : informations légales
  - `brand/` : logo lotus (SVG), favicons, og-image
  - `css/`, `js/`, `img/`
- `wrangler.jsonc` : configuration du Worker (assets = `./public`)
- `CHARTE.md` : charte graphique extraite de la carte de visite et des imprimés

## Déploiement

```bash
npx wrangler deploy
```

Le domaine pranabibi.com est à relier à ce Worker dans le dashboard Cloudflare (Custom Domain), en préférant le Worker aux Pages.

## Conventions

- HTML/CSS/JS vanilla, noms de fichiers en minuscules sans espaces.
- Palette et typographies : voir `CHARTE.md`.
