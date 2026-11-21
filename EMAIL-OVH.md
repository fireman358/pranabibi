# Adresse e-mail professionnelle — PranaBibi (OVHcloud)

Objectif : créer une adresse **`contact@pranabibi.com`** qui reçoit et envoie, puis la brancher
proprement sur le domaine dont le DNS est chez **Cloudflare** et le mail chez **OVHcloud**.
L'adresse est créée, testée et intégrée au site (voir § 6 et § 8).

## 0. Ce qu'on sait de son compte (relevé du 20/11/2026)

| Élément | État |
|---|---|
| Domaine `pranabibi.com` | Chez OVH (registrar), expiration 09/06/2027, renouvellement auto |
| Zone DNS | **Cloudflare** (`lennon` / `nucum.ns.cloudflare.com`) — plus chez OVH |
| Hébergement | OVH **Hébergement Free 100 Mo** (`pranabm.cluster129.hosting.ovh.net`), actif jusqu'au 09/06/2027 |
| Service e-mail | **MX Plan actif**, offre `MXPLAN 1 hosting`, échéance 09/06/2027, webmail **Roundcube** |
| Comptes e-mail | **1 / 1 configuré** : `contact@pranabibi.com` créée et opérationnelle |
| Redirections | **1 / 1000** : `postmaster@pranabibi.com` → `contact@pranabibi.com` (repointée le 21/11/2026) |
| MX | `mx1.mail.ovh.net` (1), `mx2` (5), `mx3` (100) → **déjà en place sur Cloudflare** |
| SPF | `v=spf1 include:mx.ovh.com -all` → **déjà en place** |
| Autodiscover / imap / smtp | CNAME vers `mailconfig.ovh.net` et `ssl0.ovh.net` → **déjà en place** |
| DKIM | 2 CNAME `ovhmo-selector-1/2._domainkey` publiés dans Cloudflare (DNS only) → **`dkim=pass`** |
| DMARC | `_dmarc` en place depuis le 21/11 : `p=none` (surveillance), `rua` vers `contact@` |
| Analytics / site | Servis par Cloudflare Workers, indépendants du mail |

> **Piège n°1** : ne jamais activer **Cloudflare Email Routing**. Il remplace les MX et couperait
> la boîte OVH. Les MX doivent rester chez OVH.
>
> **Piège n°2** : l'adresse avec laquelle elle se connecte à OVH (ou son e-mail de contact) n'est
> **pas** une adresse professionnelle. Une adresse `@pranabibi.com` doit être créée dans le service
> MX Plan.

## 1. Récupérer l'accès au compte OVH

1. Aller sur <https://www.ovh.com/manager/> et se connecter avec l'identifiant client
   (`gx68078-ovh` d'après la facture) — ou l'e-mail de contact du compte.
2. Mot de passe oublié → « Mot de passe oublié » ; le lien part sur **l'e-mail de contact du compte**.
3. Si cet e-mail n'est plus accessible (compte jamais utilisé) : la réinitialisation par e-mail est
   impossible. Ouvrir un ticket au support OVH (<https://help.ovhcloud.com/>) depuis la page d'aide,
   avec pièce d'identité et justificatif de domicile au nom de **Bib Faiza AHAMADI**, pour récupérer
   le compte. Prévoir 24–72 h.
4. Une fois connecté : **Paramètres du compte → Sécurité** → activer la double authentification,
   vérifier le téléphone et l'e-mail de secours.

## 2. État confirmé : MX Plan actif, boîte créée

Relevé de la console des 20 et 21/11/2026 : service **MX Plan**, infrastructure `MXPLAN 1 hosting`,
webmail **Roundcube**, **1 / 1 compte** configuré (`contact@`), **1 / 1000 redirection**, et
« Domaine à configurer : votre domaine est correctement configuré » (MX/SPF/DKIM vus par OVH).

**La seule redirection (relevé du 20/11, repointée le 21/11/2026)** : `postmaster@pranabibi.com` →
`contact@pranabibi.com`. À l'origine, elle pointait vers `bibi.lovelysecret@gmail.com` (ancienne activité).

- `postmaster@` est une **adresse technique** (rôle standard du mail, probablement créée à la
  souscription). Ce n'est pas une adresse professionnelle, et elle ne sert à rien pour le site.
- La cible d'origine était un **Gmail lié à Lovely Secret**, l'ancienne activité de la cliente. Rien à
  voir avec le positionnement actuel (institut de beauté & massages).
- **Elle ne bloque pas `contact@`** : les deux noms sont différents, la boîte peut être créée sans conflit.
- **Repointage fait le 21/11/2026** : elle pointe vers `contact@pranabibi.com`, et la boîte existe
  bien (1 / 1) : la redirection est valide.

> **À qui attribuer `postmaster@` ?** Ce n'est **pas** une boîte personnelle : c'est l'adresse de rôle
> normalisée (RFC 5321) par laquelle un domaine accepte les messages techniques (erreurs de remise,
> signalements d'abus, problèmes de messagerie). Elle doit être **relevée**, pas forcément lue par
> une personne en particulier. Cible recommandée : `contact@pranabibi.com`, pour que la cliente reste
> propriétaire de tout. Un prestataire peut la recevoir pendant la mise en place, mais il faut alors
> la repointer vers la cliente à la remise du site — sinon elle est oubliée et le prestataire continue
> de recevoir le courrier technique du domaine.

> **Ne jamais réutiliser ni afficher l'adresse Lovely Secret** sur le site : c'est une branche
> distincte, sans rapport avec PranaBibi (déjà acté dans `README.md` et `SECURITY.md`).

> Une **redirection ne permet pas d'envoyer** : pour une adresse professionnelle qui répond, il faut
> une **boîte** (le compte à créer). Les 1000 redirections disponibles serviront d'alias
> (`rdv@`, `bonjour@`…) vers cette boîte unique.

> Si elle veut **plusieurs** boîtes (`contact@` + `rdv@` + `bibi@`), l'offre n'en comprend qu'une :
> les autres noms passeront par des **redirections** vers `contact@`, ou par une offre payante
> (Zimbra Mail / Email Pro). Pour démarrer, **une seule boîte `contact@` suffit**.

## 3. Créer l'adresse

Console → **Web Cloud → E-mails → MX Plan → pranabibi.com** → onglet **« Compte e-mail »** →
bouton **« Ajouter un compte »**.

| Champ (Roundcube) | Valeur conseillée |
|---|---|
| **Nom du compte** | `contact` (le domaine suit) → `contact@pranabibi.com` |
| **Description** | `PranaBibi — boîte principale` (facultatif, pour s'y retrouver dans la console) |
| **Taille du compte** | 5 Go (maximum de l'offre) |
| **Mot de passe** | 12+ caractères (9–30 max), majuscule + minuscule + chiffre + spécial, **unique**, dans un gestionnaire de mots de passe (Bitwarden, Keepass…) |

Règles OVH : 2–32 caractères avant le `@`, sans accent, seuls `.` `,` `-` `_` autorisés ; mot de passe
9–30 caractères sans accent.

Le **nom d'affichage de l'expéditeur** se règle ensuite dans le webmail Roundcube :
**Paramètres → Identités** → `PranaBibi — Institut de beauté & massages`.

Attendre quelques instants que le compte soit provisionné.

> **Technologie** : l'onglet « Vue d'ensemble » indique la ligne **Webmail** — *Roundcube*, *Zimbra*
> ou *OWA*. Cela change l'interface et l'emplacement de certains réglages, pas les paramètres
> IMAP/SMTP. La technologie est figée pour ce service.

## 4. DNS à faire côté Cloudflare

Le domaine est correctement orienté pour la réception (MX et SPF en place), **mais DKIM échoue** :
les messages sont signés par OVH avec le sélecteur `ovhmo-selector-1`, et la clé publique n'est pas
publiée dans le DNS. Preuve dans l'en-tête d'un message reçu chez Gmail le 21/11/2026 :

```text
dkim=permerror (no key for signature) header.i=@pranabibi.com header.s=ovhmo-selector-1
spf=pass ... smtp.mailfrom=contact@pranabibi.com
```

Vérifié en DNS : `ovhmo-selector-1._domainkey.pranabibi.com` et `ovhmo-selector-2...` n'existent ni en
CNAME ni en TXT. C'est **la cause du classement en spam** (une signature invérifiable est pire que pas
de signature), et il manque aussi **DMARC**.

> **Piège du panneau « Délivrabilité » d'OVH** : il interroge la zone DNS **OVH** (celle qui n'est plus
> autoritative), pas Cloudflare. Il peut donc afficher « DKIM Configuré » alors que le DNS public n'a
> aucun enregistrement DKIM — c'est exactement le cas ici (capture du 21/11). Ne pas se fier à cette
> pastille, et **ne pas cliquer « Configurer la zone DNS pour MX Plan »** : ce bouton écrit dans la
> zone OVH, pas chez Cloudflare, donc il ne corrige rien. La seule source de vérité est l'en-tête d'un
> e-mail reçu (`dkim=pass`).

| Type | Nom | Cible / valeur | Proxy | État |
|---|---|---|---|---|
| MX | `@` | `mx1.mail.ovh.net` prio 1 | — | ✅ déjà là |
| MX | `@` | `mx2.mail.ovh.net` prio 5 | — | ✅ déjà là |
| MX | `@` | `mx3.mail.ovh.net` prio 100 | — | ✅ déjà là |
| TXT | `@` | `v=spf1 include:mx.ovh.com -all` | — | ✅ déjà là |
| CNAME | `autodiscover` | `mailconfig.ovh.net` | **DNS only** | ✅ déjà là |
| CNAME | `imap` | `ssl0.ovh.net` | **DNS only** | ✅ déjà là |
| CNAME | `smtp` | `ssl0.ovh.net` | **DNS only** | ✅ déjà là |
| CNAME | `ovhmo-selector-1._domainkey` | valeur `Cible` fournie par OVH (`…aj.dkim.mail.ovh.net.`) | **DNS only** | ❌ **manquant** |
| CNAME | `ovhmo-selector-2._domainkey` | valeur `Cible` fournie par OVH | **DNS only** | ❌ **manquant** |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contact@pranabibi.com; adkim=r; aspf=r; pct=100` | — | ❌ à ajouter |

**Récupérer les deux CNAME DKIM** (le nom du sélecteur est connu : `ovhmo-selector-1`) :

1. **Le plus simple** : interface OVH → onglet **DNS** du domaine (ou « Domaines & DNS → Zone DNS »).
   La zone OVH, encore conservée même si elle n'est plus autoritative, contient les deux CNAME
   `ovhmo-selector-1._domainkey` et `ovhmo-selector-2._domainkey` avec leur cible : c'est exactement
   ce qu'il faut recopier dans Cloudflare.
2. Sinon : panneau DKIM de l'offre e-mail (« Enregistrements attendus »), ou console API
   <https://api.eu.ovhcloud.com/console/> → login SSO → `GET /email/domain/pranabibi.com/dkim` →
   recopier les deux champs `cname`.
3. Dans Cloudflare : type **CNAME**, nom = la partie avant `.pranabibi.com` (ex.
   `ovhmo-selector-1._domainkey`), cible = la valeur `Cible`, proxy **DNS only** (nuage gris).
4. Attendre la propagation (quelques minutes), puis dans OVH **« Relancer la vérification »** et
   **« Activer DKIM »** (30 min à 24 h).
5. Contrôle : `ovhmo-selector-1._domainkey.pranabibi.com` doit renvoyer un TXT `v=DKIM1; k=rsa; p=…`.

**DMARC** : créé dans Cloudflare le 21/11 — TXT `_dmarc` :
`v=DMARC1; p=none; rua=mailto:contact@pranabibi.com; adkim=r; aspf=r; pct=100`.
Mode surveillance ; après 2–3 semaines sans faux positif, durcir en
`p=quarantine; adkim=s; aspf=s; pct=100`.

**Ce qu'il ne faut pas toucher** : les enregistrements `A`/`AAAA`/`CNAME` du site (`@`, `www`),
ils pointent vers le Worker Cloudflare. Et **ne pas activer Email Routing**.

## 5. Accéder à la boîte

- **Webmail** : <https://www.ovhcloud.com/fr/mail/> → `contact@pranabibi.com` + mot de passe.
  (Une double identification peut être demandée : une sur le portail, une dans le webmail.)
- **IMAP** (réception, recommandé) : serveur `imap.mail.ovh.net` (ou `ssl0.ovh.net`), port **993**, SSL/TLS,
  identifiant = adresse complète.
- **POP** : `pop.mail.ovh.net`, port **995**, SSL/TLS.
- **SMTP** (envoi) : `smtp.mail.ovh.net` (ou `ssl0.ovh.net`), port **465**, SSL/TLS,
  identifiant = adresse complète.
- **Autoconfiguration** : `autodiscover.pranabibi.com` est en place → Outlook et Mail iOS devraient
  se configurer seuls en saisissant l'adresse et le mot de passe.

Guides OVH : [iPhone/iPad](https://docs.ovhcloud.com/fr/guides/web-cloud/email-and-collaborative-solutions/mx-plan/how-to-configure-ios.md),
[Android](https://docs.ovhcloud.com/fr/guides/web-cloud/email-and-collaborative-solutions/mx-plan/how-to-configure-android.md),
[Outlook](https://docs.ovhcloud.com/fr/guides/web-cloud/email-and-collaborative-solutions/mx-plan/how-to-configure-outlook-2016.md),
[Thunderbird](https://docs.ovhcloud.com/fr/guides/web-cloud/email-and-collaborative-solutions/mx-plan/how-to-configure-thunderbird-windows.md),
[Mail macOS](https://docs.ovhcloud.com/fr/guides/web-cloud/email-and-collaborative-solutions/mx-plan/how-to-configure-mail-macos.md).

## 6. Tester avant de la mettre partout

1. Depuis un Gmail/Outlook externe, envoyer un message à `contact@pranabibi.com` → il doit arriver.
2. Répondre depuis le webmail vers ce Gmail → il doit arriver **sans passer en spam**.
3. Dans Gmail, ouvrir le message reçu → **« Afficher l'original »** : `SPF: PASS`, `DKIM: PASS`,
   `DMARC: PASS`.
4. Test de délivrabilité : envoyer un message à une adresse **mail-tester.com** → viser **10/10**.
5. Vérifier l'envoi depuis l'application mobile ET depuis le webmail.

> **Résultat du 21/11/2026** : mail-tester **10/10**, « Vous êtes parfaitement authentifié »
> (SPF, DKIM, DMARC), serveur non blocklisté. Le premier test Gmail était en spam à cause du DKIM
> manquant ; après publication des 2 CNAME et de DMARC, l'authentification passe. Un cache négatif
> DNS de ~30 min chez Google peut retarder la prise en compte : refaire le test 30 min plus tard.

### Si un message part en spam (premiers jours, domaine et boîte neufs)

- **Vers `contact@` (le message arrive dans « Indésirables » de Roundcube)** : ouvrir le message →
  **« Pas indésirable »**, ajouter l'expéditeur au carnet d'adresses. L'antispam OVH n'a pas encore
  d'historique sur cette boîte ; quelques jours suffisent en général à le calmer.
- **Depuis `contact@` vers Gmail/Outlook** : lire les en-têtes (`SPF`, `DKIM`, `DMARC`). Si DKIM
  manque, le configurer (§ 4) — c'est la cause n°1 de spam pour un domaine neuf. Si tout est `PASS`,
  c'est la **réputation** : cliquer « Non spam », ajouter l'adresse aux contacts, et refaire le test
  mail-tester 24–48 h plus tard.
- Ne pas envoyer de message vide, avec beaucoup de liens ou en plusieurs exemplaires d'affilée :
  cela dégrade la réputation d'un domaine qui n'en a pas encore.

## 7. Réglages « professionnels »

- **Signature** : `Bibi Ahamadi — PranaBibi, Institut de beauté & massages`, adresse, téléphone,
  `pranabibi.com`, TVA BE 0719.429.303, Instagram/Facebook. Pas de citation ni d'image lourde.
- **Nom d'affichage** : `PranaBibi` (et non « Bibi » seul) pour que l'expéditeur soit identifiable.
- **Réponse automatique** : à activer pendant les congés, avec un délai de réponse annoncé.
- **Filtres / antispam** : MX Plan Roundcube → « Gérer les filtres » ; Zimbra/OWA → règles de boîte
  de réception dans le webmail.
- **Redirections** : si l'offre le permet, `rdv@` et `bonjour@` → `contact@` (à défaut, une seule adresse).
- **Sécurité** : 2FA sur le compte OVH, mot de passe unique, vérifier qu'aucune **règle de transfert**
  ou délégation inconnue n'existe, et que le téléphone de récupération est le bon.

## 8. Intégration au site (faite le 21/11/2026)

| Fichier | Modification |
|---|---|
| `public/index.html` (section Contact) | bouton **« Afficher l'e-mail »** sous le téléphone : l'adresse est construite en JS, jamais dans le HTML |
| `public/mentions-legales.html` | **adresse e-mail en clair** (obligation légale : loi du 11/03/2003, art. 7 §1er, 3°) + OVH et mesure d'audience |
| `public/faq.html` | « par téléphone ou par e-mail » via la page Contact, sans adresse en clair |
| `public/index.html` (JSON-LD `BeautySalon`) | **pas** de champ `email` : rien de machine-lisible dans le HTML |
| `public/css/style.css` + `public/js/main.js` | styles du bouton et construction de l'adresse ; versions `v=20261121b` |
| `public/_headers` | inchangé (`mailto:` n'est pas concerné par la CSP) |

Points d'attention :

- Le téléphone reste masqué pour limiter le scraping. **L'adresse e-mail est désormais publique** :
  prévoir les filtres antispam et ne pas multiplier les adresses sur le site.
- `SECURITY.md` et `MODIFICATIONS.md` ont été mis à jour en conséquence.

## 9. Checklist

- [ ] Accès à la console OVH récupéré, 2FA activée.
- [x] Redirection `postmaster@` repointée vers `contact@` (21/11).
- [x] `contact@pranabibi.com` créée, mot de passe fort enregistré.
- [x] Webmail Roundcube accessible.
- [x] Réception testée depuis un Gmail.
- [x] Envoi testé vers un Gmail — **mail-tester 10/10**, « parfaitement authentifié » (21/11).
- [x] DKIM : `dkim=pass` dans les en-têtes (2 CNAME Cloudflare en place).
- [x] DMARC `p=none` en place.
- [x] SPF / MX / autodiscover inchangés, Email Routing toujours désactivé.
- [ ] Compte configuré sur le téléphone + l'ordinateur.
- [ ] Signature et nom d'affichage réglés (Roundcube → Identités).
- [x] Adresse ajoutée au site (étape 8) + docs mises à jour.
