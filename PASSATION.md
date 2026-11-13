# Passation — site Le Patio Pilates Club

Studio de Pilates Reformer à Senlis (43 avenue Félix Louat, 60300). Ouverture le **1er février**, 6 Reformers, réservations sur **bsport**.

Site statique (HTML/CSS/JS, sans framework ni build). Chaque sous-page est un dossier avec un `index.html` pour avoir des URL propres.

## Lancer le site en local

```bash
python3 serveur.py
```

Puis ouvrir http://localhost:8765. Le serveur (Python standard, sans dépendance) sert les pages et l'API du compteur « samedi » (voir plus bas).

Ne pas ouvrir les fichiers en double-cliquant (`file://`) : les liens de dossiers et l'API ne fonctionnent pas.

## Architecture et hébergement (décidé le 13/11)

**Principe : tout ce qui a un module bsport passe par bsport. Seuls les petits boutons compteurs et assimilés vont sur notre serveur OVH. Le reste du site est statique.**

```
Visiteur ─► site statique (GitHub Pages)
   ├─ réserver, acheter, compte client, inscription newsletter ─► widgets / liens bsport
   └─ petits compteurs (« Ça m'intéresse » samedi…) ─► https://api.<domaine> (VPS OVH)
```

| Fonction | Où | Comment |
|---|---|---|
| Pages, photos, CSS, JS | **GitHub Pages** (gratuit) | Mise en ligne par `git push` |
| Planning et réservation | **bsport** | Widget « Calendrier » (Paramètres → Widgets) |
| Achat des packs, forfaits, abonnements, offre première séance | **bsport** | Widget « Pass » ou lien direct vers la page de paiement de chaque pack |
| Compte client (« Mon compte ») | **bsport** | Lien fourni par bsport |
| Inscription « Me prévenir à l'ouverture » / newsletter | **bsport** | Widget « acquisition de leads » (e-mail seul) ; les inscrits deviennent des contacts bsport avec le tag « Newsletter » |
| Envoi des newsletters | **bsport** | Marketing → smartlists. Uniquement vers les contacts présents dans bsport |
| Suivi des visites (GA4, pixel Meta) | **bsport** + Google Tag Manager | Événements bsport récupérés dans GTM |
| Compteur « Ça m'intéresse » du samedi (et futurs petits boutons du même type) | **VPS OVH** | `serveur.py` en mode API |
| Contact | **Aucun serveur** | Liens directs (e-mail, téléphone, éventuellement WhatsApp/Instagram) à la place du formulaire : bsport n'a pas de module pour les messages libres |

Modèle de référence : **Gaia Club** (gaia-studio.fr, Paris 12e). Site statique (Next.js), réservation et achats entièrement en widgets bsport qui s'ouvrent en fenêtre par-dessus la page (`cdn.bsport.io/scripts/widget.js`, `dialogMode`), contact par simple lien e-mail, aucun serveur à eux. À reproduire pour nos boutons « Réserver ».

### GitHub Pages
- En gratuit, le dépôt doit être **public** : avant d'activer Pages, retirer du dépôt publié ce qui est interne (`PASSATION.md`, `outils/`, détourage) et vérifier qu'aucune clé ou mot de passe n'y figure.
- Conditions GitHub : Pages n'est pas prévu pour une activité commerciale ; site vitrine avec paiements chez bsport = zone grise, risque faible. Plan B sans ambiguïté, gratuit, dépôt privé possible : **Cloudflare Pages** (même dépôt, bascule en quelques minutes).
- L'adresse de l'API OVH peut être injectée au déploiement depuis un **secret GitHub** (via GitHub Actions) pour ne pas figurer dans le code. Elle reste visible dans le navigateur des visiteurs : la sécurité est assurée côté serveur, pas par ce secret.

### VPS OVH (état relevé le 13/11 par la session Ferdi, en lecture seule)
- Ubuntu 24.04.5 LTS, Python 3.12.3, 8 CPU, 22 Go RAM, ~70 Go libres. Compte `cliford` (sudo avec mot de passe).
- Ports 80/443 **libres**, aucun serveur web ni certificat. Seul SSH (22) est exposé.
- **Le VPS sert au développement Cliford** : ne pas utiliser les ports 3002, 3004, 8056, 8057, 5433, 3101, 1025, 8025, 9341, 9343, 40603 ; ne toucher ni aux conteneurs Docker, ni aux sessions tmux (`rc`, `site3002`, `site3004`), ni au service `claude-rc`.
- Installation prévue :
  - **Caddy** sur 80/443 (HTTPS automatique) → `127.0.0.1:8790` ;
  - `serveur.py` en mode API seule, lancé par **systemd** sous un utilisateur dédié (ex. `lepatio`), données dans `/srv/lepatio/donnees` ;
  - pare-feu `ufw` : vérifier que **22 reste autorisé** avant d'ouvrir 80/443 ; vérifier aussi le pare-feu réseau OVH ;
  - DNS : `api.<domaine>` → IP du VPS.
- Sécurité de l'API : n'accepter que l'origine du site (CORS), limiter le nombre de requêtes par visiteur, valider les entrées. Aucune clé bsport nécessaire tant que le serveur ne fait que compter.

### Reste à décider / obtenir
- Le nom de domaine du site et du sous-domaine API.
- Les accès bsport du studio (widgets, liens de paiement, lien « Mon compte »).
- **Inscriptions avant l'ouverture** : le widget leads n'est disponible qu'une fois bsport ouvert. Soit on attend les accès bsport pour activer « Me prévenir », soit on collecte temporairement sur le VPS puis on importe la liste dans bsport (import à confirmer auprès de bsport).
- Questions pour bsport : personnalisation des couleurs et de la police des widgets ; possibilité de ne pas forcer le tag « Newsletter » sur le widget leads ; import de contacts ; accès API si besoin un jour.

## Pages

| URL | Rôle |
|---|---|
| `/` | Accueil : hero, offre première séance, studio, attentions, cours, étapes première séance, professeure, raccourcis planning/tarifs, infos pratiques, avis, application, galerie, bandeau CTA, FAQ, pied de page |
| `/premiere-seance/` | Déroulé d'une première séance en 3 étapes |
| `/planning/` | Semaine type (lun–ven, 7 créneaux de 8h30 à 20h) + colonne samedi « Bientôt » avec bouton « Ça m'intéresse » |
| `/tarifs/` | Offre première séance, séances à l'unité et forfaits, abonnements, conditions |
| `/contact/` | Téléphone + formulaire de contact (retiré de l'accueil) |
| `/reserver-premiere-seance/` | Page d'attente (`noindex`) en attendant le lien bsport |

Règles du projet :
- **En-tête identique sur les 6 pages**, collant en haut : bouton « Menu » (burger) à gauche, logo au centre, « Réserver » à droite. Tarifs, Planning et Première séance restent visibles hors du menu (à côté du burger sur ordinateur, sur une 2e ligne sur mobile) ; Les cours, Le studio, Infos pratiques, FAQ et Contact sont dans le menu. Sur ordinateur le menu s'ouvre au survol, sur mobile au toucher. Style et comportement sont dans `commun/entete.css` et `commun/entete.js` (communs aux 6 pages) ; seul le HTML de l'en-tête est recopié dans chaque page, à garder identique.
- **Slugs et noms de fichiers en français, mots séparés par des tirets** (SEO), ex. `photos-le-patio/pilates-reformer-senlis-le-patio.jpg`.
- On parle de **« première séance »**, jamais d'« essai ».

## Popup « Coming soon » (accueil)

Il s'ouvre 2 s après l'arrivée et affiche un compte à rebours jusqu'au 1er février à 9h00, un bouton « Découvrir » et un lien « Me prévenir à l'ouverture » qui déplie l'inscription e-mail (l'ancienne section newsletter).

Le mode dev est désactivé (`const MODE_DEV=false;` dans `index.html`) : le popup ne s'affiche qu'une fois par heure et par visiteur (localStorage). Le repasser à `true` pour le revoir à chaque chargement pendant les tests.

## Compteur « samedi » (`serveur.py`)

- `POST /api/interet-samedi` enregistre un vote (1 par adresse IP), `GET` renvoie le total.
- Les IP ne sont jamais stockées en clair : empreinte SHA-256 salée dans `donnees/` (ignoré par git, ne pas versionner).
- Le serveur bloque l'accès à `/donnees`, `/serveur.py`, `/.git`, `/.claude`.
- En ligne, ce script tournera sur le **VPS OVH** en mode API seule (voir Architecture et hébergement) ; le site statique l'appellera sur `https://api.<domaine>`. Rien n'est encore adapté : aujourd'hui il sert aussi les pages et n'a ni CORS ni limite de requêtes.

## Ce qui est en démo (rien n'est envoyé)

- Inscription e-mail du popup : valide la saisie puis affiche un message, sans envoi. À remplacer par le **widget leads bsport**.
- Formulaire de contact (`/contact/`) : idem, sans envoi. À remplacer par des **liens directs** (e-mail, téléphone), comme Gaia Club.
- Tous les boutons « Réserver » mènent au **planning** et les créneaux à l'offre première séance, en attendant les **widgets / liens bsport** (calendrier, packs, « Mon compte »), que le studio n'a pas encore.
- Numéro de téléphone et e-mail : « à venir ».

## Détourage (outil interne)

Le bouton « Afficher le détourage » en bas de l'accueil encadre chaque élément et indique combien des 10 studios de référence l'utilisent (attributs `data-tag`, `data-st`, `data-pos`). Il sert à justifier les choix de la maquette, et il faudra le retirer ou le masquer à la mise en ligne.

Les 10 studios de référence (approche « offre de découverte ») sont : Club Pilates, Speir, Studio Pilates, KX Pilates, Culte, Ten Health & Fitness, LevelOut, BODYBAR, Pilates Circuit et Maison Amat.

## Charte

- Couleurs : `--olive #5E530E`, `--olive-d #453D0A`, `--olive-l #7A6B2A`, `--sand #EBE6DC`, `--cream #F9F7F1`, `--paper #FDFCF9`, `--tan #C2B88F`, `--tan-2 #DBD1A8`, `--brown #574325`, `--muted #8B7B60`, `--ink #222222`.
- Police : Inter (Google Fonts).
- Logos dans `logo/` : `logo-le-patio-menu.png` (en-tête), `logo-le-patio-pilates-club.png` (pied de page, popup), `icone-le-patio.png` (favicon).

## Numéros des éléments (outil interne)

Chaque élément visible porte un attribut `data-num` (S section, C carte, T texte, P photo, I icône/logo, B bouton, L lien, F formulaire), numéroté par page et par lettre. `outils/numeros.js` les affiche en petits badges ; le bouton « Numéros » en bas de l'écran les montre ou les cache. On s'en sert pour désigner une modification (« T14 sur Tarifs »). L'en-tête a les mêmes numéros sur toutes les pages (I01 logo, L01–L08 liens, B01 Réserver, B02 Menu). **À retirer à la mise en ligne** : supprimer `outils/` et la balise `<script src="…outils/numeros.js">` de chaque page (les attributs `data-num` peuvent rester).

## Fait le 12/11

- Menu réordonné puis remplacé par le nouvel en-tête (voir Règles du projet).
- Photos interactives (zoom au survol, photo en grand au clic) sur l'accueil et Première séance.
- Accueil : icône calendrier sur la carte Planning, carte Tarifs en 3 colonnes.
- Page Tarifs : formules en 3 colonnes (À la séance, Forfaits avec validité sur chaque ligne, Abonnements), léger mouvement au survol ; bandeau Première séance (C01) refait, « Une séance achetée, une séance offerte » mis en avant.
- Compatibilité mobile vérifiée et corrigée sur les 6 pages (360 à 430 px, zones tactiles de 44 px, champs en 16 px).
- `serveur.py` envoie `Cache-Control: no-cache` pour qu'un rechargement montre toujours la dernière version.

## À faire le 13/11

- **Remplacer le logo du popup « Coming soon »** (accueil, `<dialog id="popup-ouverture">`) par un nouveau logo, que le studio fournira. Le popup utilise aujourd'hui `logo/logo-le-patio-pilates-club.png` (balise `<img class="popup-logo">`, taille réglée par `.popup-logo` : 180 × 180 px), qui sert aussi dans le pied de page : ne remplacer que celui du popup, sauf avis contraire. Nommer le nouveau fichier en français avec des tirets (ex. `logo/logo-le-patio-popup.png`).

## Demandes notées (pas encore faites)

- **Page Tarifs : photo de fond dès l'arrivée.** Remplacer le gros bloc de couleur unie du haut de page (`<section class="intro">`, fond `var(--sand)`, titre « Séance, forfait ou abonnement : à vous de choisir. ») par une photo de fond, comme le hero de l'accueil. Prévoir un voile sombre pour que le texte reste lisible, et passer le texte en clair. Photo à choisir dans `photos-le-patio/` ou à fournir par le studio.

- **Propositions mobiles** (écartées pour l'instant le 12/11) :
  1. Barre fixe du bas de l'accueil (S17) : à 360–375 px, « Première séance / 2 séances pour 35 € » tient sur 4 lignes serrées ; raccourcir le bouton (« Réserver »).
  2. Photos de 2000 px (jusqu'à 1 Mo) : prévoir des versions mobiles d'environ 800 px avec `srcset`.
  3. Petits textes sur mobile (surtitres 12 px, pied de page 13,5 px, pastille T05 11 px) : passer à 14 px ou plus.
  4. Popup « Coming soon » : ajouter une croix de fermeture visible.

## Autres points ouverts

- Dossier `versions/` (anciennes copies v1/v2) : redondant avec git, peut être supprimé.
- Hébergement : décidé le 13/11 (voir Architecture et hébergement). Mise en place à faire.
- Intégration des widgets bsport (planning, packs, leads) une fois les accès reçus.

## Versionnement

Dépôt git, branche `main`, distant `git@github.com:oalphonse/le-patio-pilates.git` (passé en SSH le 13/11). Avant chaque grosse modification, on fait un commit de sauvegarde. Pas de copies de fichiers.

Le push en SSH depuis le poste fonctionne (vérifié le 13/11).
