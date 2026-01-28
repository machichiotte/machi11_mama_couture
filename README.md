# 🧶 Mama Couture (machi11)

Site vitrine premium pour la créatrice **Mama Couture**, combinant la puissance de **Payload CMS 3.0** et la rapidité de **Next.js 15**.

---

## 🏗 Structure du Projet

- **`apps/cms`** : Application Unifiée (Next.js 15 + Payload CMS). Contient à la fois l'admin et le site public.
- **`apps/web`** : ARCHIVE (Ancien frontend Nuxt).
- **`packages/types`** : Définitions TypeScript.
- **`infra/docker`** : MongoDB local pour le développement.

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** : v20+ recommandé
- **Docker** : Pour MongoDB local
- **pnpm/npm** : Gestionnaire de paquets

### 1. Installation

```bash
# Installer les dépendances
pnpm install
```

### 2. Configuration

Créez les fichiers `.env` nécessaires :

**`apps/cms/.env`** :

```env
DATABASE_URL=mongodb://localhost:27017/machi11_mama_couture_dev
PAYLOAD_SECRET=votre-secret-ici
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_PUBLIC_SITE_URL=http://localhost:3000

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

- 🔐 **Admin** : `http://localhost:3000/admin`
- 🌐 **Site Public** : `http://localhost:3000`
- 📡 **API** : `http://localhost:3000/api`

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
pnpm run build           # Build CMS + Web

# Types
pnpm run generate:types  # Générer les types TypeScript

# Qualité de code
pnpm run lint            # Linter tout le projet
pnpm run lint:fix        # Corriger automatiquement
```

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
- **Performance** : Utilisation de Nuxt Image pour des chargements ultra-rapides.
- **Gestion simplifiée** : Centralisation des messages de contact et des contenus via une interface intuitive.
