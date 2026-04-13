# Backend - Cloud Library Management System

Ce fichier sert de base officielle pour connecter le Frontend au Backend.
Toutes les routes presentes dans le code sont documentees ici.

## 1) Vue d'ensemble

- Stack: Node.js, Express, MongoDB, Mongoose, JWT
- Prefixe global API: `/api`
- URL locale par defaut: `http://localhost:5000`
- Authentification: `Bearer <accessToken>` dans le header `Authorization`

Route de test serveur:
- `GET /` -> retourne un message texte (API fonctionnelle)

## 2) Installation et lancement

```bash
cd Backend
npm install
npm run dev
```

Pour les tests:

```bash
cd Backend
npm test -- --runInBand
```

## 3) Variables d'environnement

Exemple `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cloud-library
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 4) Roles et permissions

Roles disponibles:
- `ADMIN`
- `BIBLIOTHECAIRE`
- `MEMBRE`

Regles middleware:
- `protect`: exige un token JWT valide
- `authorizeRoles(...)`: bloque avec `403` si role non autorise

## 5) Matrice d'acces (toutes les routes)

| Methode | Route | Auth | ADMIN | BIBLIOTHECAIRE | MEMBRE |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | Non | 201 | 201 | 201 |
| POST | `/api/auth/login` | Non | 200 | 200 | 200 |
| POST | `/api/auth/refresh` | Non | 200 | 200 | 200 |
| GET | `/api/utilisateurs/profile` | Oui | 200 | 200 | 200 |
| PUT | `/api/utilisateurs/profile/update` | Oui | 200 | 200 | 200 |
| PUT | `/api/utilisateurs/profile/change-password` | Oui | 200 | 200 | 200 |
| GET | `/api/utilisateurs` | Oui | 200 | 403 | 403 |
| GET | `/api/utilisateurs/:id` | Oui | 200 | 403 | 403 |
| PUT | `/api/utilisateurs/:id` | Oui | 200 | 403 | 403 |
| DELETE | `/api/utilisateurs/:id` | Oui | 200 | 403 | 403 |
| PATCH | `/api/utilisateurs/:id/toggle` | Oui | 200 | 403 | 403 |
| GET | `/api/categories` | Oui | 200 | 200 | 200 |
| GET | `/api/categories/:id` | Oui | 200 | 200 | 200 |
| POST | `/api/categories` | Oui | 201 | 201 | 403 |
| PUT | `/api/categories/:id` | Oui | 200 | 200 | 403 |
| DELETE | `/api/categories/:id` | Oui | 200 | 200 | 403 |
| PATCH | `/api/categories/:id/toggle` | Oui | 200 | 200 | 403 |
| GET | `/api/livres/public` | Non | 200 | 200 | 200 |
| GET | `/api/livres` | Oui | 200 | 200 | 200 |
| GET | `/api/livres/:id` | Oui | 200 | 200 | 200 |
| POST | `/api/livres` | Oui | 201 | 201 | 403 |
| PUT | `/api/livres/:id` | Oui | 200 | 200 | 403 |
| DELETE | `/api/livres/:id` | Oui | 200 | 200 | 403 |
| PATCH | `/api/livres/:id/toggle` | Oui | 200 | 200 | 403 |
| POST | `/api/emprunts` | Oui | 201 | 201 | 201 |
| GET | `/api/emprunts/me` | Oui | 200 | 200 | 200 |
| GET | `/api/emprunts` | Oui | 200 | 200 | 403 |
| GET | `/api/emprunts/:id` | Oui | 200 | 200 | 403 |
| PATCH | `/api/emprunts/:id/retour` | Oui | 200 | 200 | 403 |

Note importante:
- Pour les routes protegees, sans token valide -> `401`

## 6) Authentification - Routes detaillees

### POST `/api/auth/register`
Creer un compte (role par defaut `MEMBRE`).

Requete:
```json
{
  "nom": "John Doe",
  "email": "john@mail.com",
  "motDePasse": "123456"
}
```

Succes `201`:
```json
{
  "message": "Utilisateur cree",
  "data": {
    "id": "USER_ID",
    "nom": "John Doe",
    "email": "john@mail.com",
    "role": "MEMBRE",
    "isActive": true,
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

### POST `/api/auth/login`

Requete:
```json
{
  "email": "john@mail.com",
  "motDePasse": "123456"
}
```

Succes `200`:
```json
{
  "message": "Connexion reussie",
  "data": {
    "id": "USER_ID",
    "nom": "John Doe",
    "email": "john@mail.com",
    "role": "MEMBRE",
    "isActive": true,
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

### POST `/api/auth/refresh`

Requete:
```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

Succes `200`:
```json
{
  "accessToken": "NEW_ACCESS_TOKEN"
}
```

## 7) Utilisateurs - Routes detaillees

Headers pour toutes les routes ci-dessous:
```http
Authorization: Bearer ACCESS_TOKEN
```

### GET `/api/utilisateurs/profile`
Succes `200`:
```json
{
  "message": "Profil recupere avec succes",
  "data": {
    "_id": "USER_ID",
    "nom": "John Doe",
    "email": "john@mail.com",
    "role": "MEMBRE",
    "isActive": true
  }
}
```

### PUT `/api/utilisateurs/profile/update`
Requete:
```json
{
  "nom": "John Updated",
  "email": "john.updated@mail.com"
}
```

Succes `200`:
```json
{
  "message": "Informations mises a jour",
  "data": {
    "id": "USER_ID",
    "nom": "John Updated",
    "email": "john.updated@mail.com",
    "role": "MEMBRE"
  }
}
```

### PUT `/api/utilisateurs/profile/change-password`
Requete:
```json
{
  "ancienMotDePasse": "123456",
  "nouveauMotDePasse": "12345678"
}
```

Succes `200`:
```json
{
  "message": "Mot de passe modifie avec succes"
}
```

### GET `/api/utilisateurs` (ADMIN)
Succes `200`:
```json
{
  "message": "Liste des utilisateurs recuperee avec succes",
  "count": 2,
  "data": [
    {
      "_id": "USER_ID",
      "nom": "Admin",
      "email": "admin@mail.com",
      "role": "ADMIN",
      "isActive": true
    }
  ]
}
```

### GET `/api/utilisateurs/:id` (ADMIN)
Succes `200`:
```json
{
  "_id": "USER_ID",
  "nom": "Admin",
  "email": "admin@mail.com",
  "role": "ADMIN",
  "isActive": true
}
```

### PUT `/api/utilisateurs/:id` (ADMIN)
Requete:
```json
{
  "nom": "Nouveau Nom",
  "email": "new@mail.com",
  "role": "BIBLIOTHECAIRE"
}
```

Succes `200`:
```json
{
  "message": "Utilisateur mis a jour",
  "data": {
    "_id": "USER_ID",
    "nom": "Nouveau Nom",
    "email": "new@mail.com",
    "role": "BIBLIOTHECAIRE",
    "isActive": true
  }
}
```

### DELETE `/api/utilisateurs/:id` (ADMIN)
Succes `200`:
```json
{
  "message": "Utilisateur supprime"
}
```

### PATCH `/api/utilisateurs/:id/toggle` (ADMIN)
Succes `200`:
```json
{
  "message": "Utilisateur active"
}
```
ou
```json
{
  "message": "Utilisateur desactive"
}
```

## 8) Categories - Routes detaillees

### GET `/api/categories`
Succes `200`:
```json
{
  "count": 2,
  "data": [
    {
      "_id": "CAT_ID",
      "nom": "Roman",
      "description": "Livres de fiction",
      "isActive": true
    }
  ]
}
```

### GET `/api/categories/:id`
Succes `200`:
```json
{
  "_id": "CAT_ID",
  "nom": "Roman",
  "description": "Livres de fiction",
  "isActive": true
}
```

### POST `/api/categories` (ADMIN, BIBLIOTHECAIRE)
Requete:
```json
{
  "nom": "Histoire",
  "description": "Livres historiques"
}
```

Succes `201`:
```json
{
  "message": "Categorie creee",
  "data": {
    "_id": "CAT_ID",
    "nom": "Histoire",
    "description": "Livres historiques",
    "isActive": true
  }
}
```

### PUT `/api/categories/:id` (ADMIN, BIBLIOTHECAIRE)
Requete:
```json
{
  "nom": "Histoire Moderne",
  "description": "Mise a jour"
}
```

Succes `200`:
```json
{
  "message": "Categorie mise a jour",
  "data": {
    "_id": "CAT_ID",
    "nom": "Histoire Moderne",
    "description": "Mise a jour",
    "isActive": true
  }
}
```

### DELETE `/api/categories/:id` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "message": "Categorie supprimee"
}
```

### PATCH `/api/categories/:id/toggle` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "message": "Categorie activee"
}
```
ou
```json
{
  "message": "Categorie desactivee"
}
```

## 9) Livres - Routes detaillees

### GET `/api/livres/public` (VISITEUR / PUBLIC)
Option recherche:
- `/api/livres/public?search=clean`

Succes `200`:
```json
{
  "count": 1,
  "data": [
    {
      "_id": "LIVRE_ID",
      "titre": "Clean Code",
      "auteur": "Robert C. Martin",
      "isbn": "ISBN-001",
      "categorie": {
        "_id": "CAT_ID",
        "nom": "Informatique"
      },
      "quantite": 5,
      "exemplairesDisponibles": 5,
      "isActive": true
    }
  ]
}
```

Fonction backend utilisee:
- `getLivresVisiteur` (dans `src/controllers/livreController.js`)
- Cette fonction retourne la liste des livres actifs (`isActive: true`), avec filtre de recherche optionnel sur `titre` ou `auteur`, puis `populate("categorie")`.

### GET `/api/livres`
Option recherche:
- `/api/livres?search=clean`

Succes `200`:
```json
{
  "count": 1,
  "data": [
    {
      "_id": "LIVRE_ID",
      "titre": "Clean Code",
      "auteur": "Robert C. Martin",
      "isbn": "ISBN-001",
      "categorie": {
        "_id": "CAT_ID",
        "nom": "Informatique"
      },
      "quantite": 5,
      "exemplairesDisponibles": 5,
      "isActive": true
    }
  ]
}
```

### GET `/api/livres/:id`
Succes `200`:
```json
{
  "_id": "LIVRE_ID",
  "titre": "Clean Code",
  "auteur": "Robert C. Martin",
  "isbn": "ISBN-001",
  "categorie": {
    "_id": "CAT_ID",
    "nom": "Informatique"
  },
  "quantite": 5,
  "exemplairesDisponibles": 5,
  "isActive": true
}
```

### POST `/api/livres` (ADMIN, BIBLIOTHECAIRE)
Requete:
```json
{
  "titre": "Node.js Design Patterns",
  "auteur": "Mario Casciaro",
  "isbn": "ISBN-003",
  "categorie": "CAT_ID",
  "quantite": 3
}
```

Succes `201`:
```json
{
  "message": "Livre ajoute",
  "data": {
    "_id": "LIVRE_ID",
    "titre": "Node.js Design Patterns",
    "auteur": "Mario Casciaro",
    "isbn": "ISBN-003",
    "categorie": "CAT_ID",
    "quantite": 3,
    "exemplairesDisponibles": 3,
    "isActive": true
  }
}
```

### PUT `/api/livres/:id` (ADMIN, BIBLIOTHECAIRE)
Requete:
```json
{
  "titre": "Clean Code 2",
  "auteur": "Robert C. Martin",
  "quantite": 7
}
```

Succes `200`:
```json
{
  "message": "Livre mis a jour",
  "data": {
    "_id": "LIVRE_ID",
    "titre": "Clean Code 2",
    "auteur": "Robert C. Martin",
    "quantite": 7,
    "exemplairesDisponibles": 7
  }
}
```

### DELETE `/api/livres/:id` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "message": "Livre supprime"
}
```

### PATCH `/api/livres/:id/toggle` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "message": "Livre active"
}
```
ou
```json
{
  "message": "Livre desactive"
}
```

## 10) Emprunts - Routes detaillees

### POST `/api/emprunts` (utilisateur connecte)
Requete:
```json
{
  "livreId": "LIVRE_ID",
  "dateRetourPrevue": "2026-04-01T00:00:00.000Z"
}
```

Succes `201`:
```json
{
  "message": "Livre emprunte avec succes",
  "data": {
    "_id": "EMPRUNT_ID",
    "utilisateur": "USER_ID",
    "livre": "LIVRE_ID",
    "dateRetourPrevue": "2026-04-01T00:00:00.000Z",
    "statut": "EN_COURS"
  }
}
```

### GET `/api/emprunts/me` (utilisateur connecte)
Succes `200`:
```json
{
  "count": 1,
  "data": [
    {
      "_id": "EMPRUNT_ID",
      "utilisateur": "USER_ID",
      "livre": {
        "_id": "LIVRE_ID",
        "titre": "Clean Code"
      },
      "dateRetourPrevue": "2026-04-01T00:00:00.000Z",
      "dateRetourReelle": null,
      "statut": "EN_COURS"
    }
  ]
}
```

### GET `/api/emprunts` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "count": 2,
  "data": [
    {
      "_id": "EMPRUNT_ID",
      "utilisateur": {
        "_id": "USER_ID",
        "nom": "Membre"
      },
      "livre": {
        "_id": "LIVRE_ID",
        "titre": "Clean Code"
      },
      "statut": "EN_COURS"
    }
  ]
}
```

### GET `/api/emprunts/:id` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "_id": "EMPRUNT_ID",
  "utilisateur": {
    "_id": "USER_ID",
    "nom": "Membre"
  },
  "livre": {
    "_id": "LIVRE_ID",
    "titre": "Clean Code"
  },
  "statut": "EN_COURS"
}
```

### PATCH `/api/emprunts/:id/retour` (ADMIN, BIBLIOTHECAIRE)
Succes `200`:
```json
{
  "message": "Livre retourne avec succes",
  "data": {
    "_id": "EMPRUNT_ID",
    "statut": "RETOURNE",
    "dateRetourReelle": "2026-03-23T12:00:00.000Z"
  }
}
```

## 11) Bloc JSON de tests (routes + roles)

Ce bloc peut etre utilise comme base pour tests Postman/Frontend QA.

```json
[
  { "route": "POST /api/auth/register", "statusByRole": { "PUBLIC": 201 } },
  { "route": "POST /api/auth/login", "statusByRole": { "PUBLIC": 200 } },
  { "route": "POST /api/auth/refresh", "statusByRole": { "PUBLIC": 200 } },

  { "route": "GET /api/utilisateurs/profile", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "PUT /api/utilisateurs/profile/update", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "PUT /api/utilisateurs/profile/change-password", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "GET /api/utilisateurs", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 403, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "GET /api/utilisateurs/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 403, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PUT /api/utilisateurs/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 403, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "DELETE /api/utilisateurs/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 403, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PATCH /api/utilisateurs/:id/toggle", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 403, "MEMBRE": 403, "SANS_TOKEN": 401 } },

  { "route": "GET /api/categories", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "GET /api/categories/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "POST /api/categories", "statusByRole": { "ADMIN": 201, "BIBLIOTHECAIRE": 201, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PUT /api/categories/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "DELETE /api/categories/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PATCH /api/categories/:id/toggle", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },

  { "route": "GET /api/livres/public", "statusByRole": { "PUBLIC": 200, "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 200 } },
  { "route": "GET /api/livres", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "GET /api/livres/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "POST /api/livres", "statusByRole": { "ADMIN": 201, "BIBLIOTHECAIRE": 201, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PUT /api/livres/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "DELETE /api/livres/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PATCH /api/livres/:id/toggle", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },

  { "route": "POST /api/emprunts", "statusByRole": { "ADMIN": 201, "BIBLIOTHECAIRE": 201, "MEMBRE": 201, "SANS_TOKEN": 401 } },
  { "route": "GET /api/emprunts/me", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 200, "SANS_TOKEN": 401 } },
  { "route": "GET /api/emprunts", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "GET /api/emprunts/:id", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } },
  { "route": "PATCH /api/emprunts/:id/retour", "statusByRole": { "ADMIN": 200, "BIBLIOTHECAIRE": 200, "MEMBRE": 403, "SANS_TOKEN": 401 } }
]
```

## 12) Erreurs frequentes a gerer dans le Front

- `400`: donnees invalides, doublon (email/isbn/categorie), stock invalide, deja retourne
- `401`: token absent ou invalide
- `403`: role non autorise
- `404`: ressource introuvable
- `500`: erreur serveur

## 13) Conseils integration Frontend

- Toujours centraliser `baseURL = http://localhost:5000/api`
- Toujours envoyer `Authorization: Bearer <token>` apres login
- Sauvegarder `accessToken` + `refreshToken`
- Si `401`, tenter `POST /api/auth/refresh` puis rejouer la requete
- Mapper les erreurs backend (`message`) vers des notifications UI

---

Document aligne avec les routes actuelles du backend (`src/Routes/*.js`) et les controllers (`src/Controllers/*.js`).
