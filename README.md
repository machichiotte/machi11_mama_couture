# 🧶 Mama Couture (machi11)

Site vitrine premium pour la créatrice **Mama Couture**, combinant la puissance de **Payload CMS** et la fluidité de **Nuxt 4**.

---

## 🏗 Structure du Projet
- **`apps/cms`** : Backend Payload CMS (Collections : Media, Collections, Créations, Messages).
- **`apps/web`** : Frontend Nuxt (structure Nuxt 4) avec design haut de gamme.
- **`packages/types`** : Définitions TypeScript partagées (générées auto).
- **`infra/docker`** : Infrastructure de développement locale (MongoDB).

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** : v20+ recommandé
- **Docker** : Pour MongoDB local
- **pnpm/npm** : Gestionnaire de paquets

### 1. Installation
```bash
# Installer les dépendances
npm install
```

### 2. Configuration
Créez les fichiers `.env` nécessaires :

**`apps/cms/.env`** :
```env
DATABASE_URL=mongodb://localhost:27017/machi11_mama_couture_dev
PAYLOAD_SECRET=votre-secret-ici
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_PUBLIC_SITE_URL=http://localhost:3001

# Cloudinary (optionnel en dev)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**`apps/web/.env`** :
```env
NUXT_PUBLIC_PAYLOAD_BASE_URL=http://localhost:3000
```

### 3. Lancer MongoDB (Docker)
```bash
# Démarrer MongoDB en arrière-plan
npm run db:dev

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
# Lancer CMS + Web simultanément
npm run dev
```

**Accès :**
- 🔐 **CMS Admin** : `http://localhost:3000/admin`
- 🌐 **Frontend** : `http://localhost:3001`
- 📡 **API REST** : `http://localhost:3000/api`

### 5. Premier Lancement
1. Créez votre premier utilisateur admin sur `/admin`
2. Configurez les **Globals** (Site Settings, About, UI Strings)
3. Ajoutez vos premières **Créations** et **Collections**

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev              # Lancer CMS + Web
npm run db:dev          # Lancer MongoDB

# Build
npm run build           # Build CMS + Web

# Types
npm run generate:types  # Générer les types TypeScript

# Qualité de code
npm run lint            # Linter tout le projet
npm run lint:fix        # Corriger automatiquement
```

---

## ✨ Fonctionnalités Premium Incluses
- 🖼️ **Cloudinary 2.0** : Gestion optimisée des médias avec dossier dynamique.
- 📧 **SMTP Plug & Play** : Système d'e-mail avec fallback console pour le développement.
- 🛡️ **Draft System** : Mode brouillon activé sur les collections critiques.
- 📁 **Proxy Single-URL** : Navigation fluide entre Nuxt et Payload sur un domaine unique.
- 📨 **Messages Auto** : Collection de contact avec notifications e-mail prêtes à l'emploi.
- 🎯 **SEO Ready** : Champs SEO (titre, description, image) sur toutes les collections.

---

## 🎨 Philosophie du Projet
Ce projet n'est pas qu'un simple site, c'est un **outil de mise en valeur artisanale** :
- **Design de Luxe** : Palette chaleureuse (Terracotta, Marron Café, Crème), typographies Serif élégantes et animations subtiles.
- **Performance** : Utilisation de Nuxt Image pour des chargements ultra-rapides.
- **Gestion simplifiée** : Centralisation des messages de contact et des contenus via une interface intuitive.

