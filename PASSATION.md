# Passation — site Le Patio Pilates Club

Studio de Pilates Reformer à Senlis (43 avenue Félix Louat, 60300). Ouverture le **1er février**, 6 Reformers, réservations sur **bsport**.

Site statique (HTML/CSS/JS, sans framework ni build). Chaque sous-page est un dossier avec un `index.html` pour avoir des URL propres.

## Où on en est (14/11 au soir) — à reprendre ici

**Tous les commits du 14/11 sont poussés sur GitHub** (le VPS pousse désormais lui-même, voir Versionnement).

**⚠️ Référencement coupé (`noindex`) sur tout le site pendant la relecture : à retirer au lancement, voir « Référencement ».**

Fait les 13 et 14/11 (détails dans « Widgets bsport sur le site ») :
- **Planning** : calendrier bsport à la place de notre grille, couleur olive foncé, séances en colonnes Matin | Midi | Soir, bloc samedi / dimanche « Ça m'intéresse ».
- **Tarifs** : offre première séance (Bandeau), Formules (Carte des prix), Conditions (Cartes) choisies ; achat en ligne par les widgets bsport.
- **En-tête** : bouton espace client bsport (bonhomme) à côté de « Réserver », menu Réservations / Panier / Profil… (clics du menu réparés le 14/11 au soir : problème de `z-index`) ; plus de chevauchement du logo sur mobile.
- **Langue de bsport = langue de la page**, même avec un navigateur en anglais.
- **Marges haut / bas des sections à fond uni divisées par 2** sur toutes les pages, FR et EN (le bandeau photo de l'accueil et le pied de page n'ont pas bougé).
- Accueil : la carte de l'offre mène à l'offre de Tarifs, centrée à l'écran.
- 14/11 en soirée :
  - **squelettes de chargement** (`commun/bsport-squelette.css/.js`) sur les 4 widgets bsport de contenu (calendrier du Planning, coupon de l'offre, forfaits, abonnements de Tarifs). Le widget se charge en coulisse (attribut `data-squelette-attente`, hauteur 0) pendant qu'un squelette gris animé de la même forme tient sa place ; dès que bsport a ses données, le squelette disparaît. Si bsport ne répond pas au bout de 15 s, un lien direct vers bsport s'affiche. Le bouton espace client de l'en-tête a déjà son bonhomme de secours ; la page de test `/espace-client/` n'en a pas.
  - **Planning** : le widget est posé sur un panneau sable (`#EBE6DC`, couleur de l'intro S01) dans la section olive foncé ; cartes « Bon à savoir » (S03) intégrées sous le calendrier, même fond que les cartes de séances ; bouton « Prochaine séance » visible et au-dessus du bloc samedi / dimanche ; sur mobile, le nom de la professeure passe à la ligne.
  - **Page « L'histoire du Patio »** (`/histoire/`, page 10 des numéros) : texte complet d'Olivia ; l'accueil n'en garde qu'un résumé avec le lien « L'histoire du Patio → ». Pas encore de version anglaise.
  - **Première séance** : la proposition A « Guide » est retenue (B, C, l'ancienne version et le sélecteur supprimés ; CSS dans `commun/premiere-seance.css`). Ses sections n'ont pas encore de numéros.
  - **Boutons « Ajouter au panier · 35 € »** (`commun/bsport-panier.js/.css`) : bsport n'a pas d'appel JavaScript « ajouter au panier » ; le module monte en coulisse un widget Cartes (catégorie 31419) et notre bouton actionne le vrai bouton bsport du pack (`data-bsport-pack="817521"`) : panier bsport créé, fenêtre de connexion / paiement bsport. Lien direct vers la page d'achat bsport en secours (bsport muet 8 s, ou sans JavaScript).
  - **Adresse du studio** : carte cliquable « Y aller → » vers l'itinéraire partout où l'adresse est citée (`commun/adresse.css`) ; dans le pied de page, texte simple + lien souligné. Pas sur Infos pratiques (lien déjà là) ni dans le texte des pages légales.
  - Pied de page : icônes Instagram / Facebook, signature du site ; bloc de fin du Planning en olive foncé.
  - **En-tête** : le bouton espace client est réhabillé chaque fois que bsport le recrée (ouverture / fermeture de sa fenêtre) ; l'en-tête reste collé après une fenêtre bsport (bsport laissait `overflow:auto` sur le body) ; plus de décalage du bonhomme en haut de l'accueil. Signalé mais non reproduit : le bonhomme qui n'apparaît pas parfois en revenant sur l'accueil.

À faire ensuite, par ordre :
1. **Bonhomme absent sur l'accueil** (signalé le 14/11, pas reproduit) : savoir comment on revient sur l'accueil et si on est connecté à bsport.
2. **Tester le bouton espace client connecté** avec un vrai compte client : menu qui se déplie, panier, réservations (vu seulement en aperçu forcé).
3. **Réserver ma première séance** : choisir entre A Étapes, B Côte à côte, C Créneau d'abord (sélecteur sur la page), puis finaliser comme Tarifs.
4. ~~**Reporter sur les pages anglaises**~~ (pages `en/` supprimées le 15/11, voir « Version anglaise ») — (les scripts gèrent déjà l'anglais).
5. **Formulaire « Me prévenir »** (samedi / dimanche, popup) : décider widget leads bsport ou collecte sur le VPS (question RGPD).
6. Nettoyage : supprimer l'ancienne grille masquée du Planning, décider du sort de la page de test `/espace-client/` (inconnue de `outils/numeros.js`, badges « ? »), retirer `commun/propositions.*` quand plus aucune page ne s'en sert.
7. **Back-office bsport** (studio) : renommer « Séance d'essai » en « Première séance », créer une catégorie avec seulement le pack 817521.

## Lancer le site en local

```bash
python3 serveur.py
```

Puis ouvrir http://localhost:8765. Le serveur (Python standard, sans dépendance) sert les pages et l'API des compteurs « samedi » et « dimanche » (voir plus bas).

Ne pas ouvrir les fichiers en double-cliquant (`file://`) : les liens de dossiers et l'API ne fonctionnent pas.

## Serveur de dev (VPS OVH)

Le site tourne sur le VPS dans le dossier `~/le-patio-pilates`, session tmux `lepatio`, port **8790** (réservé au Patio, hors des ports Cliford).
Il n'écoute qu'en local sur le VPS : on le consulte depuis le poste par un tunnel SSH, sans ouvrir de port sur internet.

- Mettre à jour et relancer (sur le VPS) :
  `cd ~/le-patio-pilates && git pull --ff-only && tmux kill-session -t lepatio 2>/dev/null; tmux new -d -s lepatio 'python3 serveur.py --port 8790'`
- Voir le site (sur le poste) : raccourci **`lepatio-test`** (dans `~/.local/bin`, sur le modèle de `cliford-test`, alias SSH `cliford`) : vérifie que le site tourne, ouvre le tunnel et le navigateur sur http://localhost:8790. Ctrl+C ferme le tunnel.
  `lepatio-test --maj` : récupère d'abord le dernier code GitHub sur le VPS et relance le site (à faire après chaque push). `--sans-navigateur` : tunnel seul.
- Sans le raccourci : `ssh -N -L 8790:127.0.0.1:8790 cliford` puis http://localhost:8790
- Options de `serveur.py` : `--port`, `--hote` (127.0.0.1 par défaut ; `0.0.0.0` l'ouvrirait à tous, à éviter sans pare-feu).
- **Après toute modification de `serveur.py`, relancer le serveur** (il ne recharge pas son code tout seul). Fait le 13/11 au soir après l'ajout du compteur dimanche : `/api/interet-samedi` et `/api/interet-dimanche` répondent sur le port 8790.

## Architecture et hébergement (décidé le 13/11)

**Principe : tout ce qui a un module bsport passe par bsport. Seuls les petits boutons compteurs et assimilés vont sur notre serveur OVH. Le reste du site est statique.**

```
Visiteur ─► site statique (GitHub Pages)
   ├─ réserver, acheter, compte client, inscription newsletter ─► widgets / liens bsport
   └─ petits compteurs (« Ça m'intéresse » samedi, dimanche…) ─► https://api.<domaine> (VPS OVH)
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
| Compteurs « Ça m'intéresse » du samedi et du dimanche (et futurs petits boutons du même type) | **VPS OVH** | `serveur.py` en mode API |
| Contact | **Aucun serveur** | Liens directs (e-mail, téléphone, éventuellement WhatsApp/Instagram) à la place du formulaire : bsport n'a pas de module pour les messages libres |

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

### bsport : ce qu'on sait (vérifié le 13/11 sur le compte du studio, n° 7023)

- **Widgets disponibles** (back-office → Mon widget) : Calendrier, Ateliers, VOD, Cartes, Sur rendez-vous, Playlist, Magasin, Abonnement, Bouton login ; le script contient aussi `newsletterV2` (inscription newsletter, piste pour la popup « Me prévenir »). Webhooks disponibles (booking-, member-, invoice-, offer-…), à recevoir sur le VPS si besoin un jour.
- Croisement avec le site : Calendrier → Planning (3-S07, en place, coach 155027, établissement 23608) et page « Réserver ma première séance » ; Cartes + Abonnement → Tarifs 4-S10 et offre première séance 4-S25 (fait) ; Magasin → cartes cadeaux (lien 1-L14, boutique bsport encore vide) ; Bouton login → icône « Mon compte » de l'en-tête (fait) ; Ateliers / Sur rendez-vous seulement si le studio propose événements ou cours particuliers ; VOD / Playlist inutiles.
- **Lien direct par produit** : on peut garder nos propres cartes de prix avec un bouton par produit.
  - Pack : `https://backoffice.bsport.io/customer/payment/pass/<id>` (passe par la connexion puis `/checkout/7023/pre-checkout/payment-pack/<id>`)
  - Abonnement : `https://backoffice.bsport.io/checkout/7023/subscription/<id>`
- Identifiants (prix identiques au site) : Séance à l'unité 817519 · Séance d'essai 817521 (nouveaux membres seulement, 2 crédits, 35 €) · 5 séances 817520 · 10 séances 817522 · 20 séances 817524 · 30 séances 817523 · Abonnement 5/mois 60489 · Abonnement 10/mois 60490.
- **Achat** : connexion ou création de compte bsport obligatoire avant le paiement ; en widget tout se passe dans une fenêtre par-dessus notre page (z-index 1300, au-dessus de l'en-tête).
- Liste publique des packs (sans clé) : `https://api.production.bsport.io/buyable/v1/payment-pack/payment-pack/?company=7023&as_consumer=true&page_size=300`
- **Catégories de packs** : Unitaire **31419** (séance à l'unité 817519 + séance d'essai 817521) · Forfaits **31417** · Abonnements **31418**.
- **Widget Cartes (`widgetType: "pass"`)** : clés de config trouvées le 13/11 : `hideFilters`, `hidePaymentPack`, `hidePrivatePass`, `hidePaymentCombo`, `paymentPackCategories`, `privatePassCategories`. **Aucun filtre par produit**, seulement par catégorie. Pour n'afficher qu'un pack, on masque les autres cartes en CSS par l'id fixe que bsport pose sur chacune : `#payment-pack-button-container-<id>` (abonnements : `contract-button-container-<id>`).
- Le prix s'affiche « 35.00 € » (point, deux décimales) : format bsport, on ne peut pas le changer en CSS.
- Le « Powered by bsport » n'a **pas de classe fixe** : on le vise par son lien (`a[href*="bsport"]`) ou par la structure (`.cleanslate > div > div`). Sur le calendrier olive foncé du Planning, il est **peu lisible** (rien n'est fait pour l'instant).
- Animation au changement de jour (demandée le 13/11, pour tous les widgets à jours) : dans `commun/bsport.css`, le jour choisi rebondit et les séances apparaissent en fondu décalé. bsport recrée les cartes à chaque jour, donc l'animation se rejoue seule. Désactivée si le visiteur a demandé de réduire les animations.
- Habillage : n'utiliser que les classes `bs-*` (fixes) dans `commun/bsport.css`. bsport a aussi un « CSS personnalisé » dans son back-office (`core-data/v1/company/custom_css`).
- **Langue de bsport = langue de la page** (13/11), donc synchronisée avec le bouton **FR / EN** (chaque page porte sa langue dans `<html lang>`). Sans réglage, bsport prend la langue du **navigateur du visiteur** (« Book », « 8:30 AM », « Log in » sur les pages FR). `commun/bsport-langue.js`, dans le `<head>` des **12 pages** (FR et EN), avant tout chargement de bsport :
  - widgets : cookie `i18next=fr|en-GB`, **mais il ne suffit pas** (14/11, vu sur le Chrome Mac de l'utilisateur : cookie `fr` posé, widget en anglais « MONDAY », « Book », « Most recent session »). Cause : `widget.js` et ses morceaux partagent **une seule instance i18next initialisée deux fois** ; la 1re (dans `widget.js`) ne regarde **que la langue du navigateur** (`order:["navigator"]`) ; si ses traductions ne sont pas arrivées quand le widget fait la 2e (cookie d'abord), i18next saute cette 2e détection et reste dans la langue du navigateur. Ça dépend du cache et du réseau, d'où « tout en français » dans les tests Playwright (prouvé en ralentissant `locales/*/translation.json` : anglais avant, français après).
  - Correctif dans `bsport-langue.js` : la page met sa langue en tête de `navigator.languages` et `navigator.language` (`fr-FR`, ou `en-GB` sur les pages EN), et ajoute `language` à chaque `BsportWidget.mount` (bsport appelle alors `changeLanguage`). Anglais = `en-GB` pour avoir les dates en jour/mois et les heures sur 24 h, comme en français (`bsport-semaine.js` lit maintenant jour/mois dans les deux langues).
  - `commun/bsport-textes.js` (Planning, Tarifs, Réserver ma première séance) : « La séance la plus récente est le 01/02/2027 : 08:30 » devient « Prochaine séance : lundi 01/02 à 08:30 » (« Next class: Monday 01/02 at 8:30 »), via `data-texte` + `::after` dans `commun/bsport.css`.
  - fenêtres bsport en cadre (connexion, réservation, achat, servies par backoffice.bsport.io) : elles ignorent le cookie mais acceptent `lng=fr|en` dans l'adresse ; le script l'ajoute à chaque cadre (sauf le cadre technique `widget-proxy-bridge`) et aux liens directs vers bsport. Vérifié avec un navigateur anglais : connexion et réservation en français.
  - Reste en anglais dans la fenêtre de connexion : « Email » et « Password » (traduction manquante chez bsport, inaccessible depuis notre site). Format des prix « 35.00 € » idem.
  - Les pages `en/` n'ont pas encore les widgets ni le bouton espace client : à ajouter (les scripts gèrent déjà l'anglais : périodes Morning/Midday/Evening, semaine « Monday 01/02 to Sunday 07/02 », bloc week-end).
  - Les requêtes 404 vers `…/undefined/locales/…` sont sans conséquence.

### Widgets bsport sur le site (état du 14/11 au soir)

**Fichiers communs**
- `commun/bsport.css` : habillage de base de tous les widgets (classes `bs-*`), animation au changement de jour, libellé de la semaine, et deux corrections du survol :
  - pas de « flash » au survol d'une séance : bsport met un filtre `brightness(.9)` immédiat, on le retire (`filter:none`) ;
  - le bouton « Réserver » reste une pilule : bsport passe son arrondi à 20px au survol, on force `border-radius:999px` dans tous les états.
- `commun/bsport-langue.js` : langue des widgets et des fenêtres bsport (voir plus haut). Dans le `<head>` des 12 pages.
- `commun/bsport-periodes.js` : pose `data-periode` (matin / midi / soir) sur chaque séance d'après son heure. Matin avant 11 h, Midi de 11 h à 15 h, Soir à partir de 15 h.
- `commun/bsport-semaine.js` : la semaine s'écrit « Du lundi 01/02 au dimanche 07/02 » (en anglais « Monday 01/02 to Sunday 07/02 »). En dessous, en petit, le mois en toutes lettres (« Février 2027 », « Janvier – Février 2027 » si la semaine est à cheval). Le script pose les textes dans `data-libelle` et `data-mois` ; `commun/bsport.css` masque le texte bsport et affiche les nôtres en `::after` (semaine) et `::before` (mois, bsport utilisait déjà ce `::before` : toutes ses propriétés sont reprises en `!important`). Le même script centre le mini calendrier (qui s'ouvre au clic sur la semaine) entre les deux flèches : décalage calculé dans `--bs-menu-dx`, appliqué par la propriété `translate` dans `commun/bsport.css` ; le mini calendrier a ses propres couleurs (carte claire), indépendantes du fond de la section. Sans le script, rien ne change.
- `commun/bsport-jour-ferme.js` : bloc samedi / dimanche sans cours (voir Planning).
- `commun/propositions.js` + `commun/propositions.css` : **sélecteur de propositions** (outil de travail, à retirer à la mise en ligne). Une zone `[data-prop]` contient une barre de boutons (A, B, C, « Site actuel ») ; les blocs `[data-prop-pour="a b c"]` ne s'affichent que pour leur choix ; `[data-habillage]` reçoit le choix pour le CSS. Choix mémorisé par zone dans le navigateur (`localStorage`, clé `prop:<nom>`). « Site actuel » = la version d'avant les widgets.

**Planning (page 3) : fait, couleur fixée**
- Le widget Calendrier (S07, `id="creneaux"`) **remplace notre grille**. Plus de sélecteur sur cette page (`propositions.css` / `.js` n'y sont plus chargés).
- Habillage dans `commun/bsport-calendrier.css` (ex-`bsport-calendrier-propositions.css`), palette **olive foncé** seule, en dur sur la section : `data-habillage="olive-fonce"`.
  - Les 4 autres palettes essayées le 13/11 (olive, brun, sable, crème) sont gardées **en commentaire** en tête de `commun/bsport-calendrier.css` (l'ancien fichier de propositions n'a jamais été commité).
- Mise en page « C » : chaque séance est une carte ; les cartes sont rangées en colonnes **Matin | Midi | Soir** (titre de colonne = `::before` de la 1re séance de la période). Sur mobile (≤ 640 px), les colonnes s'empilent, avec un petit titre au-dessus de chaque période.
- Les jours de la semaine ont le même fond que les cartes ; le jour choisi a un contour clair.
- Bouton « Réserver » (contour) : il grandit un peu quand la souris arrive sur la carte et reprend sa taille quand elle part (une fois, pas en boucle). Il ne se remplit que quand on survole le bouton lui-même.
- Recherche, filtres, lieu et points sous les jours sont masqués (une activité, une professeure, un studio).
- **Samedi et dimanche sans cours** : quand le jour choisi est un samedi ou un dimanche et qu'il n'y a aucune séance, `commun/bsport-jour-ferme.js` place dans le calendrier le bloc « Pas encore de cours le samedi / dimanche » (C55, écrit dans `planning/index.html`).
  - « Ça m'intéresse » (B15) compte le vote (`POST /api/interet-samedi` ou `/api/interet-dimanche`, voir « Compteurs »), puis déplie le formulaire « Me prévenir quand les cours du … ouvriront » (F01).
  - **Ce formulaire est une démo : il vérifie l'adresse et affiche « Merci », mais rien n'est envoyé ni enregistré.** À brancher (voir Reste à décider).
- L'ancienne grille (S02) est **encore dans le HTML mais masquée** (`hidden`) : à supprimer avec son CSS (`.week`, `.pgrid`…) et son JS (dont l'ancien bouton samedi) une fois le calendrier validé en ligne.

**Tarifs (page 4)**
- Carte « Une séance achetée, une séance offerte » de l'accueil (1-C01) → `tarifs/#offre-premiere-seance` (EN : `pricing/#first-class-offer`) ; à l'arrivée, `commun/ancre-centree.js` amène l'offre au **centre** de l'écran, en un seul mouvement instantané. La section porte `data-ancre-centree="offre-premiere-seance"` et **pas d'`id` égal au `#`** : sinon le navigateur saute déjà tout seul, en animé (`scroll-behavior:smooth`), puis le script recentre, ce qui faisait un double défilement. La hauteur du coupon bsport est réservée en CSS (`#bsport-widget-premiere-seance`, 253 px, 340 px sur mobile) pour que la page ne saute pas quand il se dessine. Correction seulement si l'offre a bougé de plus de 4 px, jamais après que le visiteur a fait défiler.
- Offre première séance (section S25) : **A « Bandeau » retenue le 13/11** (bandeau olive, le widget en coupon clair à droite). Barre de choix et ancien bandeau S02 supprimés (S02 reste dans l'historique git). CSS : `commun/bsport-premiere-seance.css` (ex-`…-propositions.css`) ; B « Ticket » et C « Affiche » y sont gardées en commentaire en tête du fichier. L'ancien CSS de S02 (`.offre-ps…`, `.offer-badge`) a été retiré du `<head>`.
  - Widget Cartes limité à la catégorie Unitaire (31419) ; on ne garde que la carte du pack 817521 (`#payment-pack-button-container-817521`), la séance à l'unité est masquée.
- Formules (section S20) : **A « Carte des prix » retenue le 14/11**. Carte claire à gauche : séance et forfaits en lignes (nom, validité, prix, bouton contour) sous les intertitres bsport « Unitaire » et « Forfaits » (agrandis, olive, filet dessous). Encadré olive à droite : les abonnements, chacun empilé (titre sur une ligne, prix, bouton « M'abonner »), le « Powered by » tout en bas à droite de l'encadré. Sur ordinateur, les deux cartes ont la même hauteur. Barre de choix, anciennes colonnes S10 (restent dans l'historique git) et blocs B, C, D supprimés ; l'ancien CSS de S10 (`.va…`) a été retiré du `<head>`. CSS : `commun/bsport-formules.css` (ex-`…-propositions.css`, `<link>` placé juste avant la section) ; B « Vitrine », C « Deux temps » et D « Fusion » (les 3 colonnes de S10 avec les tuiles de B) y sont gardées en commentaire compact en tête du fichier.
  - Widget Cartes (`pass`), catégories Unitaire (31419) et Forfaits (31417), séance d'essai masquée par son id (`#payment-pack-button-container-817521`) ; widget Abonnement (`subscription`). Un seul « Powered by » gardé (celui des abonnements).
  - Tarifs n'a plus de zone de propositions : `commun/propositions.css` / `.js` n'y sont plus chargés (les fichiers restent, pour Réserver ma première séance).
- Conditions (section S11 « Bon à savoir ») : **A « Cartes » retenue le 14/11** (4 cartes avec icône : Paiement, Parrainage, Gel de l'abonnement, Résiliation ; 4 colonnes, 2 sous 1000 px, 1 sur mobile avec l'icône à gauche). Sélecteur `cv-barre`, son script (clé `tarifs-conditions-proposition`) et son CSS retirés ; propositions B « Questions » (S12), C « Liste » (S13) et l'ancienne bande « Actuelle » (S06) supprimées avec leur CSS (`.cb…`, `.cc…`, `.cond…`) : elles restent dans l'historique git. CSS de S11 (`.ca…`) dans le `<head>` de la page.

**Réserver ma première séance (page 6) : propositions** (zone `reserver-premiere-seance`, défaut A)
- A Étapes, B Côte à côte, C Créneau d'abord (section S03) : offre première séance (widget Cartes, pack 817521 seul) + calendrier. « Site actuel » = la page d'attente S01. CSS : `commun/bsport-reserver-propositions.css`.

**À faire côté bsport (back-office du studio)**
- Renommer « Séance d'essai » en **« Première séance »** (titre et description) : on ne parle jamais d'« essai » sur le site.
- Créer une **catégorie qui ne contient que le pack 817521** : le widget pourrait alors l'afficher seul, sans masquage en CSS.
- Savoir que le prix s'affiche « 35.00 € » (format bsport, non modifiable en CSS).

### Reste à décider / obtenir
- Le nom de domaine du site et du sous-domaine API.
- Choisir les propositions (voir « Widgets bsport sur le site ») : Réserver ma première séance (A / B / C / Site actuel) ; Tarifs est fait (offre et formules retenues). Ensuite : garder le bloc retenu, supprimer l'autre et la barre, fusionner le CSS retenu, retirer `commun/propositions.*` quand plus aucune page ne s'en sert.
- Planning : supprimer l'ancienne grille masquée une fois le calendrier validé en ligne ; rendre le « Powered by bsport » lisible sur l'olive foncé si on le souhaite.
- **Formulaire « Me prévenir » des samedis / dimanches** (démo) : le brancher sur le widget leads bsport, ou collecter les e-mails sur le VPS. À décider, avec la question **RGPD** (consentement, durée de conservation, mention d'information) si on collecte nous-mêmes.
- **Inscriptions avant l'ouverture** : le widget leads n'est disponible qu'une fois bsport ouvert. Soit on attend les accès bsport pour activer « Me prévenir », soit on collecte temporairement sur le VPS puis on importe la liste dans bsport (import à confirmer auprès de bsport).
- Questions pour bsport : personnalisation des couleurs et de la police des widgets ; possibilité de ne pas forcer le tag « Newsletter » sur le widget leads ; import de contacts ; accès API si besoin un jour.

## Autorisation parentale (PDF, 15/11)

- Âge minimum 16 ans ; pour les 16-17 ans, autorisation du représentant légal à remettre à la première séance (FAQ, question 29, bouton « Télécharger l'autorisation parentale (PDF) »).
- Fichier téléchargé : `documents/autorisation-parentale-le-patio.pdf` (une page A4). Source : `outils/autorisation-parentale.html` (logo, adresse, champs à remplir, signatures).
- Pour le modifier : éditer la source, puis la régénérer en PDF A4 avec Chromium (Playwright : `page.pdf({format:'A4', printBackground:true, preferCSSPageSize:true})` sur `http://localhost:8790/outils/autorisation-parentale.html`), en vérifiant qu'il tient sur une page.
- Pas d'e-mail ni de téléphone du studio dans le document (pas encore connus) : à ajouter dans l'en-tête quand on les aura.

## Pages

| URL | Rôle |
|---|---|
| `/` | Accueil : hero, offre première séance, studio, attentions, cours, étapes première séance, professeure, raccourcis planning/tarifs, infos pratiques, avis, application, galerie, bandeau CTA, FAQ, pied de page |
| `/premiere-seance/` | Déroulé d'une première séance en 3 étapes |
| `/planning/` | Widget Calendrier bsport (réservation en direct), habillé olive foncé, séances en colonnes Matin / Midi / Soir ; bloc « Pas encore de cours le samedi / dimanche » avec « Ça m'intéresse ». L'ancienne grille est masquée |
| `/tarifs/` | Offre première séance, séances à l'unité et forfaits, abonnements, conditions ; offre première séance et formules achetables en direct (widgets bsport Cartes et Abonnement) |
| `/contact/` | Téléphone + formulaire de contact (retiré de l'accueil) |
| `/mentions-legales/`, `/conditions-generales-de-vente/`, `/politique-de-confidentialite/` | Pages légales (créées le 14/11, liens L16-L18 du pied de page, FR et EN). Modèles rédigés à partir des infos du site : les passages surlignés `[à compléter]` (SIRET, forme juridique, médiateur, assureur, e-mail…) sont à remplir, et la CGV (droit de rétractation) est à faire valider. Pas de version anglaise : le pied anglais pointe vers les pages françaises |
| ~~`/reserver-premiere-seance/`~~ | **Supprimée le 14/11** à la demande d'Olivia (le bouton de l'offre mène à Tarifs, `tarifs/#offre-premiere-seance`). `commun/bsport-reserver-propositions.css` supprimé aussi. La page anglaise `en/book-first-class/` existe encore (son lien FR mène à Première séance) |
| `/espace-client/` | **Page de test** `noindex`, reliée à aucune autre : widget espace client bsport (`consumerSpace`, carte « M'inscrire / Me connecter », habillée par `commun/bsport-espace-client.css`). À garder ou supprimer |

Règles du projet :
- **En-tête identique sur les 6 pages**, collant en haut : bouton « Menu » (burger) à gauche, logo au centre, « Réserver » à droite. Tarifs, Planning et Première séance restent visibles hors du menu (à côté du burger sur ordinateur, sur une 2e ligne sur mobile) ; Les cours, Le studio, Infos pratiques, FAQ et Contact sont dans le menu. Sur ordinateur le menu s'ouvre au survol, sur mobile au toucher. Sous 540 px, le logo n'est plus centré sur l'écran mais dans l'espace entre le menu et le bloc de droite (EN, bouton espace client, Réserver ; serrés sans espace sous 420 px), sinon ce bloc passait sur le logo ; sous 360 px, logo réduit (transform). Style et comportement sont dans `commun/entete.css` et `commun/entete.js` (communs aux 6 pages) ; seul le HTML de l'en-tête est recopié dans chaque page, à garder identique.
- **Slugs et noms de fichiers en français, mots séparés par des tirets** (SEO), ex. `photos-le-patio/pilates-reformer-senlis-le-patio.jpg`.
- On parle de **« première séance »**, jamais d'« essai ».
- **Ne pas citer bsport dans les textes du site** (ni en français ni en anglais, ni dans les titres et descriptions pour Google) : on pousse les visiteurs vers **notre site et l'application Le Patio**. Formulations utilisées : « en ligne, sur notre site ou l'application Le Patio » / « on our website or the Le Patio app ». La seule mention de bsport acceptée est le « Powered by bsport » affiché par leurs propres modules (widgets). Décidé le 13/11.

## Popup « Coming soon » (accueil)

Il s'ouvre 2 s après l'arrivée et affiche un compte à rebours jusqu'au 1er février à 9h00, un bouton « Découvrir » et un lien « Me prévenir à l'ouverture » qui déplie l'inscription e-mail (l'ancienne section newsletter).

Le mode dev est désactivé (`const MODE_DEV=false;` dans `index.html`) : le popup ne s'affiche qu'une fois par heure et par visiteur (localStorage). Le repasser à `true` pour le revoir à chaque chargement pendant les tests.

## Compteurs « samedi » et « dimanche » (`serveur.py`)

- `POST /api/interet-samedi` et `POST /api/interet-dimanche` enregistrent un vote, `GET` renvoie le total. Un vote par adresse IP **et par jour de la semaine** : une même personne peut voter une fois pour le samedi et une fois pour le dimanche (pas une fois par date).
- Un fichier par jour : `donnees/interet-samedi.json`, `donnees/interet-dimanche.json` (créé au premier vote).
- Le bouton est propre à chaque jour : « Ça m'intéresse le samedi » / « … le dimanche », puis « C'est noté pour le samedi ✓ » (mémo par jour dans le navigateur, `localStorage` `interet-samedi` / `interet-dimanche`).
- **Serveur de dev par le tunnel SSH : tout le monde arrive avec l'adresse 127.0.0.1**, donc un seul vote par jour pour tous les testeurs, tests automatiques compris. Les votes du 13/11 à 22:22 UTC (samedi et dimanche) sont de vrais clics de test du propriétaire : ne pas les effacer en croyant nettoyer un test.
- Appelés par le bloc « Pas encore de cours le … » du Planning (`commun/bsport-jour-ferme.js`, adresse `../api/interet-<jour>`, à remplacer par `https://api.<domaine>/api/interet-` en ligne). Le navigateur retient aussi le vote (`localStorage`, clé `interet-<jour>`) pour afficher « C'est noté ✓ ».
- Les IP ne sont jamais stockées en clair : empreinte SHA-256 salée dans `donnees/` (ignoré par git, ne pas versionner).
- Le serveur bloque l'accès à `/donnees`, `/serveur.py`, `/.git`, `/.claude`.
- En ligne, ce script tournera sur le **VPS OVH** en mode API seule (voir Architecture et hébergement) ; le site statique l'appellera sur `https://api.<domaine>`. Rien n'est encore adapté : aujourd'hui il sert aussi les pages et n'a ni CORS ni limite de requêtes.

## Ce qui est en démo (rien n'est envoyé)

- Inscription e-mail du popup : valide la saisie puis affiche un message, sans envoi. À remplacer par le **widget leads bsport**.
- Formulaire de contact (`/contact/`) : idem, sans envoi. À remplacer par des **liens directs** (e-mail, téléphone).
- Formulaire « Me prévenir quand les cours du samedi / dimanche ouvriront » (Planning, F01, `commun/bsport-jour-ferme.js`) : vérifie l'adresse et affiche « Merci », **rien n'est envoyé ni enregistré**. À brancher : widget leads bsport ou collecte sur le VPS (voir Reste à décider). Le vote « Ça m'intéresse » juste avant, lui, est bien compté.
- Achat en ligne : **branché** sur Tarifs (offre première séance et formules, widgets bsport) ; sur Réserver ma première séance, dans les propositions A / B / C, pas dans « Site actuel ».
- Tous les boutons « Réserver » mènent au **planning** et les créneaux à l'offre première séance, en attendant de brancher les **liens bsport** par produit (voir « bsport : ce qu'on sait »).
- **Espace client bsport** (B00, à côté de Réserver, 6 pages FR + page test ; remplace le 14/11 les icônes « Se connecter » et « Panier ») : c'est le **bouton flottant de bsport** (widget `consumerSpace`, `showFab:true`), monté sur chaque page par `commun/entete.js`. Bonhomme à la place de l'icône bsport. Déconnecté : un clic ouvre la connexion bsport. Connecté : un clic déplie son menu vers le bas (Mes réservations, Mon panier — avec compteurs olive —, Mon profil, Mes souscriptions, Déconnexion ; vu seulement en aperçu forcé, pas avec un vrai compte). **Le bloc reste dans `<body>`** et est superposé à `.fab-place` (position suivie au défilement, `--fab-x/--fab-y`) : le déplacer dans l'en-tête fait planter bsport (`removeChild`). Ciblage par la structure (`.fab-bsport > button[title]`…), bsport n'ayant pas de classes fixes ici. Le bloc est repéré par un `MutationObserver` dès son insertion par bsport, avant le premier affichage : il n'apparaît jamais en bas à gauche avec l'icône bsport. bsport dessine un rond blanc à ombre dans chaque entrée du menu : effacé (sinon deux ronds superposés). **Garder le `z-index` de bsport (9999)** sur le bloc : quand le menu est ouvert, bsport pose dessous un fond sombre plein écran (`z-index` 999) qui referme le menu au clic ; avec un `z-index` plus bas (c'était 60 jusqu'au 14/11 au soir), ce fond passait par-dessus les entrées et le menu semblait cassé. Sans JavaScript : lien bonhomme vers la connexion.
- Numéro de téléphone et e-mail : « à venir ».

## Détourage (outil interne)

Le bouton « Afficher le détourage » en bas de l'accueil encadre chaque élément et indique combien des 10 studios de référence l'utilisent (attributs `data-tag`, `data-st`, `data-pos`). Il servait à justifier les choix de la maquette. **Retiré de toutes les pages le 14/11** (bouton, panneau, CSS et script) avant la mise en ligne ; les attributs `data-tag` restent, sans effet. Pour le retrouver : historique git, commit précédant « Outils internes retirés ».

Les 10 studios de référence (approche « offre de découverte ») sont : Club Pilates, Speir, Studio Pilates, KX Pilates, Culte, Ten Health & Fitness, LevelOut, BODYBAR, Pilates Circuit et Maison Amat.

## Version anglaise (pages /en/ supprimées le 15/11)

**Les pages anglaises `en/` ont été supprimées le 15/11** (elles n'étaient plus à jour). Elles restent dans l'historique git (dernier commit qui les contient : « Les cours : Reformer animé… », 3301b45) : on peut y reprendre les traductions et le vocabulaire.

**Décidé le 15/11 :** la future version anglaise sera une **traduction sur place** (une seule série de pages ; le bouton EN remplace les textes par leur traduction, choix mémorisé), **faite une fois les textes français définitifs**. Ne pas écrire les traductions avant.

En attendant :
- le bouton **EN** reste dans l'en-tête de toutes les pages (`<button class="langue" data-num="L00">`) ; un clic affiche « English version coming soon. » quelques secondes (`commun/entete.js`, style `.langue-bientot` dans `commun/entete.css`) ;
- plus de balises `hreflang` ni d'URL anglaises dans `sitemap.xml` ;
- les scripts bsport savent déjà afficher l'anglais (`commun/bsport-langue.js`, `-periodes`, `-semaine`, `-textes`, `-jour-ferme` lisent `<html lang>`) : ils serviront tels quels ;
- vocabulaire retenu pour l'anglais britannique (à reprendre) : première séance → first class ; forfait → class pack ; abonnement → membership ; à la séance → drop-in ; sans engagement → no commitment ; gel → membership freeze ; parrainage → referrals ; Réserver → Book ; Infos pratiques → Getting here ; prix « €35 », heures « 8:30am ».

## Référencement (préparé le 13/11)

> ⚠️ **RÉFÉRENCEMENT COUPÉ PENDANT LA RELECTURE (depuis le 14/11)** : chaque page porte
> `<meta name="robots" content="noindex, nofollow"><!-- RELECTURE : à retirer au lancement … -->`
> pour que Google ne l'affiche pas pendant que des proches relisent le site. **À retirer au lancement**, sinon
> le site reste invisible sur Google :
> `grep -rl 'RELECTURE : à retirer' --include=*.html . | xargs sed -i '/RELECTURE : à retirer/d'`
> (le `noindex` sans ce commentaire, sur `/espace-client/`, reste).
> Ne pas bloquer `robots.txt` à la place : Google ne verrait plus le `noindex`. Pas de Search Console ni de lien
> public (Instagram…) vers le site avant le lancement.

Objectif : sortir sur « Pilates Senlis » et « Pilates Chantilly ».

Fait dans le site :
- Titres et descriptions orientés « Pilates Reformer à Senlis » sur chaque page ; l'accueil mentionne aussi Chantilly (« à 15 minutes de Chantilly »).
- Accueil : le titre principal (H1) contient « Studio de Pilates Reformer à Senlis » (même rendu qu'avant) ; phrase T119 dans Infos pratiques sur l'accès depuis Chantilly, Chamant, Courteuil, Aumont-en-Halatte ; question T120/T121 dans la FAQ « Je viens de Chantilly ou des environs, est-ce loin ? ». **À vérifier par le studio : le temps de trajet depuis Chantilly (« une quinzaine de minutes »).**
- Fiche studio pour Google (données structurées `ExerciseGym` dans `index.html`) : adresse, horaires, villes desservies, prix de la première séance. À compléter quand on les aura : téléphone (`telephone`), e-mail, liens Instagram/Facebook (`sameAs`), coordonnées GPS (`geo`).
- Adresse canonique et aperçus de partage (Facebook, WhatsApp, Instagram…) sur chaque page indexée.
- `robots.txt` et `sitemap.xml` à la racine.
- 14/11 : fiche studio enrichie (17 communes desservies, liens Instagram / Facebook en `sameAs`, fondatrice, « Oise ») ; « Senlis » ajouté aux titres des pages Cours, Histoire, FAQ et Contact ; phrase T120 sous l'adresse de l'accueil : « À 15 minutes de Chantilly, Chamant et Aumont-en-Halatte. »

**Le nom de domaine n'est pas encore renseigné** : `__DOMAINE__` apparaît dans `index.html`, les 4 sous-pages, `robots.txt` et `sitemap.xml`. À remplacer partout par le vrai domaine (sans `https://` ni `/` final) avant ou pendant la mise en ligne, par exemple au déploiement : `grep -rl __DOMAINE__ . | xargs sed -i '' 's/__DOMAINE__/www.exemple.fr/g'`.

À faire hors du site (le plus important pour une recherche locale, c'est ce qui fait apparaître le studio sur la carte Google) :
1. **Fiche Google Business Profile** (business.google.com) : nom « Le Patio Pilates Club », catégorie « Studio de Pilates », adresse exacte, horaires, photos, lien vers le site et lien de réservation bsport. Demander des avis Google aux élèves dès l'ouverture.
2. **Google Search Console** (search.google.com/search-console) : valider le domaine, envoyer `sitemap.xml`. **À faire plus tard, une fois le site en ligne sur son domaine (noté le 14/11 à la demande d'Olivia).**
3. Même nom, adresse et téléphone partout : Google, bsport (marketplace), Instagram, Facebook, Pages Jaunes, ClassPass / Urban Sports Club si utilisés.
4. Bing Places (optionnel, reprend la fiche Google).

## Charte

- Marges des sections : le 14/11, les `padding-block` des `.wrap` de toutes les sections à fond uni (et de `.reserver-grille`) ont été **divisés par 2**, sur les 13 pages et dans `commun/bsport-*.css`. Exclus : le bandeau photo de l'accueil (`.hero`) et le pied de page.

- Couleurs : `--olive #5E530E`, `--olive-d #453D0A`, `--olive-l #7A6B2A`, `--sand #EBE6DC`, `--cream #F9F7F1`, `--paper #FDFCF9`, `--tan #C2B88F`, `--tan-2 #DBD1A8`, `--brown #574325`, `--muted #8B7B60`, `--ink #222222`.
- Police : Inter (Google Fonts).
- Logos dans `logo/` : `logo-le-patio-menu.png` (en-tête), `logo-le-patio-pilates-club.png` (pied de page, popup), `icone-le-patio.png` (favicon).

## Numéros des éléments (outil interne)

Chaque élément visible porte un attribut `data-num` (S section, C carte, T texte, P photo, I icône/logo, B bouton, L lien, F formulaire), numéroté par page et par lettre. `outils/numeros.js` les affiche en petits badges ; le bouton « Numéros » en bas de l'écran les montre ou les cache. Chaque badge commence par le numéro de la page (1 Accueil, 2 Première séance, 3 Planning, 4 Tarifs, 5 Contact, 6 Réserver ma première séance) : « 4-S06 » = section S06 de la page Tarifs. On s'en sert pour désigner une modification. L'en-tête a les mêmes numéros sur toutes les pages (I01 logo, L01–L08 liens, B00 Mon compte, B01 Réserver, B02 Menu, L00 langue). **Retiré des pages le 14/11** avant la mise en ligne : plus aucune page ne charge `outils/numeros.js` (le fichier reste dans `outils/`) ; les attributs `data-num` restent, sans effet. Pour le réafficher en local, remettre `<script src="…outils/numeros.js"></script>` en fin de page, ou dans la console du navigateur : `document.body.appendChild(Object.assign(document.createElement('script'),{src:'/outils/numeros.js'}))`.

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

- **Abonnements à l'année** (demandé le 15/11, **modifié le 15/11 : 1 mois offert, et non plus 2**) : ajouter un sélecteur **Mois / Année** au-dessus des 2 abonnements de Tarifs. À l'année = **1 mois offert** (on paie 11 mois sur 12), soit **8,3 % de réduction**, la même pour les deux formules.
  - Note de Fabian, telle quelle : « 1 mois offert (et non plus 2), soit 40 séances ou 20 séances selon le truc ». **À éclaircir** : sur 12 mois, l'abonnement 5 séances donne 60 séances (dont 5 offertes) et le 10 séances 120 séances (dont 10 offertes) ; les chiffres 40 et 20 ne correspondent pas à ce calcul.

  | | Au mois | À l'année (1 mois offert) | Équivalent / mois | Séances sur l'année | Prix d'une séance (mois → année) | Économie / an |
  |---|---|---|---|---|---|---|
  | 5 séances / mois | 150 € | **1 650 €** | 137,50 € | 60 (dont 5 offertes) | 30 € → **27,50 €** | 150 € |
  | 10 séances / mois | 280 € | **3 080 €** | 256,67 € | 120 (dont 10 offertes) | 28 € → **25,67 €** | 280 € |

  Pour mémoire, l'ancienne hypothèse « 2 mois offerts » donnait 1 500 € et 2 800 € par an (16,7 % de réduction).

  Côté site : sélecteur (style des pilules), mise en avant « 1 mois offert », prix par séance comme pour les forfaits. Côté bsport : créer les 2 abonnements annuels dans le back-office (nouveaux identifiants, à afficher dans le widget Abonnement ou en liens directs `checkout/7023/subscription/<id>`). L'abonnement mensuel actuel est « engagement 6 mois » : décider si l'annuel est payé en une fois ou mensualisé sur 12 mois.

- **Planning : afficher les places restantes** (signalé le 15/11 : le planning ne montre pas combien de places il reste dans un cours). Piste étudiée le 15/11 :
  - bsport ne propose aucune option pour ça dans le code du widget Calendrier ; **à vérifier dans le back-office** (Mon widget / paramètres de la marketplace) qu'il n'existe pas une case « afficher les places restantes », ce serait la solution la plus simple ;
  - sinon, faisable par nous : l'API publique que le widget appelle déjà, `https://api.production.bsport.io/book/v1/offer/?company=7023&coaches=155027&establishments=23608&available=true&min_date=…&max_date=…`, renvoie pour chaque cours `effectif` (6) et `validated_booking_count` (réservations confirmées), ainsi que `full` et la liste d'attente. Places restantes = `effectif − validated_booking_count`. Un script (comme `bsport-periodes.js`) interrogerait cette API pour la semaine affichée et ajouterait « 2 places restantes » / « Complet » sur chaque carte, retrouvée par sa date et son heure (les cartes n'ont pas d'identifiant de cours). Pas de clé nécessaire. Non testé avec des cours réservés (pas encore de séance avant l'ouverture).


- **Page Tarifs : photo de fond dès l'arrivée.** Remplacer le gros bloc de couleur unie du haut de page (`<section class="intro">`, fond `var(--sand)`, titre « Séance, forfait ou abonnement : à vous de choisir. ») par une photo de fond, comme le hero de l'accueil. Prévoir un voile sombre pour que le texte reste lisible, et passer le texte en clair. Photo à choisir dans `photos-le-patio/` ou à fournir par le studio.

- **Propositions mobiles** (écartées pour l'instant le 12/11) :
  1. Barre fixe du bas de l'accueil (S17) : à 360–375 px, « Première séance / 2 séances pour 35 € » tient sur 4 lignes serrées ; raccourcir le bouton (« Réserver »).
  2. Photos de 2000 px (jusqu'à 1 Mo) : prévoir des versions mobiles d'environ 800 px avec `srcset`.
  3. Petits textes sur mobile (surtitres 12 px, pied de page 13,5 px, pastille T05 11 px) : passer à 14 px ou plus.
  4. Popup « Coming soon » : ajouter une croix de fermeture visible.

## Autres points ouverts

- Dossier `versions/` (anciennes copies v1/v2) : redondant avec git, peut être supprimé.
- Hébergement : décidé le 13/11 (voir Architecture et hébergement). Mise en place à faire.
- Intégration des widgets bsport : Planning et Tarifs faits, Réserver ma première séance en propositions (voir « Widgets bsport sur le site ») ; widget leads à faire. Pages `en/` sans widgets pour l'instant.

## Versionnement

Dépôt git, branche `main`, distant `git@github.com:oalphonse/le-patio-pilates.git` (passé en SSH le 13/11). Avant chaque grosse modification, on fait un commit de sauvegarde. Pas de copies de fichiers.

Le push en SSH depuis le poste fonctionne (vérifié le 13/11).

**Sur le VPS (`~/le-patio-pilates`), le push fonctionne en SSH depuis le 14/11** : clé `~/.ssh/le_patio_deploy` (ed25519, « vps-le-patio-pilates-deploy »), alias `github-le-patio` dans `~/.ssh/config`, distant `git@github-le-patio:oalphonse/le-patio-pilates.git`. GitHub reconnaît la clé comme celle du compte `oalphonse` : elle donne accès à tous les dépôts de ce compte (pour la limiter au seul dépôt, la retirer du compte et la remettre en « Deploy key » du dépôt, avec « Allow write access »).
Le poste et le VPS ont chacun leur copie : avant de travailler sur l'un, récupérer le travail de l'autre (`git pull`), sinon on crée des historiques divergents.
