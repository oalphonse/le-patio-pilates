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
- **Le menu complet est sur toutes les pages** et reste collant en haut (burger sous 1180 px). Toute modification du menu doit être reportée sur les 6 pages.
- **Slugs et noms de fichiers en français, mots séparés par des tirets** (SEO), ex. `photos-le-patio/pilates-reformer-senlis-le-patio.jpg`.
- On parle de **« première séance »**, jamais d'« essai ».

## Popup « Coming soon » (accueil)

Il s'ouvre 2 s après l'arrivée et affiche un compte à rebours jusqu'au 1er février à 9h00, un bouton « Découvrir » et un lien « Me prévenir à l'ouverture » qui déplie l'inscription e-mail (l'ancienne section newsletter).

⚠️ **À faire avant la mise en ligne** : dans `index.html`, passer `const MODE_DEV=true;` à `false`. En mode dev, le popup revient à chaque chargement. Sinon, il ne s'affiche qu'une fois par heure et par visiteur (localStorage).

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

## Demandes en cours (pas encore faites)

1. **Réordonner le menu** selon les menus des 10 studios, du thème le plus recherché au moins recherché. Relevé fait le 12/11 :
   - Club Pilates : Classes, Find a Studio, Memberships, Why Pilates, Teach
   - Speir : Classes, Studios, Pricing, On Demand, Teacher Training
   - Studio Pilates : Find a Studio, Intro Offer, Training, Own a Studio, Resources, Contact
   - KX : Classes, KX Life, Store, Institute, FAQs, Trainer, Own a Studio
   - Culte : Notre histoire, Nos cours, Plannings, Nos studios, Nos tarifs, Notre app, Compte, Book
   - Ten : Reformer Pilates, Physio, Services, Locations, About, Prices, Timetable, Login
   - LevelOut : Studios, Classes, Trainers, Book, Buy, Postnatal, Academy, Private Hire, FAQs
   - BODYBAR : Find Your Studio, First Time, Own a BODYBAR, The Workout, Login
   - Pilates Circuit : Studios, Timetables, Pricing, What to expect, Our team, Social, Contact
   - Maison Amat : Concept, Cours, Tarifs, Cartes cadeaux, Planning, Coachs, Privatisations, Contact

   Les onglets les plus fréquents sont : cours (8/10), studios/lieu (7), tarifs (6), planning (5), première fois (3), équipe (3), FAQ (2) et contact (3). Le menu actuel est : Première séance, Le studio, Les cours, Planning, Infos pratiques, FAQ, Tarifs, Contact.
2. **Photos interactives** : clic pour voir en grand (lightbox) et léger mouvement au survol, sur toutes les cartes photo.
3. **Carte « Planning »** (accueil, section Planning et tarifs) : grande icône de calendrier à droite.

## À faire le 13/11

- **Remplacer le logo du popup « Coming soon »** (accueil, `<dialog id="popup-ouverture">`) par un nouveau logo, que le studio fournira. Le popup utilise aujourd'hui `logo/logo-le-patio-pilates-club.png` (balise `<img class="popup-logo">`, taille réglée par `.popup-logo` : 180 × 180 px), qui sert aussi dans le pied de page : ne remplacer que celui du popup, sauf avis contraire. Nommer le nouveau fichier en français avec des tirets (ex. `logo/logo-le-patio-popup.png`).

## Autres points ouverts

- Dossier `versions/` (anciennes copies v1/v2) : redondant avec git, peut être supprimé.
- Choix de l'hébergeur (doit pouvoir exécuter `serveur.py` ou un équivalent).
- Intégration bsport en direct sur la page planning, à étudier une fois les accès reçus.

## Versionnement

Dépôt git, branche `main`. Avant chaque grosse modification, on fait un commit de sauvegarde. Pas de copies de fichiers.
