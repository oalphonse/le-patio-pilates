# Passation — site Le Patio Pilates Club

Studio de Pilates Reformer à Senlis (43 avenue Félix Louat, 60300). Ouverture le **1er février**, 6 Reformers, réservations sur **bsport**.

Site statique (HTML/CSS/JS, sans framework ni build). Chaque sous-page est un dossier avec un `index.html` pour avoir des URL propres.

## Lancer le site en local

```bash
python3 serveur.py
```

Puis ouvrir http://localhost:8765. Le serveur (Python standard, sans dépendance) sert les pages et l'API du compteur « samedi » (voir plus bas).

Ne pas ouvrir les fichiers en double-cliquant (`file://`) : les liens de dossiers et l'API ne fonctionnent pas.

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
- **L'hébergement final doit faire tourner ce script ou un équivalent** (PHP, fonction serverless…). Un hébergement 100 % statique ne suffit pas pour ce bouton.

## Ce qui est en démo (rien n'est envoyé)

- Formulaire de contact (`/contact/`) et inscription e-mail du popup : ils valident la saisie puis affichent un message, sans envoi. À brancher sur un outil d'e-mailing / formulaire à la mise en ligne.
- Tous les boutons « Réserver » mènent au **planning** et les créneaux à l'offre première séance, en attendant les **liens bsport** (créneaux, page de réservation, « Mon compte »), que le studio n'a pas encore.
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
- Choix de l'hébergeur (doit pouvoir exécuter `serveur.py` ou un équivalent).
- Intégration bsport en direct sur la page planning, à étudier une fois les accès reçus.

## Versionnement

Dépôt git, branche `main`. Avant chaque grosse modification, on fait un commit de sauvegarde. Pas de copies de fichiers.
