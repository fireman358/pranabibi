# Demande de rendez-vous : options et recommandation

## Contexte

- Site statique sur Cloudflare Worker (assets), pas de base de données, pas de réservation en ligne.
- Pas encore d'e-mail PranaBibi dédié.
- La cliente veut, à terme, un **modèle à choisir** (prestation, créneau) qui envoie un **e-mail prédéfini**.
- Contrainte : ne pas mélanger avec Lovely Secret (branche VDI).

## Les quatre options

| Option | Fonctionnement | Avantages | Inconvénients |
|---|---|---|---|
| **1. `mailto:` avec sélecteur** | Le navigateur compose un e-mail (`mailto:...?subject=...&body=...`) selon la prestation choisie | Zéro backend, zéro coût, 10 min à coder | Ouvre le client mail (pas toujours configuré sur mobile), adresse visible dans la page (spam), aucun suivi, pas de pièce jointe |
| **2. Service de formulaire** (Formspree, Netlify Forms…) | Le formulaire poste vers un service tiers qui envoie un e-mail | Rapide, pas de serveur | Abonnement, données chez un tiers, dépendance, moins « propre » qu'un Worker |
| **3. Worker + API e-mail** (Resend, Postmark…) | `POST /api/rendez-vous` → validation → Turnstile → e-mail prédéfini à la cliente | Adresse jamais exposée, e-mail structuré, anti-spam, RGPD maîtrisé, cohérent avec le Worker | Nécessite une clé API, un domaine expéditeur vérifié (SPF/DKIM), ~0,5–1 j de dev |
| **4. Outil de réservation** (Planity, Fresha, Calendly) | Lien vers un agenda tiers | Vraies disponibilités, rappels, paiement | Compte et abonnement, charte imposée, dépendance |

## Recommandation

**Pour la maquette : ne pas ajouter de formulaire.** Le site renvoie vers le téléphone, ce qui est
cohérent avec « uniquement sur rendez-vous » et évite une promesse non tenue (un formulaire qui n'envoie
rien est pire qu'une absence de formulaire).

**Quand elle accepte / quand elle a un e-mail :** partir sur l'option **3**, le Worker + Resend
(ou Postmark) + Cloudflare Turnstile.

### Pourquoi l'option 3

- On est déjà sur un Worker : ajouter une route `POST /api/rendez-vous` est naturel.
- Le **modèle à choisir** est justement ce que le serveur sait faire : le navigateur envoie un
  `serviceId`, le Worker associe le libellé et compose l'e-mail (objet + corps prédéfinis).
- L'adresse e-mail de la cliente n'apparaît jamais dans le HTML : pas de scraping.
- Turnstile + honeypot + rate limiting = pas de spam.
- Resend : 3 000 e-mails/mois gratuits (100/jour) ; Turnstile gratuit ; Worker gratuit à ce volume.
- Le consentement RGPD et la durée de conservation se maîtrisent côté Worker.

### Flux proposé

```text
[Formulaire] prestation → créneau souhaité → nom + téléphone (+ consentement)
      ↓ POST /api/rendez-vous  (JSON)
[Worker] valide, vérifie Turnstile, associe le libellé de la prestation
      ↓ API Resend
[E-mail] objet : « Demande de rendez-vous — Massage ayurvédique »
         corps : prestation, créneau souhaité, nom, téléphone, date de demande
      ↓
[Cliente] répond ou appelle pour confirmer
```

### Ce qu'il faudra fournir

- L'adresse e-mail PranaBibi de destination (pas `@lovelysecret.be`).
- Le domaine expéditeur vérifié (pranabibi.com une fois en production, ou ton domaine pour la démo).
- Les champs souhaités (prestation, date/heure préférée, nom, téléphone, message ?).
- La politique : délai de réponse, annulation, acompte éventuel.

### Variante « démo sans backend »

Si tu veux montrer le parcours **avant** d'avoir l'e-mail, on peut faire un sélecteur de prestation
qui **compose un message pré-rempli** et propose « Envoyer par e-mail » / « Appeler ». Mais :
- l'adresse doit exister (sinon le bouton ne fait rien) ;
- `mailto:` ne marche pas toujours sur mobile ;
- ne pas laisser ce mode en production.

**Mon avis** : garde le téléphone pour la maquette, et construis le formulaire Worker + Resend
quand elle aura donné son e-mail et validé le principe. C'est 0,5 à 1 jour de travail, et ça évite
de présenter un formulaire qui ne délivre pas.
