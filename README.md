# 🧶 Mama Couture (machi11)

Site vitrine premium pour la créatrice **Mama Couture**, combinant la puissance de **Payload CMS 3.0** et la rapidité de **Next.js 15**.

---

## 🏗 Structure du Projet

- **`apps/cms`** : Application Unifiée (Next.js 15 + Payload CMS). Contient à la fois l'admin et le site public.
- **`packages/types`** : Définitions TypeScript partagées.
- **`infra/docker`** : MongoDB local pour le développement.

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** : v20+ recommandé
- **Docker** : Pour MongoDB local
- **pnpm** : Gestionnaire de paquets (recommandé)

### 1. Installation

```bash
# Installer les dépendances
pnpm install
```

### 2. Configuration

Créez les fichiers `.env` nécessaires :

**`apps/cms/.env`** :

```env
DATABASE_URL=mongodb://localhost:27011/machi11_mama_couture_dev
PAYLOAD_SECRET=votre-secret-ici
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3011
PAYLOAD_PUBLIC_SITE_URL=http://localhost:3011

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Lancer MongoDB (Docker)

```bash
# Démarrer MongoDB en arrière-plan
pnpm run db:dev

# Vérifier que MongoDB tourne
docker ps | grep machi11_mama_couture_mongo_dev
```

**Commandes utiles MongoDB :**

```bash
# Arrêter MongoDB
docker stop machi11_mama_couture_mongo_dev

# Redémarrer MongoDB
docker restart machi11_mama_couture_mongo_dev

# Voir les logs MongoDB
docker logs machi11_mama_couture_mongo_dev

# Supprimer complètement (⚠️ perte de données)
docker compose -f infra/docker/docker-compose.yml down -v
```

### 4. Lancer le Projet (Mode Développement)

```bash
# Lancer l'application unifiée
pnpm run dev
```

**Accès :**

- 🔐 **Admin** : `http://localhost:3011/admin`
- 🌐 **Site Public** : `http://localhost:3011`
- 📡 **API** : `http://localhost:3011/api`

### 5. Premier Lancement

1. Créez votre premier utilisateur admin sur `/admin`
2. Configurez les **Globals** (Site Settings, About, UI Strings)
3. Ajoutez vos premières **Créations** et **Collections**

---

## 🔧 Commandes Utiles

```bash
# Développement
pnpm run dev              # Lancer CMS + Web
pnpm run db:dev          # Lancer MongoDB

# Build
pnpm run build           # Build l'application complète

# Types
pnpm run generate:types  # Générer les types TypeScript

# Qualité de code
pnpm run lint            # Linter tout le projet
pnpm run lint:fix        # Corriger automatiquement

# Tests
pnpm --filter cms test:int    # Lancer les tests d'intégration (Vitest)
pnpm --filter cms test:e2e    # Lancer les tests de bout en bout (Playwright)
```

---

## 🧪 Stratégie de Test

Le projet inclut une suite de tests automatisés pour garantir la stabilité en production :

1.  **Tests d'Intégration** (`apps/cms/tests/int`) : Valident la communication avec la base de données Payload et les Server Actions (ex: soumission du formulaire).
2.  **Tests E2E (End-to-End)** (`apps/cms/tests/e2e`) : Simulent le parcours réel d'un utilisateur sur le site (navigation, remplissage de formulaire, responsive).

---

## ✨ Fonctionnalités Premium Incluses

- 🖼️ **Cloudinary Integration** : Gestion optimisée des médias.
- 📧 **SMTP Integration** : Notification e-mail pour les messages de contact.
- 🛡️ **Draft System** : Mode brouillon activé.
- 📁 **Unified Deployment** : Déploiement unique sur Netlify (Next.js App Router).
- 📨 **Messages Auto** : Collection de contact avec notifications e-mail prêtes à l'emploi.
- 🎯 **SEO Ready** : Champs SEO (titre, description, image) sur toutes les collections.
- 📦 **Stock Management** : Gestion des statuts de disponibilité avec badges visuels (Portfolio, En stock, Vendu, Sur commande).

---

## 🎨 Philosophie du Projet

Ce projet n'est pas qu'un simple site, c'est un **outil de mise en valeur artisanale** :

- **Design de Luxe** : Palette chaleureuse (Terracotta, Marron Café, Crème), typographies Serif élégantes et animations subtiles.
- **Performance** : Utilisation de Next.js Image pour des chargements ultra-rapides.
- **Gestion simplifiée** : Centralisation des messages de contact et des contenus via une interface intuitive.
