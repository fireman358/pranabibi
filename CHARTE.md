# Charte graphique — PranaBibi

Charte **appliquée** dans `public/css/style.css`. Relevée sur les supports fournis par la cliente (carte de visite recto/verso, folder 2 volets) et sur le logo réel de l'institut — ces supports font foi.

## 1. Signes de marque

| Signe | Fichier | Usage |
|---|---|---|
| Sceau circulaire (mandala cuivre, « PRANA BIBI », lotus lumineux) | `public/brand/seal.jpg` | En-tête, héros, favicon, OG, footer, séparateurs |
| Portrait | `public/img/portrait.jpg` | Section « L'institut » — photo **Phil.G_Photography - 2026**, crédit affiché |
| Script « PranaBibi » | texte en **Pinyon Script** (OFL) | Wordmark de l'en-tête et du héros |
| Lotus lumineux | contenu dans le sceau | Pictogramme (icônes de soins) |
| Monogramme P•B | `brand-source/monogram-source.png` (hors dépôt) | Réservé aux supports imprimés / réseaux |

> Les fichiers vectoriels d'origine (AI/EPS/SVG) restent à demander à la cliente. Le sceau publié est un détourage haute définition du logo fourni.

## 2. Palette

| Rôle | Token | Hex | Usage |
|---|---|---|---|
| Fond sombre profond | `--espresso` | `#2A0A06` | Héros, en-tête, footer |
| Fond sombre encore plus profond | `--espresso-deep` | `#1C0603` | Footer |
| Rouge profond | `--bordeaux` | `#540C07` | Sections sombres, titres, **prix** |
| Bordeaux clair | `--bordeaux-light` | `#7A1A10` | Accents |
| Cuivre | `--copper` | `#9A5531` | Aplats, signature |
| Terracotta | `--terracotta` | `#B0603A` | Aplats |
| Or antique | `--gold` | `#C99D52` | Filets, icônes, libellés sur fond sombre |
| Or clair | `--gold-light` | `#F6D490` | Titres et textes sur fond sombre |
| Or foncé | `--gold-dark` | `#8A6420` | Petites capitales sur fond clair |
| Parchemin | `--parchment` | `#E3D9C3` | Fond clair principal |
| Ivoire | `--ivory` | `#F1F1EF` | Cartes claires |
| Encre | `--ink` | `#1A0F0A` | Corps de texte |
| Texte secondaire | `--ink-soft` | `#5B4636` | Notes, légendes |
| Cuivre texte | `--copper-text` | `#7A3E22` | Sur-titres sur fond clair |

### Contrastes — règles

- **Or `#C99D52` sur parchemin : 1,8:1 → décor uniquement** (filets, icônes). Jamais pour un prix ou un libellé.
- Prix : **bordeaux `#540C07` sur ivoire = 13:1**.
- Corps : encre sur parchemin = 13,4:1.
- Or sur espresso / bordeaux : 7,4:1 et 5,6:1 → OK pour le texte sur fond sombre.
- Cuivre `#9A5531` sur parchemin : 4,0:1 → grand texte uniquement (signature 36 px).
- Cuivre texte `#7A3E22` sur parchemin : 5,9:1 → sur-titres et petits textes.

## 3. Typographie

| Rôle | Police | Réglages |
|---|---|---|
| Wordmark / signature | **Pinyon Script** | 34–118 px, or dégradé |
| Capitales gravées (baseline, eyebrows, boutons, nav) | **Cinzel** | 11–15 px, `letter-spacing:.18em–.34em`, uppercase |
| Titres | **Cormorant Garamond** | 28–58 px, 500/600 |
| Corps & UI | **Jost** | 15,5–17 px, 400, interligne 1,7 |

Les 5 fichiers woff2 sont dans `public/fonts/` et déclarés en `@font-face` avec `font-display: swap`. Aucun appel à Google Fonts.

## 4. Motifs

- Cadre doré double (héros), filets or de 1 px, séparateurs avec le sceau.
- Fond parchemin avec grain très léger, sections sombres en dégradé espresso/bordeaux.
- Cartes ivoire à bordure or, coins arrondis 10 px.
- Prix en sérif bordeaux avec pointillés de liaison (comme le folder p. 2).
- Boutons rectangulaires à coins 8 px (pas de pilules).
- Portrait ovale en duotone chaud, anneau or, dans la section « L'institut ».

## 5. À faire / à ne pas faire

| ✅ | ❌ |
|---|---|
| Sceau réel, script Pinyon, or antique | Lotus inventé, Great Vibes, jaune `#D4AF37` |
| Parchemin `#E3D9C3` + bordeaux `#540C07` | Chocolat `#5C2E1E` + crème froide |
| Prix en bordeaux | Prix en or sur fond clair |
| Photos réelles (portrait, institut) | Site 100 % texte |
| Fontes auto-hébergées | `@import` Google Fonts |
| Texte ≥ 4,5:1 | Texte blanc sur crème |
