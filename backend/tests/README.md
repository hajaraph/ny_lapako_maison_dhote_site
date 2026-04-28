# Tests Unitaires Backend

Ce dossier contient les tests unitaires pour le backend utilisant `bun:test`.

## Architecture

Les tests utilisent un **fichier SQLite temporaire** isolé pour chaque suite de tests :

1. `setup.ts` crée un fichier `.sqlite` temporaire unique
2. `DB_PATH` est défini via `process.env` avant d'importer les routes
3. Les routes importées utilisent automatiquement ce fichier via `bdd.ts`
4. Le fichier est nettoyé après chaque suite de tests

## Structure

- `setup.ts` : Configuration et création de la DB de test (fichier temporaire)
- `auth.test.ts` : Tests pour l'authentification
- `avis.test.ts` : Tests pour les avis clients

## Exécution

```bash
cd backend
bun test              # Tous les tests
bun test auth.test.ts # Tests auth uniquement
bun test avis.test.ts # Tests avis uniquement
```

## Tests Couverts

### Auth (`auth.test.ts`)
- ✅ Login avec identifiants valides
- ✅ Login avec email invalide → 401
- ✅ Login avec mot de passe invalide → 401
- ✅ Corps JSON invalide → 400

### Avis (`avis.test.ts`)
- ✅ Récupération liste des avis
- ✅ Création d'un avis valide
- ✅ Validation : nom_client requis
- ✅ Validation : date_sejour requise
- ✅ Validation : commentaire max 500 caractères

## Débogage

Si les tests échouent avec "Identifiants invalides" ou des données inattendues, vérifier que :
1. `DB_PATH` est bien défini avant l'import dynamique des routes
2. Les données de test sont insérées après l'import des routes
3. Le fichier temporaire est bien créé et accessible
