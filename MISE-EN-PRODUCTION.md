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


---

## 4. Etat DNS observe le 20/11/2026 (avant bascule)

Releve public sur pranabibi.com (a re-verifier dans le manager OVH le jour J) :

| Type | Nom | Valeur | TTL |
|---|---|---|---|
| NS | apex | dns200.anycast.me, 
s200.anycast.me (OVH) | - |
| A | apex | 185.230.63.107 (Wix) | 3600 |
| CNAME | www | pointing.wixdns.net (Wix) | 3600 |
| MX | apex | mx1.mail.ovh.net (1), mx2 (5), mx3 (100) | 3600 |
| TXT | apex | =spf1 include:mx.ovh.com -all | 3600 |
| TXT | apex | 1|www.pranabibi.com (verification Wix, a supprimer apres) | 3600 |
| CNAME | utodiscover | mailconfig.ovh.net | 3600 |

Pas de DKIM trouve sur les selecteurs usuels (default, selector1, mail, ovh...) : a verifier dans l'espace client OVH (Mail / MX Plan) avant de changer les NS.

### Enregistrements a recreer dans Cloudflare (hors site)

`zone
pranabibi.com.        3600 IN MX    1   mx1.mail.ovh.net.
pranabibi.com.        3600 IN MX    5   mx2.mail.ovh.net.
pranabibi.com.        3600 IN MX    100 mx3.mail.ovh.net.
pranabibi.com.        3600 IN TXT   "v=spf1 include:mx.ovh.com -all"
autodiscover          3600 IN CNAME mailconfig.ovh.net.
`

- **Apex / www** : ne pas recopier les enregistrements Wix. Attacher pranabibi.com en *custom domain* du Worker (Cloudflare cree l'enregistrement), et faire une Redirect Rule www.pranabibi.com/* -> https://pranabibi.com/ (301).
- **Ne pas activer Email Routing** : cela remplacerait les MX OVH.
- Abaisser les TTL a 300 quelques jours avant, puis changer les NS chez OVH.


---

## 5. Reprise du site par la cliente (transfert Cloudflare -> compte a elle)

Le site est heberge sur le compte Cloudflare de l'hebergeur pour accelerer la mise en production. Le jour de la reprise, tout est reversible en ~30 min, sans coupure si on prepare la cible avant.

**Principe** : une zone Cloudflare ne se "transfere" pas d'un compte a l'autre. On **recree la zone** dans le compte de la cliente, on verifie les enregistrements, puis on change les nameservers chez OVH.

### Etapes

1. **Compte a elle** : creer un compte Cloudflare gratuit, *Add a site* -> `pranabibi.com`, plan Free.
2. **Verifier l'import** : MX (`mx1/mx2/mx3.mail.ovh.net`), TXT SPF (`v=spf1 include:mx.ovh.com -all`), CNAME `autodiscover` -> `mailconfig.ovh.net`, DKIM eventuel. Cloudflare importe generalement la zone existante : controler ligne par ligne.
3. **Ne pas activer Email Routing** (il remplacerait les MX OVH).
4. **Le Worker doit etre dans le meme compte que la zone** : redeployer le site dans son compte (`wrangler deploy` avec un token de son compte, ou connexion du repo GitHub a son compte), et attacher `pranabibi.com` en custom domain.
5. **Changer les nameservers chez OVH** vers les 2 NS fournis par son compte (propagation : quelques minutes a 48 h).
6. **Verifier** : site, HTTPS, mail (envoi + reception), redirections.
7. **Nettoyer** : supprimer la zone dans l'ancien compte (elle apparaitra comme "moved"), retirer les acces temporaires.

### Points de vigilance

- Tester la **reception ET l'envoi** du mail avant et apres le changement de NS.
- La zone cible doit etre prete **avant** le changement de NS (sinon coupure DNS).
- Les Redirect Rules (301 Wix, www) sont a recreer dans le nouveau compte : garder la liste dans le repo.


---

## 6. Etat de production (20/11/2026)

- **Site en ligne** : https://pranabibi.com (apex), servi par **Cloudflare Workers** (assets statiques), deploiement automatique depuis GitHub `fireman358/pranabibi`, branche `main`.
- **`www`** : CNAME `www` -> `pranabibi.com` (proxied) + Redirect Rule 301 `www.pranabibi.com/*` -> `https://pranabibi.com/$1` (chaine de requete conservee).
- **DNS** : zone `pranabibi.com` chez Cloudflare (NS `lennon.ns.cloudflare.com` / `nucum.ns.cloudflare.com`). Le domaine reste enregistre chez OVH (echeance 09/06/2027, renouvellement auto).
- **Mail** : inchange, chez OVH (MX `mx1/mx2/mx3.mail.ovh.net`, SPF, `autodiscover`, `imap`, `smtp` en DNS only). **Ne pas activer Email Routing** dans Cloudflare.
- **Analytics** : Cloudflare Web Analytics (snippet dans les 8 pages, CSP mise a jour pour `static.cloudflareinsights.com`).
- **Anciennes URLs Wix** : 301 geres par `_redirects` (Workers Static Assets) — verifies en production.
- **Wix** : abonnement resilie (renouvellement stoppe), service actif jusqu'a l'echeance 2027 ; le domaine ne pointe plus dessus, l'ancien site n'est donc plus accessible.
- **Publier une modification** : `git push` sur `main` -> build Cloudflare -> deploy (~1 min). Verifier que le build est vert dans *Workers & Pages > pranabibi > Deploiements*.
- **Pieges** : le dossier `/brand/*` est mis en cache 7 jours par le CDN -> versionner l'URL de toute image modifiee (`?v=...`). Un enregistrement DNS supprime puis recree laisse un cache negatif (30 min) chez certains resolveurs publics.
