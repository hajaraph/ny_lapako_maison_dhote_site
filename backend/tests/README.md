# Tests Unitaires Backend

Ce dossier contient les tests unitaires pour le backend utilisant `bun:test`.

## Structure

- `setup.ts` : Configuration et création de la base de données de test (in-memory)
- `auth.test.ts` : Tests pour l'authentification
- `avis.test.ts` : Tests pour les avis clients

## Exécution

```bash
cd backend
bun test
```

## État Actuel

**Note importante** : Les routes actuelles importent directement la DB depuis `../bdd`. 
Pour que les tests fonctionnent correctement avec une base de données isolée, 
il faut refactoriser les routes pour accepter une injection de DB.

Solution recommandée : Créer une factory de routes qui accepte une instance DB :

```typescript
// Au lieu de :
import { db } from '../bdd';
export const route = new Hono();

// Faire :
export function createRoute(db: DB) {
  const route = new Hono();
  // utiliser db injectée
  return route;
}
```

## Tests Actuels

Les tests couvrent :

### Auth
- Login avec identifiants valides
- Login avec email invalide
- Login avec mot de passe invalide
- Requête avec corps JSON invalide

### Avis
- Récupération de la liste des avis
- Création d'un avis valide
- Validation : nom_client requis
- Validation : date_sejour requise
- Validation : commentaire max 500 caractères
