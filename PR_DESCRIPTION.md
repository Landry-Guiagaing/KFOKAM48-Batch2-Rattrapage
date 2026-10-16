## Rattrapage KFOKAM48 — Module Ticket

### Contenu
- **Environnement** : PostgreSQL 16 en conteneur Docker (compose), backend Spring Boot connecté, frontend React + Vite.
- **API** : POST / GET (filtre statut) / PATCH fermer ; entité, repository, service, contrôleur ; DTO en entrée et en sortie ; validation 400 ; conflits 409 nommant RG-02 / RG-03 ; 404 ; Swagger documenté.
- **Écran** : liste (titre, statut, date, action), filtre par statut, formulaire, fermeture avec confirmation ; 4 états (chargement, données, vide, erreur + Réessayer) ; erreurs serveur affichées (400 / 409) sans `alert()`.

### Captures
1. Swagger — les trois endpoints : <img width="1920" height="1032" alt="Capture d’écran du 2026-10-16 18-04-12" src="https://github.com/user-attachments/assets/81b98a8a-1988-4414-9a7e-b9def74c135f" />

2. Refus 409 affiché dans l'écran : <img width="1920" height="1032" alt="Capture d’écran du 2026-10-16 17-00-16" src="https://github.com/user-attachments/assets/edd5b703-20e8-4e43-85b7-10ab3c565c6c" />


### Vérifier
`docker compose up -d`, puis `mvn spring-boot:run` (backend) et `npm run dev` (frontend). Voir le README.
