# 🧶 Mama Couture (machi11)

Site vitrine premium pour la créatrice **Mama Couture**, combinant la puissance de **Payload CMS** et la fluidité de **Nuxt 4**.

## 📖 Documentation
Pour une compréhension approfondie, consultez la documentation Ops centralisée :
- 🏗️ **[Structure Complète](https://github.com/machichiotte/machi00_ops/blob/main/machi11_mama_couture/1-active/STRUCTURE.md)**
- 🛡️ **[Standards de Dév](https://github.com/machichiotte/machi00_ops/blob/main/machi11_mama_couture/1-active/DEVELOPMENT_STANDARDS.md)**
- 📘 **[Guide Technique](https://github.com/machichiotte/machi00_ops/blob/main/machi11_mama_couture/1-active/TECHNICAL_GUIDE.md)**
- 🚀 **[Checklist Mise en Prod](https://github.com/machichiotte/machi00_ops/blob/main/machi11_mama_couture/1-active/PRODUCTION_CHECKLIST.md)**

---

## 🏗 Structure du Projet
- **`apps/cms`** : Backend Payload CMS (Collections : Media, Collections, Créations, Messages).
- **`apps/web`** : Frontend Nuxt (structure Nuxt 4) avec design haut de gamme.
- **`packages/types`** : Définitions TypeScript partagées (générées auto).
- **`infra/docker`** : Infrastructure de développement locale (MongoDB).

---

## 🚀 Démarrage Rapide

### 1. Préparer l'Infrastructure
Lancez la base de données MongoDB via Docker :
```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

### 2. Lancer le Projet (CMS + Frontend)
Depuis la racine du projet :
```bash
npm install
npm run dev
```

Cela lancera simultanément :
- **CMS (Backend)** : [http://localhost:3000/admin](http://localhost:3000/admin)
- **Web (Frontend)** : [http://localhost:3001](http://localhost:3001)

---

## 🎨 Philosophie du Projet
Ce projet n'est pas qu'un simple site, c'est un **outil de mise en valeur artisanale** :
- **Design de Luxe** : Palette chaleureuse (Terracotta, Marron Café, Crème), typographies Serif élégantes et animations subtiles.
- **Performance** : Utilisation de Nuxt Image pour des chargements ultra-rapides.
- **Gestion simplifiée** : Centralisation des messages de contact et des contenus via une interface intuitive.

