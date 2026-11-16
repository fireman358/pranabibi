# Passage de la maquette à `pranabibi.com`

## 1. État actuel : maquette sur ton domaine

La maquette est volontairement **non indexable** et **sans domaine attaché** :

- `public/_headers` envoie `X-Robots-Tag: noindex, nofollow` sur toutes les pages.
- `public/robots.txt` contient `Disallow: /`.
- Les URLs canoniques sont **relatives** (`/`, `/tarifs`, `/mentions-legales`) : elles fonctionnent sur n'importe quel domaine.
- `wrangler.jsonc` ne contient **aucune route** : `npm run deploy` publie sur `*.workers.dev`.
- Les URLs OG sont relatives ; sur certaines plateformes sociales, l'aperçu peut ne pas s'afficher tant qu'il n'y a pas d'URL absolue.

### Déployer la maquette sur ton domaine

1. Si ton domaine est déjà dans **ton** compte Cloudflare : ajoute une route dans le dashboard
   (`Workers & Pages` → `pranabibi` → `Settings` → `Domains & Routes`) ou dans `wrangler.jsonc` :
   ```jsonc
   "routes": [{ "pattern": "maquette.tondomaine.be", "custom_domain": true }]
   ```
2. Si ton domaine n'est pas encore dans Cloudflare : ajoute-le, change les nameservers chez ton registrar,
   puis attache le Worker.
3. Déploie : `npm run deploy`.
4. Garde le `noindex` pendant toute la présentation : la maquette ne doit pas concurrencer le vrai site
   ni être indexée sous ton domaine.

> Pour les aperçus sociaux pendant la démo, tu peux mettre l'URL absolue de ton domaine dans
> `og:image` / `twitter:image` (par exemple `https://maquette.tondomaine.be/img/og-image.jpg`).

---

## 2. Si elle accepte : utiliser `pranabibi.com`

Le domaine est **sa propriété**. Trois façons de travailler, de la plus propre à la moins propre :

| Option | Qui contrôle la zone | Ce qu'elle doit faire | Recommandation |
|---|---|---|---|
| **A** — Son compte Cloudflare, toi invité | Elle | Créer un compte Cloudflare, ajouter le domaine, t'inviter comme membre (ou te donner un token API limité) | ✅ La plus propre : elle reste propriétaire |
| **B** — Ton compte Cloudflare, elle change les NS | Toi | Ajouter le domaine à ton compte, puis changer les nameservers chez OVH | ⚠️ Possible, mais elle te confie son DNS : à encadrer par écrit |
| **C** — Transfert du domaine | Toi | Transfert OVH → ton registrar | ❌ À éviter : elle perd la main sur son nom |

Le Worker et la zone DNS doivent être **dans le même compte Cloudflare** pour attacher un custom domain.

### Procédure technique (option A ou B)

1. **Sauvegarder la zone OVH** : exporter tous les enregistrements, en particulier
   - MX : `mx1.mail.ovh.net` (1), `mx2.mail.ovh.net` (5), `mx3.mail.ovh.net` (100)
   - TXT SPF : `v=spf1 include:mx.ovh.com -all`
   - CNAME `autodiscover` → `mailconfig.ovh.net`
   - DKIM (sélecteur à récupérer chez OVH), TXT de vérification Google.
2. **Ajouter le domaine à Cloudflare**, importer la zone, vérifier MX/SPF/autodiscover/DKIM.
3. **Ne pas activer Email Routing** : cela remplacerait les MX OVH et couperait sa boîte.
4. Abaisser les TTL à 300 s, attendre 24–48 h.
5. **Changer les nameservers chez OVH** vers ceux de Cloudflare.
6. **Vérifier l'e-mail** (réception + envoi) avant de toucher au site.
7. Déployer le Worker, attacher `pranabibi.com` comme custom domain, puis créer une **Redirect Rule**
   `www.pranabibi.com` → `pranabibi.com` (le Worker n'a pas besoin d'être attaché à `www`).
8. **Retirer le mode maquette** :
   - supprimer `X-Robots-Tag` de `public/_headers` ;
   - remettre `Allow: /` + `Sitemap:` dans `public/robots.txt` ;
   - passer les canoniques/OG/JSON-LD en absolu `https://pranabibi.com` (7 pages : accueil, massages, épilations, extensions de cils, FAQ, tarifs, mentions) ;
   - vérifier `public/sitemap.xml` (déjà à 7 URLs en `pranabibi.com`) ;
   - ajouter `"routes": [{ "pattern": "pranabibi.com", "custom_domain": true }]` dans `wrangler.jsonc`.
9. **Search Console** : conserver la propriété (la vérification Google existante), soumettre le sitemap,
   surveiller les 404 et les redirections des anciennes pages Wix.
10. **Wix** : garder l'ancien site jusqu'au basculement, exporter les contenus utiles, puis résilier.
    Les anciennes URLs sont redirigées par `public/_redirects` : les pages prestations Wix vers
    `/massages`, `/epilations` ou `/tarifs#forfaits`, le reste vers l'accueil ou le contact.

### Check-list de bascule

- [ ] Accord écrit sur la gestion du domaine et du DNS.
- [ ] Export complet de la zone OVH.
- [ ] Zone Cloudflare + MX/SPF/DKIM/autodiscover vérifiés.
- [ ] E-mail testé avant/après changement de NS.
- [ ] Worker déployé et testé sur `*.workers.dev`.
- [ ] Custom domain `pranabibi.com` + redirection `www`.
- [ ] `noindex` retiré, canoniques absolues, sitemap soumis.
- [ ] Anciennes URLs Wix en 301 vérifiées.
- [ ] Search Console + Google Business Profile à jour.
- [ ] Rétrocession des accès (ou contrat de maintenance) à la fin.

---

## 3. Ce qu'il faut demander avant la bascule

- Son accord écrit pour modifier les nameservers.
- L'accès OVH (ou qu'elle fasse le changement elle-même, guidée).
- Un **e-mail PranaBibi dédié** (ne pas utiliser `@lovelysecret.be`, branche VDI distincte).
- La confirmation des prix/forfaits et des horaires.
- Les photos définitives + credit photographe (`Phil.G_Photography` pour le portrait actuel).
