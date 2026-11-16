# PranaBibi — Institut de Beauté & Massages

Site vitrine statique de **PranaBibi** (autrice : **Bibi Ahamadi**, n° d'entreprise BE 0719.429.303), déployé sur **Cloudflare Worker** (assets statiques servis depuis `public/`, pas Cloudflare Pages).

> **État : maquette de présentation.** Le site est volontairement en `noindex` et sans domaine attaché (voir `MISE-EN-PRODUCTION.md`). Le passage sur `pranabibi.com` se fait quand la cliente valide.

## Stack

- HTML / CSS / JS vanilla, aucun framework, aucun build.
- Fontes **auto-hébergées** dans `public/fonts/` (Cinzel, Cormorant Garamond, Jost, Pinyon Script, sous licence OFL) : aucun appel à Google Fonts, donc aucun transfert d'IP vers un tiers.
- Sceau de marque : `public/brand/seal.jpg`. Portrait : `public/img/portrait.jpg` — photo **Phil.G_Photography - 2026** (crédit affiché sous le portrait).
- `wrangler.jsonc` : Worker assets-only, `404-page`, **aucune route** en mode maquette.

## Structure

```text
public/
  index.html              accueil (héros, savoir-faire, soins, offre, institut, contact)
  massages.html           page prestation massages
  epilations.html         page prestation épilations
  extensions-de-cils.html page prestation extensions de cils
  faq.html                questions fréquentes (FAQPage)
  tarifs.html             carte des tarifs + forfaits
  mentions-legales.html   éditeur, hébergement, données, prix
  404.html                page introuvable
  css/style.css           charte v2
  js/main.js              menu, révélation, année
  brand/                  sceau, favicons
  fonts/                  woff2 auto-hébergés
  img/                    portrait, og-image
  _headers                sécurité + cache + noindex maquette
  _redirects              redirections des anciennes URLs Wix
  robots.txt, sitemap.xml
wrangler.jsonc
package.json
CHARTE.md                 charte graphique appliquée
SEO.md                    état du SEO, off-page et passage en production
MISE-EN-PRODUCTION.md     bascule maquette → pranabibi.com (DNS, e-mail, routes)
OPTIONS-RENDEZ-VOUS.md    options de formulaire/reservation
```

**URLs publiques** : `/`, `/massages`, `/epilations`, `/extensions-de-cils`, `/faq`, `/tarifs`, `/mentions-legales` — sans extension. Les variantes `.html` sont redirigées en 301 par `_redirects` (le `html_handling` Cloudflare redirigerait sinon en 307).

## Développement

```bash
npm install
npm run dev        # http://127.0.0.1:8787
npm run check      # wrangler deploy --dry-run
npm run deploy     # publication sur le Worker
```

## Maquette (état actuel)

- `public/_headers` envoie `X-Robots-Tag: noindex, nofollow`.
- `public/robots.txt` : `Disallow: /`.
- Canoniques et OG **relatives** : elles fonctionnent sur n'importe quel domaine de démonstration.
- Pas de route dans `wrangler.jsonc` : `npm run deploy` publie sur `*.workers.dev`.
- Pour la déployer sur ton domaine : attache une route dans le dashboard Cloudflare (ou ajoute une route
  `maquette.tondomaine.be` dans `wrangler.jsonc`). Garde le `noindex` pendant la présentation.

## SEO

Le détail est dans **`SEO.md`**. En résumé :

- 7 pages avec titres/descriptions uniques, H1 unique, fil d'Ariane.
- Données structurées : `BeautySalon`, `Service` + `Offer`, `FAQPage`, `BreadcrumbList`.
- Maillage interne : header, footer, cartes de l'accueil, blocs « En savoir plus », liens entre prestations.
- `sitemap.xml` (7 URLs), redirections 301 des anciennes URLs Wix, canonical, OG/Twitter.
- Fontes auto-hébergées + preload, images dimensionnées et `loading="lazy"`, aucun tiers.

**La maquette reste en `noindex`** (`X-Robots-Tag` + `robots.txt`) pour ne pas concurrencer le site Wix de la cliente. Le passage en production (retrait du noindex, URLs absolues, custom domain, Search Console) est décrit dans `SEO.md` et `MISE-EN-PRODUCTION.md`.

## Passage sur `pranabibi.com`

Tout est détaillé dans **`MISE-EN-PRODUCTION.md`** : accès/ownership du domaine, sauvegarde de la zone OVH,
MX/SPF/DKIM (e-mail de la cliente), changement de nameservers, custom domain, redirection `www`,
retrait du `noindex`, Search Console, migration Wix.

Résumé : le Worker et la zone DNS doivent être dans le **même compte Cloudflare**. Le plus propre est
qu'elle crée son compte Cloudflare, ajoute `pranabibi.com`, t'invite comme membre, puis change les
nameservers chez OVH. Ne jamais changer les NS sans avoir sauvegardé les MX/SPF/DKIM : son e-mail OVH
tomberait.

## Migration depuis Wix

Le site Wix comptait ~36 URLs (6 pages, 14 pages prestations, 3 articles, 3 événements, 9 produits,
1 page formules). `public/_redirects` redirige les anciennes URLs vers les pages actuelles.

**Attention** : les 9 produits de la boutique ressemblent à la branche **Lovely Secret** (VDI) et non au
positionnement bien-être/massage de PranaBibi. Ne pas les importer sur ce site. Vérifier également les
événements/articles, qui peuvent être des démos du template Wix.

## Contenus à confirmer

- **Prix** : la carte suit le folder fourni (qui fait foi). Certains prix diffèrent du site Wix
  (aisselles 12 vs 14 €, jambes 24 vs 30 €, maillot 18 vs 22 €…).
- **Forfaits** : recalculés sur les prix du folder — Escale Classique **44 €** (48 € à la carte), Escale
  Intégrale **50 €** (56 €), Total Body **56 €** (62 €), soit 4 à 6 € d'économie. Confirmer si l'offre
  de lancement -20 % s'applique aussi aux forfaits.
- **Horaires** : repris de la page contact du site (Lun–Ven 9h–19h, Sam & Dim 10h–20h, sur rendez-vous).
- **Photos** : le portrait réel (Phil.G) est utilisé. Les autres visuels du site Wix sont des images
  IA/stock (dont une avec le logo Wix) : non repris.
- **Réservation** : pas de réservation en ligne pour la maquette ; le site renvoie vers le téléphone.
  Voir `OPTIONS-RENDEZ-VOUS.md` pour la suite (Worker + Resend + Turnstile recommandé).
- **E-mail** : aucun e-mail PranaBibi dédié. Ne pas réutiliser `@lovelysecret.be` (branche VDI distincte).
