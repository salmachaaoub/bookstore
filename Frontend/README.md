# Frontend - Cloud Library Management System

Ce dossier contient toute l'application Frontend du projet Cloud Library.
L'application est construite avec React + Vite et consomme l'API Backend (`http://localhost:5000/api` par defaut).

## 1) Objectif du Frontend

Le Frontend permet de:
- afficher les pages publiques (accueil, a propos, support, livres publics)
- gerer l'authentification (inscription, connexion, deconnexion, refresh token)
- afficher un espace prive selon le role utilisateur
- gerer les categories, livres, emprunts et utilisateurs (selon permissions)

## 2) Stack technique

- React 19
- Vite 8
- React Router DOM 7
- Zustand (store auth + persistance)
- Axios (client HTTP + interceptors)
- Lucide React (icones)
- CSS global maison (`src/styles/globale.css`)

Note:
- Les dependances Tailwind existent dans `package.json`, mais l'UI actuelle est stylee principalement via `globale.css`.

## 3) Structure du dossier Frontend

```text
Frontend/
  index.html
  package.json
  vite.config.js
  Dockerfile
  .env.example
  public/
    favicon.svg
    images/logo.png
  src/
    main.jsx
    App.jsx
    styles/globale.css
    images/logo.png
    api/
      clientHttp.js
      extraireMessageErreur.js
      services/
        serviceAuth.js
        serviceLivres.js
        serviceCategories.js
        serviceEmprunts.js
        serviceUtilisateurs.js
    magasin/
      authentification.js
    composants/
      commun/
      navigation/
      securite/
    pages/
      publiques/
      privees/
    utils/
      formatage.js
```

## 4) Fichiers d'entree et config

- `index.html`
  - racine HTML de Vite
  - declaration du favicon
- `src/main.jsx`
  - point d'entree React
  - monte `<App />`
  - charge `src/styles/globale.css`
- `src/App.jsx`
  - declaration de toutes les routes publiques et privees
- `vite.config.js`
  - plugins Vite React + preset compiler React

## 5) Installation et demarrage

### Prerequis

- Node.js 20+ recommande
- Backend actif sur `http://localhost:5000`

### Commandes

```bash
cd Frontend
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## 6) Variables d'environnement

Fichier exemple: `.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

Si `VITE_API_URL` n'est pas defini, le fallback dans le code est:
- `http://localhost:5000/api`

## 7) Routage de l'application

### Routes publiques

- `/` -> Accueil
- `/a-propos` -> A propos
- `/support` -> Support
- `/connexion` -> Connexion
- `/inscription` -> Inscription
- `/nos-livres` -> Liste publique des livres
- `*` -> Page introuvable

### Routes privees (token requis)

- `/tableau-de-bord`
- `/profil`
- `/categories`
- `/categories/ajouter` (ADMIN, BIBLIOTHECAIRE)
- `/categories/:id/modifier` (ADMIN, BIBLIOTHECAIRE)
- `/livres`
- `/livres/ajouter` (ADMIN, BIBLIOTHECAIRE)
- `/livres/:id/modifier` (ADMIN, BIBLIOTHECAIRE)
- `/livres/:id/emprunter`
- `/emprunts/mes`
- `/emprunts` (ADMIN, BIBLIOTHECAIRE)
- `/emprunts/:id` (ADMIN, BIBLIOTHECAIRE)
- `/emprunts/:id/retour` (ADMIN, BIBLIOTHECAIRE)
- `/utilisateurs` (ADMIN)
- `/utilisateurs/:id/modifier` (ADMIN)

Alias:
- `/dashboard` redirige vers `/tableau-de-bord`

## 8) Authentification et securite (comment ca marche)

### Store auth (`src/magasin/authentification.js`)

Le store Zustand garde:
- `utilisateur`
- `jetonAcces`
- `jetonRafraichissement`

Actions principales:
- `setSession(...)`
- `setJetons(...)`
- `mettreAJourUtilisateur(...)`
- `deconnexion()`

Le store est persiste dans `localStorage` sous la cle:
- `stockage-auth-cloud-library`

### Client HTTP (`src/api/clientHttp.js`)

Avant chaque requete:
- ajoute `Authorization: Bearer <jetonAcces>` si disponible

En cas de `401`:
- tente `POST /auth/refresh` avec le `refreshToken`
- met a jour les jetons dans le store
- rejoue la requete initiale
- si refresh echoue: deconnexion + redirection vers `/connexion`

### Protection des routes (`src/composants/securite/RouteProtegee.jsx`)

- sans session: redirection `/connexion`
- avec session mais role non autorise: redirection `/tableau-de-bord`

## 9) Dossier `src/api` (services metier)

Les appels API sont separes par domaine:

- `serviceAuth.js`
  - inscription, connexion, refresh token
- `serviceLivres.js`
  - liste privee, liste publique (`/livres/public`), CRUD livres, toggle
- `serviceCategories.js`
  - CRUD categories + toggle
- `serviceEmprunts.js`
  - creer emprunt, mes emprunts, tous les emprunts, detail, retour
- `serviceUtilisateurs.js`
  - profil, mot de passe, liste users, update/delete/toggle user

Helper:
- `extraireMessageErreur.js` retourne le message backend standardise.

## 10) Dossier `src/composants`

### `commun/`

Composants reutilisables UI:
- `AlerteMessage`
- `BoutonAction`
- `CarteStatistique`
- `ChampFormulaire`
- `EtatVide`
- `IndicateurChargement`
- `PastilleRole`

### `navigation/`

- `NavigationPublique` (menu public + logo)
- `BarreLaterale` (menu prive filtre par role)
- `EntetePrive` (profil + deconnexion)
- `MiseEnPagePrivee` (layout global des pages privees)

### `securite/`

- `RouteProtegee` (controle auth + roles)

## 11) Dossier `src/pages`

### `pages/publiques`

- `Home/Accueil.jsx`
- `About/APropos.jsx`
- `Contact/Support.jsx`
- `Auth/Connexion.jsx`
- `Auth/Inscription.jsx`
- `Livres/AffichierLivres.jsx` (catalogue visiteur)
- `NotFound/PageIntrouvable.jsx`

### `pages/privees`

- `TableauDeBord.jsx` (KPIs selon role)
- `profil/ProfilUtilisateur.jsx`
- `categories/` (liste, ajout, modification)
- `livres/` (liste, ajout, modification, emprunt)
- `emprunts/` (mes emprunts, liste globale, detail, retour)
- `utilisateurs/` (liste + modification, ADMIN)

## 12) Styles et assets

- `src/styles/globale.css` contient le design system global:
  - layout public/prive
  - boutons
  - cartes
  - tableaux
  - responsive
- logos:
  - `src/images/logo.png` (utilise dans composants React)
  - `public/images/logo.png` (utilisable directement depuis `index.html`)

## 13) Utilitaires

`src/utils/formatage.js`:
- `extraireListe(payload)` normalise les listes API
- `extraireObjet(payload)` normalise les objets API
- `formaterDate(...)` format FR (`dd/mm/yyyy`)

## 14) Docker (dev)

Le `Dockerfile` lance l'app en mode dev Vite sur:
- host `0.0.0.0`
- port `5173`

## 15) Bonnes pratiques pour contribuer

- garder les appels API uniquement dans `src/api/services`
- reutiliser les composants de `composants/commun`
- proteger toute nouvelle page privee avec `RouteProtegee`
- respecter les roles au niveau UI et Backend
- garder les textes utilisateur clairs + messages d'erreur explicites

## 16) Checklist rapide de verification

- Backend lance sur `:5000`
- Front lance sur `:5173`
- inscription/connexion OK
- refresh token OK apres expiration access token
- affichage livres publics OK (`/nos-livres`)
- controle des roles OK (ADMIN/BIBLIOTHECAIRE/MEMBRE)

---

README aligne avec le code actuel du dossier `Frontend` au 24 mars 2026.
