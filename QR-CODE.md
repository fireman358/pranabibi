# QR code — PranaBibi

**URL encodée** : `https://pranabibi.com`

| Fichier | Usage |
|---|---|
| `public/brand/qr-site.svg` | Impression (vectoriel, infini) |
| `public/brand/qr-site.png` | Web / réseaux (888 × 888) |
| `public/brand/qr-site-branded.png` | Version avec le sceau au centre (888 × 888), pour les supports imprimés |

Le QR est généré avec `segno` (correction d'erreur H, marge de 4 modules, espresso `#2A0A06` sur ivoire `#F1F1EF`).

**Régénérer** (si le domaine change) :

```bash
python tools/qr.py https://pranabibi.com
```

> Le QR pointe vers le domaine **final**. Tant que `pranabibi.com` affiche l'ancien site Wix, ne pas l'imprimer : il sera valide dès la bascule Cloudflare.
