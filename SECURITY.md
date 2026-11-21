# Sécurité — PranaBibi

Contexte : site **statique** sur Cloudflare Worker (pas de CMS, pas de formulaire, pas de base de données, pas de compte utilisateur). La surface d'attaque du site est donc faible. Les risques réels sont ailleurs : **comptes** (domaine, DNS, e-mail, Cloudflare, GitHub, Wix), **scraping du numéro** et **usurpation d'e-mail**. La cliente signale un antécédent de piratage par un proche : traiter ce point sérieusement, sans le documenter publiquement.

## Déjà en place

- Aucun formulaire, aucun login, aucune base de données : pas d'injection, pas de mot de passe à voler côté site.
- En-têtes de sécurité : CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, COOP/CORP.
- Numéro de téléphone **absent du HTML** : il est reconstruit au clic (bouton « Afficher le numéro ») et le lien WhatsApp est construit en JavaScript. Les robots qui ne lisent que le HTML ne le trouvent plus.
- **Adresse e-mail `contact@pranabibi.com` publique depuis le 21/11/2026** (choix de la cliente, pour être joignable professionnellement) : c'est un canal volontairement exposé. Elle est dédiée à l'institut (jamais l'adresse personnelle, jamais Lovely Secret). Prévoir les filtres antispam et ne pas la multiplier sur le site.
- JSON-LD sans `telephone` (choix assumé : moins de NAP dans le schema, la fiche Google Business Profile reste le canal principal).
- Site en `noindex` pour la maquette ; le code est public sur GitHub (`fireman358/pranabibi`).

## À faire — priorité 1 (comptes)

1. **2FA** sur : Cloudflare, GitHub, OVH (domaine + e-mail), Wix, et la boîte e-mail. Mot de passe unique par service, dans un gestionnaire de mots de passe. Jamais de mot de passe partagé.
2. **OVH** : verrouillage du domaine (registrar lock), code d'autorisation, DNSSEC, vérification des contacts admin/tech, de l'e-mail de récupération et du téléphone de récupération. Retirer tout ancien utilisateur ou délégation.
3. **Cloudflare** : 2FA, revue des membres, tokens API limités au strict nécessaire, journal d'audit. Activer les règles WAF managées et Bot Fight Mode.
4. **GitHub** : 2FA, révocation des tokens personnels et deploy keys inutilisés, revue des collaborateurs. Passer le dépôt en **privé** est recommandé : il contient le nom, l'adresse et l'historique de la cliente.
5. **Wix** : 2FA, revue des collaborateurs, changement de mot de passe. Si l'ancien site est abandonné, le fermer.
6. **E-mail** : vérifier les règles de transfert et les filtres (une règle cachée est un classique), l'accès IMAP/SMTP, les sessions actives. SPF existe déjà ; ajouter **DKIM** et **DMARC**.
7. **WhatsApp** : masquer la photo et le statut aux inconnus, bloquer si nécessaire. Le numéro n'est pas dans le HTML, mais reste le canal de contact.

## DMARC (à ajouter côté DNS)

Commencer en surveillance :

```
_dmarc TXT "v=DMARC1; p=none; adkim=r; aspf=r; pct=100"
```

Après quelques semaines sans faux positif, durcir :

```
_dmarc TXT "v=DMARC1; p=quarantine; adkim=s; aspf=s; pct=100"
```

Ne pas oublier DKIM (clé fournie par OVH) et la vérification SPF/`include:mx.ovh.com`. Sans DMARC, n'importe qui peut usurper l'adresse `@pranabibi.com`.

## Si le site ou les comptes sont compromis

1. **Cloudflare** : journal d'audit, règles DNS, membres, tokens ; révoquer les sessions et tokens inconnus.
2. **OVH** : vérifier les enregistrements DNS, le verrouillage du domaine, les contacts, les redirections e-mail.
3. **GitHub** : journal de sécurité, commits inconnus, deploy keys, tokens ; restaurer depuis un commit sain.
4. **Wix** : sessions actives, collaborateurs, pages modifiées.
5. Changer les mots de passe, activer la 2FA, conserver les preuves (captures, journaux), déposer plainte en cas de harcèlement.

## Limites honnêtes

- Le numéro est masqué du HTML, mais un robot qui exécute le JavaScript ou lit le code source peut le reconstruire. Le rendre totalement invisible est impossible si le site doit permettre d'appeler.
- L'adresse du commerce reste publique (obligation légale) ; elle figure dans les mentions légales et le footer.
- Un dépôt GitHub public expose le code et l'historique. Le passer en privé est la mesure la plus simple pour réduire la collecte automatisée.
- Aucun site statique ne protège contre un proche qui a un accès légitime à un compte : la 2FA et la rotation des accès sont les vraies protections.

## Fichiers concernés

- `public/_headers` (en-têtes)
- `public/js/main.js` (téléphone/WhatsApp reconstruits)
- `public/mentions-legales.html` (contact légal)
- `public/robots.txt` (maquette)
- `wrangler.jsonc` (routes de production)
