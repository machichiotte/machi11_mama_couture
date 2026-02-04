# Atelier Petit Point - CMS

Backend Payload CMS pour la gestion de contenu de **Atelier Petit Point**.

## Fonctionnalités
- **Collections** : Créations, Utilisateurs, Médias
- **Globales** : Paramètres du site, Profil Artisan, UI Strings (Textes de l'interface)
- **API** : REST & GraphQL automatiquement générés
- **Admin** : Interface d'administration personnalisée

## UI Strings
Ce projet utilise une globale `UIStrings` pour externaliser tous les textes de l'interface utilisateur. Cela permet de modifier les labels du menu, les boutons et les titres sans toucher au code.

## Commandes
- `pnpm run dev` : Lancer le serveur de développement (http://localhost:3000)
- `pnpm run generate:types` : Générer les types TypeScript pour le frontend
- `pnpm run lint` : Linter le code avec ESLint
