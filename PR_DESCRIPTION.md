## Rattrapage KFOKAM48 — Module Ticket

### Contenu
- **Environnement** : PostgreSQL 16 en conteneur Docker (compose), backend Spring Boot connecté, frontend React + Vite.
- **API** : POST / GET (filtre statut) / PATCH fermer ; entité, repository, service, contrôleur ; DTO en entrée et en sortie ; validation 400 ; conflits 409 nommant RG-02 / RG-03 ; 404 ; Swagger documenté.
- **Écran** : liste (titre, statut, date, action), filtre par statut, formulaire, fermeture avec confirmation ; 4 états (chargement, données, vide, erreur + Réessayer) ; erreurs serveur affichées (400 / 409) sans `alert()`.

### Captures
1. Swagger — les trois endpoints : _(coller la capture ici)_
2. Refus 409 affiché dans l'écran : _(coller la capture ici)_

### Vérifier
`docker compose up -d`, puis `mvn spring-boot:run` (backend) et `npm run dev` (frontend). Voir le README.
