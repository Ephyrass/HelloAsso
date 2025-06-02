# Test technique front HelloAsso

[Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)

## Setup

Installer les dépendances

```bash
npm install
```

```bash
npm run dev
```

## Instructions

Affichez une page index correspondant au wireframe fourni

- [x] Vous pouvez récupérer une liste d'élément sur la route /api/events
- [x] Ces événements doivent être affichés dans la liste déroulante à gauche
- [x] Ces événements doivent être affichés sur la carte à droite (choix de la librairie à votre convenance)
- [x] Je peux filtrer la liste par titre d'événement (uniquement les événements déjà chargés). La liste et la carte doivent se mettre à jour.
- [x] Je peux filtrer la liste par catégorie d'événement (uniquement les événements déjà chargés). La liste et la carte doivent se mettre à jour.
- [x] Les 2 filtres sont cumulatifs
- [x] Lors du clic sur un item (liste ou carte), celui-ci est sélectionné. Il est mis en évidence sur la carte, et s'il n'est pas visible sur la liste de gauche, celle-ci défile pour le mettre en évidence.
- [x] La page filtrée doit être partageable.

## Améliorations potentielles

- [ ] **Traduction** - Ajouter la traduction automatique avec i18n
- [ ] **Mode sombre** - Implémentation d'un thème sombre avec bouton de basculement dans la navbar
- [ ] **Clustering de marqueurs** - Regroupement des marqueurs proches sur la carte pour améliorer la lisibilité
- [ ] **Vue détaillée des événements** - Page ou modal pour afficher plus d'informations sur un événement sélectionné
- [ ] **Filtres avancés** - Filtres par date ou distance
- [ ] **Géolocalisation** - Permettre à l'utilisateur de se localiser sur la carte
- [ ] **Favoris** - Possibilité de marquer des événements comme favoris (stockage local)
- [ ] **Partage social** - Boutons pour partager un événement sur les réseaux sociaux
- [ ] **Notifications** - Alertes pour les nouveaux événements à proximité
- [ ] **Pagination** - Pagination pour la liste des événements
- [ ] **Amélioration de l'accessibilité** - Navigation complète au clavier et compatibilité avec les lecteurs d'écran


Vous pouvez utiliser une librairie pour le CSS, à votre convenance.

Même si ce projet est petit, traitez-le comme un projet de plus grande ampleur en matière de pratiques de développement.

Codez bien, et have fun !

## Choix techniques et d'architecture

### Architecture générale
- **Nuxt 3** - Framework Vue.js moderne avec rendu côté serveur (SSR) qui offre de bonnes performances et SEO
- **Structure modulaire** - Organisation en composants réutilisables et testables indépendamment
- **TypeScript** - Utilisé pour le typage fort qui améliore la maintenabilité et réduit les erreurs potentielles
- **Tests unitaires** - Mis en place avec Vitest pour garantir la qualité du code et prévenir les régressions

### Gestion des données
- **Pinia** - Choisi comme gestionnaire d'état pour sa simplicité, son intégration avec Vue 3 et le support TypeScript
- **Store centralisé** - Un store eventStore qui gère tous les événements, filtres et sélections
- **URL synchronisée** - Les filtres et sélections sont reflétés dans l'URL pour faciliter le partage et la navigation
- **Optimisation des performances** - Filtrage côté client pour une réactivité immédiate sans requêtes serveur

### Cartographie
- **Leaflet** - Bibliothèque légère et performante pour l'affichage cartographique
- **Chargement dynamique** - Import dynamique de Leaflet pour optimiser le chargement initial
- **Gestion des marqueurs** - Système efficace pour mettre à jour les marqueurs lors des changements de filtres
- **Interactions carte-liste** - Synchronisation bidirectionnelle entre la sélection sur la carte et dans la liste

### UI/UX
- **Design responsive** - Interface adaptative pour une expérience utilisateur optimale sur tous les appareils
- **Composants découplés** - Séparation des responsabilités entre la liste, les filtres et la carte
- **Feedback visuel** - Mise en évidence des éléments sélectionnés et animations subtiles pour améliorer l'expérience
- **Ergonomie** - Filtres intuitifs et facilement accessibles, défilement automatique vers les éléments sélectionnés

### Bonnes pratiques
- **Composants atomiques** - Chaque composant a une responsabilité unique et claire
- **Gestion d'état prédictible** - État centralisé et mutations contrôlées
- **Code maintenable** - Structure claire et commentaires pertinents
- **Principes SOLID** - Application des principes de responsabilité unique et d'ouverture/fermeture

Cette architecture a été conçue pour être à la fois robuste et évolutive, permettant d'ajouter facilement de nouvelles fonctionnalités tout en maintenant une base de code propre et organisée.
