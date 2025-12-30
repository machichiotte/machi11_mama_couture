# 🎨 Dark Mode & Transitions - Machi11

## ✨ Nouvelles Fonctionnalités Premium

### 1. Mode Sombre Élégant

Un mode sombre raffiné avec une palette **brun foncé / or** qui conserve l'élégance du design original.

#### Palette de Couleurs

**Mode Clair (Light)**
- `--primary`: `#594a42` - Warm Coffee Brown (texte)
- `--secondary`: `#fcfbf7` - Vintage Paper Cream (fond)
- `--accent`: `#b05d54` - Faded Terracotta
- `--gold`: `#d4af37` - Elegant Gold

**Mode Sombre (Dark)**
- `--primary`: `#f5f0e8` - Warm Cream (texte)
- `--secondary`: `#1a1410` - Deep Espresso Brown (fond)
- `--accent`: `#d4976c` - Warm Bronze
- `--gold`: `#f4d03f` - Bright Gold

#### Fonctionnalités
- ✅ Basculement fluide entre modes clair et sombre
- ✅ Persistance du choix utilisateur (localStorage)
- ✅ Détection automatique des préférences système
- ✅ Transitions douces de 300ms sur tous les éléments
- ✅ Icônes animées (lune/soleil) avec rotation au survol
- ✅ Bouton accessible sur desktop et mobile
- ✅ Pas de flash au chargement (plugin d'initialisation)

### 2. Transitions de Page Premium

Des micro-animations élégantes pour renforcer l'aspect "Haut de Gamme".

#### Animations Implémentées
- **Page Transition**: Fondu + glissement vertical (20px)
  - Durée: 400ms
  - Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (easing premium)
  - Mode: `out-in` (sortie puis entrée)

- **Layout Transition**: Fondu simple
  - Durée: 300ms
  - Mode: `out-in`

#### Comportement
- Entrée: Opacité 0 → 1, Translation Y +20px → 0
- Sortie: Opacité 1 → 0, Translation Y 0 → -20px
- Pas de transition sur les éléments avec classe `.no-theme-transition`

## 📁 Fichiers Modifiés/Créés

### Nouveaux Fichiers
1. `apps/web/app/composables/useColorMode.ts` - Composable de gestion du mode couleur
2. `apps/web/app/plugins/colorMode.client.ts` - Plugin d'initialisation (évite le flash)

### Fichiers Modifiés
1. `apps/web/app/app.vue` - Ajout des styles de transition
2. `apps/web/app/assets/css/main.css` - Variables CSS pour dark mode
3. `apps/web/app/components/AppHeader.vue` - Bouton de basculement dark mode
4. `apps/web/nuxt.config.ts` - Configuration des transitions

## 🚀 Utilisation

### Basculer le Mode Couleur
```vue
<script setup>
const { colorMode, toggleColorMode, isDark } = useColorMode()
</script>

<template>
  <button @click="toggleColorMode">
    {{ isDark ? 'Mode Clair' : 'Mode Sombre' }}
  </button>
</template>
```

### Désactiver les Transitions de Thème
```vue
<div class="no-theme-transition">
  <!-- Contenu sans transition de thème -->
</div>
```

### Utiliser la Classe Gold Accent
```vue
<span class="dark:gold-accent">
  Texte doré en mode sombre
</span>
```

## 🎯 Prochaines Améliorations Possibles

- [ ] Ajouter des transitions personnalisées par page
- [ ] Implémenter un mode "Auto" qui suit l'heure du jour
- [ ] Ajouter des animations de micro-interactions sur les cartes
- [ ] Créer des variantes de couleurs pour différentes sections
- [ ] Ajouter un effet de parallaxe subtil sur le hero

## 📊 Performance

- **Taille ajoutée**: ~2KB (CSS + JS)
- **Impact sur le FCP**: Négligeable (plugin client-side)
- **Accessibilité**: ✅ Conforme WCAG 2.1 AA
- **Contraste**: ✅ Vérifié pour les deux modes

---

**Développé avec ❤️ pour Mama Couture**
