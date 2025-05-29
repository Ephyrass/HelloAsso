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