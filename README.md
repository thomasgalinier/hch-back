# HCH Backend - API NestJS

API backend pour la gestion de cycles à domicile construite avec NestJS, Prisma et PostgreSQL.

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm
- Docker et Docker Compose
- PostgreSQL (si non utilisé via Docker)

## 🚀 Démarrage en local

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de la base de données en local

Démarrez PostgreSQL avec Docker :

```bash
cd docker && docker-compose -f 'docker-compose.local.yml' up -d 
cd ..
```

### 3. Configuration du schéma et utilisateur (local)

Une fois PostgreSQL démarré, configurez le schéma `app` et l'utilisateur :

```bash
# Se connecter à PostgreSQL (mot de passe: admin)
docker exec -it hch-back-db-1 psql -U admin -d hch

# Ou si le nom du container est différent, listez-les d'abord :
# docker ps | grep postgres
```

Dans le shell PostgreSQL, exécutez :

```sql
-- Créer le schéma app
CREATE SCHEMA IF NOT EXISTS app;

-- Accorder tous les droits sur le schéma app à l'utilisateur admin
GRANT ALL PRIVILEGES ON SCHEMA app TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app TO admin;

-- Permissions pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO admin;

-- Définir le schéma par défaut
ALTER USER admin SET search_path = app, public;

-- Quitter
\q
```

### 4. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
touch .env
```

Copiez-collez le contenu du `.env.schema` et modifiez l'URL `DATABASE_URL` et `ADMIN_DATABASE_URL` pour utiliser le schéma `app` :




### 5. Initialisation de la base de données

```bash
# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Générer le client Prisma
npx prisma generate
```

### 6. Démarrage du serveur

```bash
npm run dev
```

L'API sera disponible par défaut sur `http://localhost:8081`

### 7. Création d'un super administrateur

Le super administrateur peut être créé automatiquement via le script de seed Prisma.

```bash
npx ts-node prisma/seed.ts
```

Ce script va insérer un utilisateur `SUPER_ADMIN` avec les informations définies dans le fichier `prisma/seed.ts`.  
Pensez à adapter les informations (email, mot de passe, etc.) dans ce fichier avant d'exécuter la commande.

## 📜 Scripts disponibles

```bash
# Développement
npm run dev              # Démarrage en mode watch
npm run start            # Démarrage normal
npm run start:debug      # Démarrage avec debug

# Build et production
npm run build            # Build de l'application
npm run start:prod       # Démarrage en production

# Tests
npm run test             # Tests unitaires
npm run test:watch       # Tests en mode watch
npm run test:cov         # Tests avec couverture
npm run test:e2e         # Tests end-to-end

# Outils
npm run format           # Formatage avec Prettier
npm run lint             # Linting avec ESLint
npm run swagger:gen      # Génération documentation Swagger
```

## 🗄️ Gestion de la base de données (Prisma)

### Migrations

```bash
# Créer et appliquer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations existantes
npx prisma migrate dev

# Reset complet (développement uniquement)
npx prisma migrate reset

# Déployer en production
npx prisma migrate deploy
```

### Prisma Studio

Interface graphique pour explorer vos données :

```bash
npx prisma studio
```

Accessible sur `http://localhost:5555`

### Génération du client

```bash
npx prisma generate
```

## 🐳 Déploiement avec Docker

### Configuration pour la production

Créez un fichier `.env` pour la production en prenant exemple sur le `env.schema`:

### Configuration sécurisée de PostgreSQL

Pour la production, configurez un utilisateur PostgreSQL dédié avec des droits minimums et un schéma dédié.

**Note** : La base de données est automatiquement créée via Docker Compose, il suffit de configurer le schéma et les permissions.

```bash
# Se connecter au container PostgreSQL en production
docker exec -it nom_du_container_postgres psql -U postgres -d hch

# Ou trouver le nom du container :
# docker ps | grep postgres
```

Dans le shell PostgreSQL, exécutez :

```sql
-- Créer l'utilisateur de l'application
CREATE USER app_user WITH PASSWORD 'mot_de_passe_securise';

-- Installer l'extension PostGIS (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Créer le schéma dédié à l'application
CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION app_user;

-- Accorder les permissions nécessaires à app_user
GRANT CONNECT ON DATABASE hch TO app_user;
GRANT USAGE ON SCHEMA app TO app_user;
GRANT CREATE ON SCHEMA app TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app TO app_user;

-- Permissions pour les futures tables (importantes pour Prisma)
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO app_user;

-- Définir le schéma par défaut pour app_user
ALTER USER app_user SET search_path = app;

-- Quitter
\q
```

Mettez à jour votre `.env` de production :

```env
# Base de données (avec l'utilisateur app_user et le schéma app)
DATABASE_URL="postgresql://app_user:mot_de_passe_securise@db:5432/hch?schema=app"
ADMIN_DATABASE_URL="postgresql://app_user:mot_de_passe_securise@db:5432/hch?schema=app"

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin_password_securise
POSTGRES_DB=postgres

# Authentification
SECRET_KEY="your_very_secure_secret_key_here"

# Application
NODE_ENV=production
PORT=8081
```



### Déploiement avec docker-compose

```bash
# Build et démarrage
cd docker
docker compose --env-file ../.env up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### Build Docker manuel

```bash
# Build de l'image
docker build -t hch-backend:latest .

# Exécution
docker run -p 8081:8081 --env-file .env hch-backend:latest
```

## 🛠 Technologies utilisées

- **NestJS** - Framework Node.js
- **PostgreSQL** + **PostGIS** - Base de données
- **Prisma** - ORM et migrations
- **JWT** + **Passport** - Authentification
- **Swagger/OpenAPI** - Documentation API
- **Class Validator** - Validation des données
- **Jest** - Tests
- **Multer** - Upload de fichiers
- **@nestjs/schedule** - Tâches planifiées

## 📁 Structure du projet

```
src/
├── auth/               # Authentification et autorisation
├── bootstrap/          # Initialisation (super admin)
├── carte/              # Gestion des cartes
├── common/             # Guards, middleware, décorateurs
├── forfait/            # Gestion des forfaits
├── intervention/       # Gestion des interventions
├── prisma/             # Configuration Prisma
├── utils/              # Utilitaires
├── app.module.ts       # Module principal
├── main.ts             # Point d'entrée
└── swagger.ts          # Configuration Swagger
```

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Rôles disponibles :
- `SUPER_ADMIN` : Accès complet
- `ADMIN` : Gestion des utilisateurs et données
- `TECHNICIEN`: Gestion des interventions
- `USER` : Accès limité

## 📖 Documentation de l'API

Documentation Swagger disponible sur :
- `http://localhost:8081/api` (développement)
- `https://votre-domaine.com/api` (production)

## 🚨 Sécurité

### Important pour la production

⚠️ **Changez impérativement ces valeurs en production** :

1. `SECRET_KEY` : Utilisez une clé secrète forte et unique
2. `POSTGRES_PASSWORD` : Mot de passe PostgreSQL sécurisé
3. Ne pas exposer le port PostgreSQL publiquement
4. Configurez HTTPS
5. Utilisez un reverse proxy (nginx)

### Bonnes pratiques

- **Utilisateur PostgreSQL dédié** : Utilisez `app_user` avec des droits minimums en production
- **Sauvegardez régulièrement** votre base de données
- **Surveillez les logs** d'erreur et d'accès
- **Limitez les tentatives** de connexion (rate limiting)
- **Validez toutes les entrées** utilisateur
- **Isolez la base de données** : ne pas exposer le port PostgreSQL publiquement
- **Chiffrement des données** sensibles au repos
- **Rotation des clés** et mots de passe régulière