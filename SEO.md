# SEO — état des lieux et plan

## 1. Ce qui est en place (on-page)

**7 pages indexables** (hors 404) :

| URL | Rôle | Title | Description |
|---|---|---|---|
| `/` | Accueil, savoir-faire, soins, institut, contact | 67 car. | 161 car. |
| `/massages` | Massages ciblés, harmonisant, ayurvédique | 45 car. | 160 car. |
| `/epilations` | Visage, corps, zones sensibles, homme | 42 car. | 155 car. |
| `/extensions-de-cils` | Cil à cil, volume russe, méga volume | 50 car. | 158 car. |
| `/tarifs` | Carte des tarifs + forfaits | 66 car. | 140 car. |
| `/faq` | 6 questions fréquentes | 61 car. | 160 car. |
| `/mentions-legales` | Informations légales | 61 car. | 137 car. |

- **Un seul H1 par page**, hiérarchie H2/H3 propre, fil d'Ariane visible sur les sous-pages.
- **Données structurées** :
  - `BeautySalon` sur l'accueil : nom, description, URL, téléphone, logo, images, adresse, `areaServed`, horaires, `sameAs`, `founder`, `foundingDate`, `slogan`, `hasMap`, `priceRange`.
  - `Service` + `Offer` sur les 3 pages prestations (prix et durées).
  - `FAQPage` sur `/faq`.
  - `BreadcrumbList` sur les sous-pages.
- **Maillage interne** : header, footer (7 liens), cartes de l'accueil, blocs « En savoir plus » sur les tarifs, breadcrumbs, liens entre prestations.
- **Sitemap** : 7 URLs avec `lastmod` et priorités.
- **Redirections 301** des anciennes URLs Wix (pages prestations, blog, événements, boutique, formules).
- **Canonical** relative (correcte sur la maquette comme sur le domaine final), OG/Twitter, `theme-color`.
- **Performance** : fontes auto-hébergées + `preload`, images dimensionnées, `loading="lazy"` sous la ligne de flottaison, `fetchpriority="high"` sur le sceau du héros, aucun tiers, CSS ~28 Ko, JS ~2 Ko.
- **Technique** : HTTPS/HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, 404 personnalisée, URLs sans extension, mobile 390 px, contrastes AA, `prefers-reduced-motion`, navigation clavier.

## 2. Le point à connaître : `noindex` de la maquette

Le site est **volontairement en `noindex`** tant qu'il est présenté sur ton domaine :

- `public/_headers` envoie `X-Robots-Tag: noindex, nofollow` ;
- `public/robots.txt` contient `Disallow: /`.

C'est volontaire : la maquette ne doit pas être indexée sous ton domaine ni concurrencer le site Wix de la cliente (contenu dupliqué).

### Passage en production (3 changements)

1. **Retirer le `noindex`** :
   - supprimer la ligne `X-Robots-Tag` de `public/_headers` (garder les autres en-têtes) ;
   - remplacer `robots.txt` par :
     ```
     User-agent: *
     Allow: /

     Sitemap: https://pranabibi.com/sitemap.xml
     ```
2. **Passer les URLs en absolu** :
   - `canonical` → `https://pranabibi.com/...` ;
   - `og:url`, `og:image`, `twitter:image` → `https://pranabibi.com/...` ;
   - JSON-LD (`url`, `image`, `@id`, `item`) → `https://pranabibi.com/...`.
3. **Attacher le domaine** :
   - ajouter `pranabibi.com` comme custom domain du Worker (route dans `wrangler.jsonc`) ;
   - Redirect Rule `www.pranabibi.com` → `pranabibi.com`.

Tout est détaillé dans `MISE-EN-PRODUCTION.md` (DNS OVH, MX/SPF/DKIM, Search Console).

## 3. À faire côté cliente (off-page et contenu)

Le on-page est prêt ; le classement local dépend surtout de signaux hors site :

1. **Google Business Profile** (priorité n°1) : catégorie « Institut de beauté » / « Salon de massage », adresse, horaires, téléphone, lien du site, photos réelles, services, posts, réponses aux avis.
2. **Avis clients** : demander un avis après chaque rendez-vous, répondre à tous. **Ne jamais fabriquer d'avis ni d'`aggregateRating`.**
3. **NAP cohérent** partout : `PranaBibi — Bibi Ahamadi, 45 Rue des Carrières, 7181 Arquennes (Seneffe), +32 493 82 83 31`.
4. **Photos réelles** : portrait (déjà), entrée, cabine, mains/huile, détail de cils. Crédit `Phil.G_Photography` pour le portrait actuel.
5. **Contenu** : 2 à 4 articles par an (bienfaits du massage, entretien des cils, épilation et peau, rituels de saison), sans promesse médicale. Une page « À propos » plus complète peut être ajoutée si la cliente fournit plus de matière.
6. **Backlinks locaux** : partenaires, presse locale (Seneffe/Arquennes), annuaires belges, associations, événements. Pas d'achat de liens.
7. **Réseaux** : Facebook/Instagram cohérents avec le site (même nom, même adresse, lien vers le site).
8. **Cohérence des prix** : forfaits recalculés (44 / 50 / 56 €, soit 4 à 6 € de moins que l'addition à la carte). Confirmer l'application de l'offre -20 % aux forfaits.

## 4. Mesure

- **Google Search Console** : conserver la propriété (vérification existante), soumettre `sitemap.xml`, suivre les impressions/clics/positions et les 404.
- **Bing Webmaster Tools** : même sitemap.
- **PageSpeed Insights / Lighthouse** : vérifier LCP/CLS/INP après mise en production.
- **Rich Results Test** : `BeautySalon`, `Service`, `FAQPage`, `BreadcrumbList`.
- **Screaming Frog** (500 URLs gratuit) : crawl du site, titres, canonical, 404, redirections.
- **KPIs** : impressions et clics GSC, appels (tel:), itinéraires Google Maps, vues GBP, position dans le pack local.

## 5. Priorités

1. **P0** — arbitrer les forfaits ; créer/optimiser la fiche Google Business Profile ; Search Console + sitemap ; photos réelles.
2. **P1** — avis clients ; cohérence NAP ; 2 articles ; backlinks locaux.
3. **P2** — analytics sans cookie (Cloudflare Web Analytics), suivi mensuel, ajustements de titres selon GSC.

## 6. Checklist de mise en production

- [ ] Forfaits/prix validés.
- [ ] `noindex` retiré (`_headers`, `robots.txt`).
- [ ] Canonical/OG/JSON-LD en absolu.
- [ ] `sitemap.xml` soumis (7 URLs).
- [ ] Custom domain + redirection `www`.
- [ ] Search Console + Bing.
- [ ] Anciennes URLs Wix en 301 vérifiées.
- [ ] 404 testée, mobile testé, contrastes OK.
- [ ] Google Business Profile à jour + photos.
- [ ] Avis demandés aux premiers clients.
