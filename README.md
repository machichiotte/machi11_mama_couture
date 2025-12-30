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
Lancez la base de données MongoDB localement :
```bash
npm run db:dev
```

### 2. Lancer le Projet (Mode Développement)
Utilisez la commande racine pour lancer simultanément le CMS et le Web :
```bash
npm run dev
```
- **CMS Admin** : `http://localhost:3000/admin`
- **Frontend** : `http://localhost:3001`

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

